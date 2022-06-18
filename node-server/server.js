const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const sql = require("./connection");
const util = require("./util");
const log = require("log-to-file");

// Setting pagination limit
let paginationLimit = 5;

var app = express();

//using CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//middleware for express app
app.use(bodyParser.json());

const port = 3000;
const loggerFile = util.loggerFile;

// Initiating mysql connection with nodeJS
sql.connection.connect((err) => {
  if (!err) {
    log("mySQL connection successfully established..", loggerFile);
  } else {
    log("OOPS, mySQL connection failed..", loggerFile);
  }
});

//defining the API routes
app.post("/createUser", (req, res) => {
  let body = req.body;
  if (
    body.userName == "" ||
    body.userName == undefined ||
    body.emailID == "" ||
    body.emailID == undefined
  ) {
    log("/createUser 400 Error , Failed due to incorrect body", loggerFile);
    res.status(400).send("Failed due to incorrect body");
  }

  let values = [[body.emailID, body.userName, body.password]];
  log("values from client:", loggerFile);
  log(values, loggerFile);
  let query = "INSERT INTO USERS VALUES ?";

  sql.connection.query(query, [values], (err, rows, fields) => {
    if (err) {
      log("/createUser Failure in trying to create user..!!", loggerFile);
      log(err, loggerFile);
      res.status(500).send("Failure in trying to create users");
    } else {
      log("/createUser User created successfully", loggerFile);
      res.status(200).send();
    }
  });
});

app.post("/isEmailExist", (req, res) => {
  let body = req.body;
  if (body.emailID == "" || body.emailID == undefined) {
    log(
      "/isEmailExist 400 Error , Failed due to incorrect emailID",
      loggerFile
    );
    res.status(400).send("Failed due to incorrect emailID");
  }

  //Initial checking if empID exists on DB
  let values1 = [[body.emailID]];
  log("values from client:", loggerFile);
  log(values1, loggerFile);
  let query1 = "Select userName from users where emailID = ?";

  sql.connection.query(query1, [values1], (err, rows, fields) => {
    if (err) {
      log(
        "/isEmailExist Failure in trying to fetch user userName from database",
        loggerFile
      );
      log(err, loggerFile);
      res.status(500).send("Failure in trying Login");
    } else {
      if (rows.length == 0) {
        log("/isEmailExist email not found", loggerFile);
        res.status(500).send("email not found");
      } else {
        log("/isEmailExist email found and returned", loggerFile);
        res.status(200).send();
      }
    }
  });
});

app.post("/loginUser", (req, res) => {
  let body = req.body;
  if (
    body.emailID == "" ||
    body.emailID == undefined ||
    body.password == "" ||
    body.password == undefined
  ) {
    log(
      "/loginUser 400 Error , Failed due to incorrect credentials",
      loggerFile
    );
    res.status(400).send("Failed due to incorrect credentials");
  }
  let values = [[body.emailID]];
  log("values from client:", loggerFile);
  log(values, loggerFile);
  let query = "Select * from users where emailID = ?";

  sql.connection.query(query, [values], (err, rows, fields) => {
    if (err) {
      log(
        "/loginUser Failure in trying to fetch user credentials from database",
        loggerFile
      );
      log(err, loggerFile);
      res.status(500).send("Failure in trying Login");
    } else {
      console.log("user data :");

      //passwormatch
      let fetchedRow = rows[0];
      if (fetchedRow.password == body.password) {
        log("/loginUser User Logged in successfully", loggerFile);
        res.status(200).send(rows[0]);
      } else {
        log("/loginUser User Login failed. Password incorrect", loggerFile);
        res.status(401).send();
      }
    }
  });
});

app.post("/postQuestion", (req, res) => {
  let body = req.body;
  if (
    body.author == undefined ||
    body.title == undefined ||
    body.description_ == undefined
  ) {
    log("/postQuestion 400 Error , Failed due to incorrect body", loggerFile);
    res.status(400).send("Failed due to incorrect body");
  } else if (body.author == "" || body.title == "" || body.description_ == "") {
    log("/postQuestion 400 Error , Failed due to empty fields", loggerFile);
    res.status(400).send("Failed due to empty fields");
  } else {
    let qid = util.generateUniqueID();
    let values = [
      [
        qid,
        body.author,
        util.currentDateTime_mysql(),
        body.title,
        body.description_,
        body.sampleCode,
      ],
    ];
    log("values from client:", loggerFile);
    log(values, loggerFile);
    let query =
      "insert into questions(qid,author,postedOn,title,description_,sampleCode) values ?";

    sql.connection.query(query, [values], (err, rows, fields) => {
      if (err) {
        log("/postQuestion Failure in trying to post question..!!", loggerFile);
        log(err, loggerFile);
        res.status(500).send("Failure in trying to post question");
      } else {
        let tags = body.tags;
        let flag = 0;
        if (tags.length > 0) {
          let tagValues = [];
          for (let i = 0; i < tags.length; i++) {
            let tempArr = [];
            tempArr.push(qid);
            tempArr.push(tags[i]);
            tagValues.push(tempArr);
          }
          let tagQuery = "insert into questionTags values ?";
          sql.connection.query(tagQuery, [tagValues], (err, rows, fields) => {
            if (err) {
              log(
                "/postQuestion Failure in trying to insert in table questionTags..!!",
                loggerFile
              );
              log(err, loggerFile);
              flag = 1;
            } else {
              log(
                "/postQuestion Successful insert in table questionTags",
                loggerFile
              );
            }
          });
        }
        if (flag == 0) {
          log("/postQuestion Question posted successfully", loggerFile);
          res.status(200).send();
        }
      }
    });
  }
});

//with pagination. Filters =>'mostCommented','oldest','mostLiked','newest'
app.get("/displayAllQuestions", (req, res) => {
  let params = req.query;
  let query = "";
  let pageNumber = params.pageNumber;
  let recordOffset = (pageNumber - 1) * paginationLimit;

  if (params.filter == "mostCommented")
    query =
      "select * from questions order by commentsCount desc LIMIT ? OFFSET ?";
  else if (params.filter == "oldest")
    query = "select * from questions order by postedOn LIMIT ? OFFSET ?";
  else if (params.filter == "mostLiked")
    query = "select * from questions order by votes desc LIMIT ? OFFSET ?";
  //default => params.filter=="newest"
  else {
    query = "select * from questions order by postedOn desc LIMIT ? OFFSET ?";
  }
  sql.connection.query(
    query,
    [paginationLimit, recordOffset],
    (err, rows, fields) => {
      if (err) {
        log(
          "/displayAllQuestions Failure in trying to display questions..!!",
          loggerFile
        );
        log(err, loggerFile);
        res.status(500).send("Failure in trying to display questions");
      } else {
        //merging the tags from different table 'questionTags'

        let tagsQuery = "select * from questionTags";
        sql.connection.query(tagsQuery, (err, rowTags, fields) => {
          if (err) {
            log(
              "/displayAllQuestions Failure in trying to fetch tags from table 'questionTags' ..!!",
              loggerFile
            );
            log(err, loggerFile);
            res.status(500).send("Failure in trying to fetch tags");
          } else {
            //merging the tags from different table 'questionTags'
            log(
              "/displayAllQuestions Successfull fetch of tags from table 'questionTags'",
              loggerFile
            );
            //res.status(200).send(rowsTags);

            for (let i = 0; i < rowTags.length; i++) {
              let qid = rowTags[i].qid;
              for (let j = 0; j < rows.length; j++) {
                if (rows[j].qid == qid) {
                  if (rows[j].tags == undefined) rows[j].tags = [];
                  rows[j].tags.push(rowTags[i].tag);
                }
              }
            }
            let response = [];
            log(
              "/displayAllQuestions Questions list found successfully",
              loggerFile
            );
            response.push(rows);
            let questionCountQuery =
              "select count(*) as totalQuestions from questions";
            sql.connection.query(questionCountQuery, (err, rows, fields) => {
              if (err) {
                log(
                  "/fetchQuestions Failure in trying to find count of rows in table 'questions'",
                  loggerFile
                );
                log(err, loggerFile);
                res.status(500).send("Failure");
              } else {
                response.push(rows[0]);
                res.status(200).send(response);
              }
            });
          }
        });
      }
    }
  );
});

app.get("/displaySpecificQuestion", (req, res) => {
  let params = req.query;
  let qid = params.qid;
  if (qid == undefined || qid == "") {
    log(
      "/displaySpecificQuestion Failure due to empty qid parameter",
      loggerFile
    );
    log(err, loggerFile);
    res.status(400).send("Empty qid not accepted");
  } else {
    query = "select * from questions where qid = ?";
    sql.connection.query(query, [qid], (err, rows, fields) => {
      if (err) {
        log(
          "/displaySpecificQuestion Failure in trying fetch specific question detials",
          loggerFile
        );
        log(err, loggerFile);
        res.status(500).send("Failure in trying to display questions");
      } else {
        let tagsQuery = "select * from questionTags";
        sql.connection.query(tagsQuery, (err, rowTags, fields) => {
          if (err) {
            log(
              "/displayAllQuestions Failure in trying to fetch tags from table 'questionTags' ..!!",
              loggerFile
            );
            log(err, loggerFile);
            res.status(500).send("Failure in trying to fetch tags");
          } else {
            rows = rows[0];
            //merging the tags from different table 'questionTags'

            let tags = [];
            for (let i = 0; i < rowTags.length; i++) {
              if (rowTags[i].qid == qid) {
                tags.push(rowTags[i].tag);
              }
            }
            log(
              "/displaySpecificQuestion Successfull fetch of tags from table 'questionTags'",
              loggerFile
            );
            rows.tags = tags;
            res.status(200).send(rows);
          }
        });
      }
    });
  }
});

//with pagination Filters => Java, Python, ML, Front-end, others
app.post("/filterByTags", (req, res) => {
  let params = req.query;
  let pageNumber = params.pageNumber;
  let recordOffset = (pageNumber - 1) * paginationLimit;

  let body = req.body;
  let filterTag = body.filterTag;

  let query = mysql.format(
    "SELECT * FROM QUESTIONS WHERE  QID IN (SELECT DISTINCT QID FROM QUESTIONTAGS WHERE TAG IN (?)) LIMIT ? OFFSET ? ",
    [filterTag, paginationLimit, recordOffset]
  );
  sql.connection.query(query, (err, rows, fields) => {
    if (err) {
      log(
        "/filterByTags Failure in trying to filter questions by tags..!!",
        loggerFile
      );
      log(err, loggerFile);
      res.status(500).send("Failure in trying to filter questions by tags");
    } else {
      let tagsQuery = "select * from questionTags";
      sql.connection.query(tagsQuery, (err, rowTags, fields) => {
        if (err) {
          log(
            "/filterByTags Failure in trying to fetch tags from table 'questionTags' ..!!",
            loggerFile
          );
          log(err, loggerFile);
          res.status(500).send("Failure in trying to fetch tags");
        } else {
          let response = [];
          //merging the tags from different table 'questionTags'
          log(
            "/filterByTags Successfull fetch of tags from table 'questionTags'",
            loggerFile
          );
          //res.status(200).send(rowsTags);

          for (let i = 0; i < rowTags.length; i++) {
            let qid = rowTags[i].qid;
            for (let j = 0; j < rows.length; j++) {
              if (rows[j].qid == qid) {
                if (rows[j].tags == undefined) rows[j].tags = [];
                rows[j].tags.push(rowTags[i].tag);
              }
            }
          }
          response.push(rows);

          let query = mysql.format(
            "SELECT COUNT(*) as totalQuestions FROM QUESTIONS WHERE  QID IN (SELECT DISTINCT QID FROM QUESTIONTAGS WHERE TAG IN (?))",
            [filterTag]
          );
          sql.connection.query(query, (err, rowsQuestionsCount, fields) => {
            if (err) {
              log(
                "/filterByTags Failure in trying to filter questions by tags..!!",
                loggerFile
              );
              log(err, loggerFile);
              res
                .status(500)
                .send("Failure in trying to filter questions by tags");
            } else {
              console.log(
                "Question count :" + rowsQuestionsCount[0].totalQuestions
              );
              response.push(rowsQuestionsCount);
              log("/filterByTags Questions list sent successfully", loggerFile);
              console.log(response);
              res.status(200).send(response);
            }
          });
        }
      });
    }
  });
});

app.post("/postComment", (req, res) => {
  let body = req.body;
  let currentCount = body.commentsCount;
  if (body.author == undefined || body.description_ == undefined) {
    log("/postComment 400 Error , Failed due to incorrect body", loggerFile);
    res.status(400).send("Failed due to incorrect body");
  } else if (body.author == "" || body.title == "" || body.description_ == "") {
    log("/postComment 400 Error , Failed due to empty fields", loggerFile);
    res.status(400).send("Failed due to empty fields");
  } else {
    let commentID = util.generateUniqueID();
    let values = [
      [
        commentID,
        body.author,
        util.currentDateTime_mysql(),
        body.description_,
        body.sampleCode,
      ],
    ];
    log("values from client:", loggerFile);
    log(values, loggerFile);
    let query =
      "insert into comments(commentID,author,postedOn,description_,sampleCode) values ?";

    sql.connection.query(query, [values], (err, rows, fields) => {
      if (err) {
        log("/postComment Failure in trying to post comment..!!", loggerFile);
        log(err, loggerFile);
        res.status(500).send("Failure in trying to post comment");
      } else {
        //inserting commentID against questionID in 'questionComments' table.
        let query2 = "insert into questionComments values ?";
        let values2 = [[body.qid, commentID]];
        log("values from client:", loggerFile);
        log(values2, loggerFile);
        sql.connection.query(query2, [values2], (err, rows, fields) => {
          if (err) {
            log(
              "/postComment Failure in trying to post data in questionComments..!!",
              loggerFile
            );
            log(err, loggerFile);
            res.status(500).send("Failure in trying to post comment");
          } else {
            log(
              "/postComment Successfully posted data in questionComments.",
              loggerFile
            );

            console.log("Comments count :");
            console.log(currentCount);
            console.log("QID :");
            console.log(body.qid);

            //Updating the comments count in questions table
            let query = "UPDATE QUESTIONS SET commentsCount = ? WHERE qid = ?";

            sql.connection.query(
              query,
              [currentCount, body.qid],
              (err, rows, fields) => {
                if (err) {
                  log(
                    "/postComment Failure in trying increment comments count in QUESTIONS table",
                    loggerFile
                  );
                  log(err, loggerFile);
                  res.status(500).send("Failure in trying to post comment");
                } else {
                  log("/postComment Comment Posted Successfully", loggerFile);
                  res.status(200).send();
                }
              }
            );
          }
        });
      }
    });
  }
});

app.get("/displayComments", (req, res) => {
  let params = req.query;
  if (params.qid == undefined) {
    log(
      "/displayComments 400 Error , Failed due to incorrect body",
      loggerFile
    );
    res.status(400).send("Failed due to incorrect body");
  } else if (params.qid == "") {
    log("/displayComments 400 Error , Failed due to empty fields", loggerFile);
    res.status(400).send("Failed due to empty fields");
  } else {
    query =
      "select * from comments where commentID IN (select commentID from questionComments where qid = ?)";
    sql.connection.query(query, [params.qid], (err, rows, fields) => {
      if (err) {
        log(
          "/displayComments Failure in trying to fetch comments..!!",
          loggerFile
        );
        log(err, loggerFile);
        res.status(500).send("Failure in trying to fetch comments");
      } else {
        log("/displayComments Successfully fetched comments", loggerFile);
        res.status(200).send(rows);
      }
    });
  }
});

// Only call this after your app is closed. else it'll get executed before the nodes waits for url endpoints
//sql.connection.end();

app.listen(port, () => {
  console.log(`==== Node server started at port ${port} ====`);
  log(`==== Node server started at port ${port} ====`, loggerFile);
});

const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const sql = require("./connection");
const util = require("./util");
const log = require("log-to-file");

var app = express();

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

  let values = [[body.emailID, body.userName]];
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
      res.status(200).send("user created successfully");
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
    let values = [
      [
        util.generateUniqueID(),
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
        log("/postQuestion Question posted successfully", loggerFile);
        res.status(200).send("Question posted successfully");
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

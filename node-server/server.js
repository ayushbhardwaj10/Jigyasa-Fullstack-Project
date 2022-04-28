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
sql.mysqlConnection.connect((err) => {
  if (!err) {
    log("mySQL connection successfully established..", loggerFile);
  } else {
    log("OOPS, mySQL connection failed..", loggerFile);
  }
});

//defining the routes

app.post("/createUser", (req, res) => {
  let body = req.body;
  if (
    body.userName == "" ||
    body.userName == undefined ||
    body.emailID == "" ||
    body.emailID == undefined
  ) {
    res.status(404).send("Failed due to incorrect body");
    log("/createUser 404 Error , Failed due to incorrect body", loggerFile);
  } else {
    res.status(200).send("user created successfully");
    log("/createUser user created successfully", loggerFile);
  }
});

// Only call this after your app is closed. else it'll get executed before the nodes waits for url endpoints
//sql.mysqlConnection.end();

app.listen(port, () => {
  console.log(`==== Node server started at port ${port} ====`);
  log(`==== Node server started at port ${port} ====`, loggerFile);
});

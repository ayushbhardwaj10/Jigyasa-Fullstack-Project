const crypto = require("crypto");

let loggerFile = "server.log";

let generateUniqueID = () => {
  return crypto.randomBytes(8).toString("hex");
};

let currentDateTime_mysql = () => {
  var date = new Date();
  let mysqlDate = date.toISOString().slice(0, 19).replace("T", " ");
  return mysqlDate;
};

//exporting utilities
exports.generateUniqueID = generateUniqueID;
exports.loggerFile = loggerFile;
exports.currentDateTime_mysql = currentDateTime_mysql;

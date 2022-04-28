const crypto = require("crypto");

let generateUniqueID = () => {
  return crypto.randomBytes(8).toString("hex");
};

let loggerFile = "server.log";

exports.generateUniqueID = generateUniqueID;
exports.loggerFile = loggerFile;

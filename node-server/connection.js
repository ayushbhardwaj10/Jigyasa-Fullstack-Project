const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "jigyasa",
});

exports.mysqlConnection = connection;

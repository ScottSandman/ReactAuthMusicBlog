require("dotenv").config();
const db = require("mysql");

const conn = db.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

console.log(process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASSWORD);

conn.connect((err) => {
  if (err) throw err;
  conn.query("CREATE DATABASE IF NOT EXISTS musicblog");
  conn.query("USE musicblog");
  conn.query(
    "CREATE TABLE IF NOT EXISTS  users (id INT UNIQUE NOT NULL AUTO_INCREMENT, username VARCHAR(30) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL, PRIMARY KEY(id));",
    (result, error, fields) => {
      if (error) throw error;
      console.log(result);
    }
  );
  conn.query(
    "CREATE TABLE IF NOT EXISTS blog (id INT UNIQUE NOT NULL AUTO_INCREMENT, title VARCHAR(100) NOT NULL, date DATE, author_id INT NOT NULL, post VARCHAR(4000) NOT NULL, PRIMARY KEY (id), FOREIGN KEY (author_id) REFERENCES users(id));",
    (result, error, fields) => {
      if (error) throw error;
      console.log("result", result, "fields", fields);
    }
  );
  conn.end();
});

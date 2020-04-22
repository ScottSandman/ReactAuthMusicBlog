require("dotenv").config();
const express = require("express");
const db = require("mysql2/promise");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");

const PORT = 4000;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

const pool = db.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

app.post("/user", async (request, response) => {
  try {
    const salt = await bcrypt.genSalt();
    // console.log(salt);
    const hashedPW = await bcrypt.hash(request.body.password, salt);
    // console.log(hashedPW);
    const conn = await pool.getConnection();
    const result = await conn.query(
      `INSERT INTO musicblog.users (username, password) VALUES ('${request.body.username}', '${hashedPW}');`
    );
    const userInfo = { username: request.body.username };
    const accessToken = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET);
    response.status(201).cookie("AccessToken", accessToken).send(userInfo);
    // response.status(201).send(result);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.post("/users/login", async (request, response) => {
  try {
    console.log(request.body);
    const conn = await pool.getConnection();
    const result = await conn.query(
      `SELECT * FROM musicblog.users WHERE username = '${request.body.username}';`
    );
    // console.log(result);
    // console.log(result[0][0]);
    // console.log(result[0][0].username);
    if (result[0][0] === undefined) {
      response.status(404).send("Username does not exist");
    }
    if (await bcrypt.compare(request.body.password, result[0][0].password)) {
      const userInfo = { username: request.body.username };
      const accessToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET);
      console.log(userInfo, accessToken);

      response.status(202).cookie("AccessToken", accessToken).send(userInfo);
      // response.status(202).send();
    }
  } catch (error) {
    response.status(500).send(error);
    console.log(error);
  }
});

app.post("/blogPosts", authorizeUser, async (request, response) => {
  try {
    console.log(request.body);
    const con = await pool.getConnection();
    const userID = await con.query(
      `SELECT id FROM musicblog.users WHERE username = '${request.user.username}'`
    );
    // console.log(userID[0][0].id);
    const result = await con.query(
      `INSERT INTO musicblog.blog (author_Id, date, title, post) VALUES (${userID[0][0].id}, CURDATE(), '${request.body.title}','${request.body.post}');`
    );
    response.status(201).send(result);
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

app.get("/blogs", async (request, response) => {
  try {
    const con = await pool.getConnection();
    const result = await con.query(
      `SELECT musicblog.blog.id, title, date, author_id, post, username FROM musicblog.blog JOIN musicblog.users ON (musicblog.blog.author_id = musicblog.users.id)`
    );
    response.status(201).send(result);
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

app.get("/blogPosts", authorizeUser, async (request, response) => {
  try {
    const userID = request.user.id;
    const testQuery = `SELECT * FROM musicblog.blog WHERE userId = ${userID};`;
    console.log(testQuery);
    const con = await pool.getConnection();
    const authorName = request.user.username;
    const userInfo = await con.query(
      `SELECT * FROM musicblog.blog WHERE userId = ${userID};`
    );
    response.status(200).send({ author: authorName, data: userInfo });
    await con.release();
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

function authorizeUser(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    console.log(token, "token  is null");
    return res.sendStatus(401);
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) res.sendStatus(403);
    req.user = user;
    console.log(req.user);
    next();
  });
}

app.get("/posts", authorizeUser, async (req, res) => {
  console.log(req.user.username);
  res.json(posts.filter((post) => post.username === req.user.username));
});

app.get("/users/login", async (req, res) => {
  try {
    res.sendFile(path.join(__dirname + "/signin.html"));
  } catch (error) {
    res.status(500).send();
  }
});

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));

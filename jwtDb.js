require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 7000;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  password: "1234",
  host: "localhost",
  port: 5432,
  database: "test",
});
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(
  bodyParser.json({
    extended: true,
  })
);

app.get("/users", authenticateToken, (req, res) => {
  pool.query("SELECT * FROM users ORDER BY id ASC", (error, results) => {
    if (!error) {
      res.json(
        results.rows.filter(
          (element) =>
            element.email === req.user.email &&
            element.password === req.user.password
        )
      );
    }
  });
});
app.get("/", (req, res) => {
  pool.query("SELECT * FROM users ORDER BY id ASC", (error, results) => {
    if (!error) {
      res.json(results.rows);
    }
  });
});
app.post("/users", async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log(email, password, hashedPassword)
    pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2)",
      [email, hashedPassword],
      (error, results) => {
        if (!error) {
          res.status(201).send(`User added `);
        }
      }
    );
  } catch {
    res.status(500).send();
  }
});

app.post("/users/login", async (req, res) => {
  pool.query("SELECT * FROM users ORDER BY id ASC", async (error, results) => {
    let user;
    if (!error) {
      user = results.rows.find((element) => element.email === req.body.email);
    }
    if (user == null) {
      return res.status(400).send("email or password is not correct!");
    }
    try {
      if (await bcrypt.compare(req.body.password, user.password)) {
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET_KEY,{ expiresIn: '1m'});
        res.json({
          // authentication: 'Success',
          accessToken: accessToken,
        });
      } else {
        res.send("Not Allowed");
      }
    } catch {
      res.status(500).send();
    }
  });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return res.status(401).send();
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).send();
    }
    req.user = user;
    next();
  });
}
app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});

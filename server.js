const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 7000;
const pool = require("./util/sqlConnection");
const cookieParser = require("cookie-parser");
const login = require("./util/login");
const signup = require("./util/signup");
const logout = require("./util/logout");
const createTable = require("./util/sqlQuery");
const authMiddleware = require("./util/authMiddleware");
const authentication = require("./util/authentication");

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
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

app.get("/", createTable);
app.get("/auth", authMiddleware, authentication);
app.post("/signup", signup);
app.post("/login",login);
app.post("/logout", logout);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});

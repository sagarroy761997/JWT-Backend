
const pool = require("./sqlConnection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  pool.query("SELECT * FROM users ORDER BY id ASC", async (error, results) => {
    let user;
    if (error) {
      res.send(error.message);
    } else {
      user = results.rows.find((element) => element.email === req.body.email);
    }
    if (user == null) {
      return res.status(400).send("email is not correct or the user is not signed up!");
    }
    try {
      if (await bcrypt.compare(req.body.password, user.password)) {
        const accessToken = jwt.sign(
          user,
          process.env.ACCESS_TOKEN_SECRET_KEY,
          { expiresIn: "1m" }
        );
        res.cookie("accessToken", accessToken, { httpOnly: true });
        // response.setHeader('Set-Cookie', 'foo=bar; HttpOnly');
        res.send({
          // authentication: 'Success',
          accessToken: accessToken,
          message: 'email and password are correct'
        });
      } else {
        res.send("password is wrong");
      }
    } catch {
      res.status(500).send();
    }
  });
};

module.exports = login;

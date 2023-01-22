const pool = require("./sqlConnection");

const authentication = (req, res) => {
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
};

module.exports = authentication;

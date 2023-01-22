const pool = require("./sqlConnection");
const bcrypt = require("bcrypt");

const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log(email, password, hashedPassword)
    pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2)",
      [email, hashedPassword],
      (error, results) => {
        if(error){
            res.send(error.message)
        }else{
          res.status(201).send(`User added `);
        }
      }
    );
  } catch {
    res.status(500).send();
  }
};

module.exports = signup;
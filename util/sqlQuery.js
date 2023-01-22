const pool = require("./sqlConnection");

const createTable = (request, response) => {
  pool.query(
    `CREATE TABLE if not exists users (
      id uuid DEFAULT uuid_generate_v4 (),
     email varchar unique NOT NULL,
     password varchar(100) unique NOT NULL,
     PRIMARY KEY (id, email, password));`,
    (error, results) => {
      if (error) {
        response.send(error.message);
      }
      response.json("user table created");
    }
  );
};

module.exports = createTable;

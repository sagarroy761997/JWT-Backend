const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  password: "1234",
  host: "localhost",
  port: 5432,
  database: "test"
});
let users= [];
const getUsers = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    users = results.rows;
    console.log(users);
    response.status(200).send(results.rows)
  })
}

const getUserById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.json(results.rows)
  })
}

const createUser = (request, response) => {
  const { name, password } = request.body

  pool.query('INSERT INTO users (name, password) VALUES ($1, $2)', [name, password], (error, results) => {
    if (error) {
      throw error
    }
    response.send(`User added with ID: ${results.insertId}`)
  })
}

const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { name, password } = request.body

  pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3',
    [name, password, id],
    (error) => {
      if (error) {
        throw error
      }
      response.send(`User modified with ID: ${id}`)
    }
  )
}

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)
  console.log(users);

  pool.query('DELETE FROM users WHERE id = $1', [id], (error) => {
    if (error) {
      throw error
    }
    response.send(`User deleted with ID: ${id}`)
  })
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  users
}
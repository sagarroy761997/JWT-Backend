require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 5000;
const db = require("./util/dbPool");
const bcrypt = require("bcrypt");

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


app.get("/getUsers", db.getUsers);
app.get("/getUsersById/:id", db.getUserById);
app.post("/createUsers", db.createUser);
app.put("/updateUsers/:id", db.updateUser);
app.delete("/deleteUsers/:id", db.deleteUser);


const users = []

app.get('/users', (req, res) => {
  res.json(users)
})

app.post('/users', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const user = { name: req.body.name, password: hashedPassword }
    users.push(user)
    res.status(201).send()
  } catch {
    res.status(500).send()
  }
})

app.post('/users/login', async (req, res) => {
  const user = users.find(user => user.name === req.body.name)
  if (user == null) {
    return res.status(400).send('Cannot find user')
  }
  try {
    if(await bcrypt.compare(req.body.password, user.password)) {
      res.send('Success')
    } else {
      res.send('Not Allowed')
    }
  } catch {
    res.status(500).send()
  }
})

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});

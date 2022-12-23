
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const db = require("./util/dbPool");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

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


const users =[];
app.get('/users',authenticateToken, (req, res) => {
  // res.json(req.user)
  res.json(users.filter(element => element.name === req.user.name))
})
app.get('/',db.getUsers)
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
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET_KEY)
      res.json({
        // authentication: 'Success',
        accessToken: accessToken
      })
    } else {
      res.send('Not Allowed')
    }
  } 
  catch {
    res.status(500).send()
  }
})
function authenticateToken(req,res,next){
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if(token == null){
    return res.status(401).send();
  }
  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET_KEY,(err,user) => {
    if(err){
      return res.status(403).send();
    }
    req.user = user
    next()
  })
}
app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});

module.exports = users;

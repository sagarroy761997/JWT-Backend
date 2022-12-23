
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const server = express();

const db = require("./util/dbPool");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const auth = require('./auth')
server.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
server.use(
  bodyParser.json({
    extended: true,
  })
);


server.get("/getUsers", db.getUsers);
server.get("/getUsersById/:id", db.getUserById);
server.post("/createUsers", db.createUser);
server.put("/updateUsers/:id", db.updateUser);
server.delete("/deleteUsers/:id", db.deleteUser);


const users = auth.user;

server.get('/users',authenticateToken, (req, res) => {
  // res.json(req.user)
  res.json(users.filter(element => element.name === req.user.name))
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
server.listen(4000);



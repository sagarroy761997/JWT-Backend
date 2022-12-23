require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const authorization = express();
const db = require("./util/dbPool");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

authorization.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
authorization.use(
  bodyParser.json({
    extended: true,
  })
);

const users=[]

authorization.post('/users', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const user = { name: req.body.name, password: hashedPassword }
    users.push(user)
    res.status(201).send()
  } catch {
    res.status(500).send()
  }
})

authorization.post('/users/login', async (req, res) => {
  const user = users.find(user => user.name === req.body.name)
  if (user == null) {
    return res.status(400).send('Cannot find user')
  }
  try {
    if(await bcrypt.compare(req.body.password, user.password)) {
      const accessToken = generateAccessTOken(user);
      const refreshToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET_KEY)
      res.json({
        // authentication: 'Success',
        accessToken: accessToken,
        refreshToken: refreshToken,
      })
    } else {
      res.send('Not Allowed')
    }
  } 
  catch {
    res.status(500).send()
  }
})
function generateAccessTOken(user){
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET_KEY,{expiresIn: '15s'})
}
authorization.listen(6000);

exports.user = users;

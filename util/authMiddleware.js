require("dotenv").config();
const jwt = require("jsonwebtoken");
function authMiddleware(req, res, next) {
  // const authHeader = req.headers["authorization"];
  // const token = authHeader && authHeader.split(" ")[1];
  const token = req.cookies.accessToken;
  if (token == null) {
    return res.status(401).send();
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).send(err.message);
    }
    req.user = user;
    next();
  });
}

module.exports = authMiddleware;

const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.send("No token provided");

  try {
    const decoded = jwt.verify(token, config.get("jwtprivatekey"));
    req.user = decoded; //here we pass customerid from token
    next();
  } catch (error) {
    res.send("Invalid Token");
  }
};

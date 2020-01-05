module.exports = function basicAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).send("Supply authentication headers");
    const err = new Error("Supply authentication headers");
    return next(err);
  }
  let auth = new Buffer.from(authHeader.split(" ")[1], "base64")
    .toString()
    .split(":");
  let user = auth[0];
  let password = auth[1];
  if (user == "admin" && password == 123) {
    next();
  } else {
    res.send("Wrong username or password");
  }
};

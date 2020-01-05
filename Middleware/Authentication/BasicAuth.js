module.exports = function basicAuth(req, res, next) {
  // if (!req.signedCookies.user) {
  if (!req.session.user) {
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
    //hardcoded
    if (user == "admin" && password == 123) {
      // res.cookie("user", "admin", { signed: true });
      req.session.user = "admin";
      next();
    } else {
      res.send("Wrong username or password");
    }
  } else {
    // if (req.signedCookies.user == "admin") {
    if (req.session.user == "admin") {
      next();
    } else {
      res.send("Wrong username or password in cookies");
    }
  }
};

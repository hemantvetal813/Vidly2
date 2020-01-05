module.exports = function basicAuth(req, res, next) {
  // if (!req.signedCookies.user) {
  if (!req.session.username) {
    res.send("you are not authenticated in basic auth");
  } else {
    // if (req.signedCookies.user == "admin") {
    if (req.session.username == "authenticated") {
      next();
    } else {
      res.send("you are not authenticated in basicAuth");
    }
  }
};

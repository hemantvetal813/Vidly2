module.exports = function(req, res, next) {
  if (!req.user.isAdmin) return res.send("You are not an admin");
  next();
};

const express = require("express");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const config = require("config");
const JwtAuth = require("../Middleware/Authentication/Jwt_Auth");

const router = express.Router();
const { validateUser, User } = require("../models/user");
const bcrypt = require("bcryptjs");

router.route("/").get(async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.send(error.message);
  }
});
router.route("/me").get(JwtAuth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});
router.post("/signup", async (req, res) => {
  const { error } = validateUser(req);
  if (error) return res.send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (user) return res.send("Email already registered");

  try {
    const newUser = new User(_.pick(req.body, ["name", "password", "email"]));

    //hashing password
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);
    result = await newUser.save();

    //jwt token
    const payload = { _id: newUser._id };
    const token = genrateJwtToken(payload);
    res.header("x-auth-token", token);

    res.send(_.pick(result, ["name", "password", "email", "_id"]));
  } catch (error) {
    res.send(error.message);
  }
});
router.post("/login", async (req, res, next) => {
  if (!req.session.username) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).send("Supply authentication headers");
      const err = new Error("Supply authentication headers");
      return next(err);
    }
    let auth = new Buffer.from(authHeader.split(" ")[1], "base64")
      .toString()
      .split(":");
    let username = auth[0];
    let password = auth[1];
    const userObject = await User.find({ name: username });
    if (username == userObject[0].name && password == userObject[0].password) {
      // res.cookie("user", "admin", { signed: true });
      req.session.username = "authenticated";
      res.send("you are authenticated users");

      next();
    } else if (userObject.name == null) {
      return res.send("username does not exist");
    } else if (password !== userObject.password) {
      return res.send("Wrong password");
    }
  } else {
    // if (req.signedCookies.user == "admin") {
    if (req.session.username == "authenticated") {
      res.send("you are authenticated users in session");

      next();
    } else {
      res.send("you are not authenticated users");
    }
  }
});
router.post("/loginMosh", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.send("Invalid User");

  //hashing password
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.send("Invalid Password");

  //the things you want to send to client
  const payload = { _id: user._id };
  const token = genrateJwtToken(payload);

  res.send(token);
});
router.get("/logout", async (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie("session-id");
    res.redirect("/");
  } else {
    res.send("you are not logged in");
  }
});

function genrateJwtToken(payload) {
  return jwt.sign(payload, config.get("jwtprivatekey"));
}
module.exports = router;

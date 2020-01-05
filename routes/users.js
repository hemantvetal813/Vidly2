const express = require("express");
const router = express.Router();
const { validateUser, User } = require("../models/user");
const mongoose = require("mongoose");

router.route("/").get(async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
    console.log(users);
  } catch (error) {
    res.send(error.message);
  }
});

router.post("/signup", async (req, res) => {
  const user = await User.find({ name: req.body.name });
  if (user.length !== 0) return res.send("Username not available");
  try {
    const newUser = new User(req.body);
    result = await newUser.save();
    res.send(result);
    res.redirect("/login");
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
    console.log(userObject);
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
router.get("/logout", async (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie("session-id");
    res.redirect("/");
  } else {
    res.send("you are not logged in");
  }
});
module.exports = router;

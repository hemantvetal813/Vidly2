const express = require("express");
const genres = require("../routes/genres");
const customers = require("../routes/customers");
const mongooseTutorial = require("../routes/mongooseTutorial");
const error = require("../Middleware/error");
var cookieParser = require("cookie-parser");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const BasicAuth = require("../Middleware/Authentication/BasicAuth");
const users = require("../routes/users");

module.exports = function(app) {
  app.use(express.json());
  // app.use(cookieParser("813"));
  app.use(
    session({
      name: "session-id",
      secret: "813",
      saveUninitialized: false,
      resave: false,
      store: new FileStore()
    })
  );
  app.get("/", (req, res) => {
    res.send("Welcome Page");
  });
  app.use("/users", users);
  app.use(BasicAuth); //uncomment to use basic Auth include authorization header while passing req

  app.use("/genres", genres);
  app.use("/mongod", mongooseTutorial);
  app.use("/customers", customers);

  app.use(error);
};

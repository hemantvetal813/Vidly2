const helmet = require("helmet");
var cookieParser = require("cookie-parser");
const BasicAuth = require("./Middleware/Authentication/BasicAuth");
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var logger = require("morgan");
const mongoose = require("mongoose");
const config = require("config");
const session = require("express-session");
const FileStore = require("session-file-store")(session);

mongoose
  .connect("mongodb://localhost/vidly2", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true
  })
  .then(() => "Connected to MOngoDB")
  .catch(err => {
    "could not connect to mongodb", err;
  });

var app = express();
// console.log(config.get("vidly_password"));

//security  module
app.use(helmet());
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser("813"));
app.use(
  session({
    name: session,
    secret: "813",
    saveUninitialized: false,
    resave: false,
    store: new FileStore()
  })
);

app.use(BasicAuth); //uncomment to use basic Auth include authorization header while passing req

app.use(express.static(path.join(__dirname, "public")));

//routes
require("./startup/routes")(app);

module.exports = app;

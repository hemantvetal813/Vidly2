const helmet = require("helmet");

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var logger = require("morgan");
const mongoose = require("mongoose");
const config = require("config");

//for referencing documents check customers route file
//for embedding documents check mongooseTutorial file
// for basic auth check users file
mongoose
  .connect("mongodb://localhost/vidly2", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true
  })
  .then(() => console.log("Connected to MOngoDB"))
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

app.use(express.static(path.join(__dirname, "public")));

//routes
require("./startup/routes")(app);

module.exports = app;

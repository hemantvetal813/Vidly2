const helmet = require("helmet");
var express = require("express");
var path = require("path");
var logger = require("morgan");

//for referencing documents mongodb check customers route file
//for embedding documents mongodb check mongooseTutorial file
// for basic auth,jwt auth check users file

var app = express();
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
//put logging before to catch error first
require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();

module.exports = app;

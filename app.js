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
    poolSize: 5, //default 5 connections allowed, generally use poolSize = 10
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(data => {
    console.log("Connected to MOngoDB");
    const db = data;
  })
  .catch(err => {
    "could not connect to mongodb", err;
  });

var app = express();

// You must run your file with the same CLI program (and instance) you used to set the variable value.
// In Command Prompt: set PORT=5000
// In Power Shell: $env:PORT=5000
// In Bash (Windows): export PORT=5000
// After that, run your program node app.js and it works.

// If you're using the integrated terminal of VSCode to run your file,
// but using another CLI program (or instance) to set the value of PORT, is not going to work unless you
// change that value permanently by using set PORT 5000 either with the Command Prompt or Power Shell
//  (I don't know how to do it from Bash for Windows). In that case, you would need to restart VSCode for
//   running your file with the last value of PORT.
//if it still not working
// then save env variable manually in settings and restart the pc
if (!config.get("jwtprivatekey")) {
  console.log("jwtprivatekey not set, in cmd: set vidly_password=something");
  process.exit(1);
}

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

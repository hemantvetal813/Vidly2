//logging errors
const winston = require("winston");
require("winston-mongodb");

//by using this module we dont have to use try catch everwhere
require("express-async-errors");
//there is custom error handler middleware in middle ware folder asyncMiddleware
module.exports = function() {
  winston.add(
    new winston.transports.File({ filename: "logFile.log" }),
    new winston.transports.Console({ colorize: true, prettyprint: true })
  ); //to store in user pc
  winston.add(
    new winston.transports.MongoDB({ db: "mongodb://localhost/vidly2" })
  ); //to store in Database
  process.on("uncaughtException", ex => {
    //     console.log("we got an exception");
    winston.error(ex.message, ex);
    process.exit(1);
  });
  process.on("unhandledRejection", rej => {
    winston.error(rej.message, rej);
    process.exit(1);
  });
};

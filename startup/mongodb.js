const mongoose = require("mongoose");
module.exports = function() {
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
    });

  //no need to catch as global error handler is there
  //   .catch(err => {
  //     "could not connect to mongodb", err;
  //   });
};

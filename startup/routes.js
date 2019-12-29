const express = require("express");
const genres = require("../routes/genres");
const error = require("../Middleware/error");

module.exports = function(app) {
  app.use(express.json());

  app.use("/genres", genres);

  app.use(error);
};

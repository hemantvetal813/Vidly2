const express = require("express");
const genres = require("../routes/genres");
const customers = require("../routes/customers");
const mongooseTutorial = require("../routes/mongooseTutorial");
const error = require("../Middleware/error");

module.exports = function(app) {
  app.use(express.json());

  app.use("/genres", genres);
  app.use("/mongod", mongooseTutorial);
  app.use("/customers", customers);

  app.use(error);
};

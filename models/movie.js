const Joi = require("joi");
const mongoose = require("mongoose");
const { genreSchema } = require("../models/genre");
Joi.objectId = require("joi-objectid")(Joi);

const Movie = mongoose.model(
  "Movie",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 250,
      trim: true,
      unique: true
    },
    genre: { type: genreSchema, required: true },
    numberInStock: { type: Number, min: 0 },
    dailyRentalRate: { type: Number, min: 0 }
  })
);

function validateMovie(req) {
  const schema = {
    title: Joi.string()
      .required()
      .min(1)
      .max(250),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number()
      .required()
      .min(0),
    dailyRentalRate: Joi.number()
      .required()
      .min(0)
  };
  return Joi.validate(req.body, schema);
}

module.exports.validateMovie = validateMovie;
module.exports.Movie = Movie;

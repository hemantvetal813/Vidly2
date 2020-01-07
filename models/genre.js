const Joi = require("joi");
const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 500
  }
});
const Genre = mongoose.model("Genre", genreSchema);

function validateGenre(req) {
  const schema = {
    name: Joi.string()
      .required()
      .min(5)
      .max(500)
  };
  return Joi.validate(req.body, schema);
}

module.exports.validateGenre = validateGenre;
module.exports.genreSchema = genreSchema;
module.exports.Genre = Genre;

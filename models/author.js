const Joi = require("joi");
const mongoose = require("mongoose");

const Author = mongoose.model(
  "Author",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 500
    },
    bio: {
      type: String,
      required: true
    }
  })
);

function validateAuthor(req) {
  const schema = {
    name: Joi.string()
      .required()
      .min(5)
      .max(500),
    bio: Joi.string().required()
  };
  return Joi.validate(req.body, schema);
}

module.exports.validateAuthor = validateAuthor;
module.exports.Author = Author;

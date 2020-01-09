const Joi = require("joi");
const mongoose = require("mongoose");

const mongooseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 500
  },
  password: {
    type: String,
    min: 8,
    max: 200
  },
  email: {
    type: String,
    required: true,
    min: 5,
    max: 255,
    unique: true
  },
  isAdmin: { type: Boolean, default: false }
});
const User = mongoose.model("User", mongooseSchema);

function validateUser(req) {
  const schema = {
    name: Joi.string()
      .required()
      .min(5)
      .max(500),
    password: Joi.string()
      .required()
      .min(8)
      .max(20),
    email: Joi.string()
      .required()
      .min(8)
      .max(200)
      .email()
  };
  return Joi.validate(req.body, schema);
}

module.exports.validateUser = validateUser;
module.exports.User = User;

const Joi = require("joi");
const mongoose = require("mongoose");

const Customer = mongoose.model(
  "Customer",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 500
    },
    phone: {
      type: Number,
      // required: true,
      min: 1000000000,
      max: 9999999999
    },
    password: {
      type: String,
      min: 8,
      max: 20
    },
    isGold: { type: Boolean, default: false },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "Author" }
  })
);

function validateCustomer(req) {
  const schema = {
    name: Joi.string()
      .required()
      .min(5)
      .max(500),
    phone: Joi.number()
      .min(1000000000)
      .max(9999999999),
    password: Joi.string()
      .min(8)
      .max(20),
    isGold: Joi.boolean(),
    author: Joi.string()
  };
  return Joi.validate(req.body, schema);
}

module.exports.validateCustomer = validateCustomer;
module.exports.Customer = Customer;

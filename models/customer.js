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
      required: true,
      min: 1000000000,
      max: 9999999999
    },
    isGold: { type: Boolean, default: false }
  })
);

function validateCustomer(req) {
  const schema = {
    name: Joi.string()
      .required()
      .min(5)
      .max(500),
    phone: Joi.number()
      .required()
      .min(1000000000)
      .max(9999999999)
  };
  return Joi.validate(req.body, schema);
}

module.exports.validateCustomer = validateCustomer;
module.exports.Customer = Customer;

const Joi = require("joi");
const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
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
      isGold: { type: Boolean, default: false }
    }),

    required: true
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 250,
        trim: true
      },
      dailyRentalRate: { type: Number, min: 0 }
    }),
    required: true
  },
  dateOut: {
    type: Date,
    default: Date.now
  },
  dateReturned: { type: Date },
  rentalFee: { type: Number, min: 0 }
});
const Rental = mongoose.model("Rental", rentalSchema);

function validateRental(req) {
  const schema = {
    customerId: Joi.string().required(),
    movieId: Joi.string().required()
  };
  return Joi.validate(req.body, schema);
}

module.exports.validateRental = validateRental;
module.exports.rentalSchema = rentalSchema;
module.exports.Rental = Rental;

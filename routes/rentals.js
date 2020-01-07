const express = require("express");
const Fawn = require("fawn");
const mongoose = require("mongoose");
const { validateRental, Rental } = require("../models/rental");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");

const router = express.Router();
Fawn.init(mongoose);

router
  .route("/")
  .get(async (req, res) => {
    const rentals = await Rental.find().sort({ dateOut: -1 });
    res.send(rentals);
  })
  .post(async (req, res) => {
    const { error } = validateRental(req);
    if (error) return res.send(error.details[0].message);
    try {
      const customer = await Customer.findById(req.body.customerId);
      if (!customer) res.send("Customer does not exist");
      const movie = await Movie.findById(req.body.movieId);
      if (!movie) res.send("movie does not exist");
      if (movie.numberInStock == 0) res.send("Movie not available in stock");

      let rental = new Rental({
        customer: {
          _id: customer._id,
          name: customer.name,
          phone: customer.phone
        },
        movie: {
          _id: movie._id,
          title: movie.title,
          dailyRentalRate: movie.dailyRentalRate
        }
      });
      //   genral method
      //   rental = await rental.save();
      //   movie.numberInStock--;
      //   movie.save();
      new Fawn.Task()
        .save("rentals", rental)
        .update(
          "movies",
          { _id: movie._id },
          {
            $inc: { numberInStock: -1 }
          }
        )
        .run();
      res.send(rental);
    } catch (error) {
      res.send(error.message);
    }
  });

module.exports = router;

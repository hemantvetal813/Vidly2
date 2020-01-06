const express = require("express");
const { validateMovie, Movie } = require("../models/movie");
const { Genre } = require("../models/genre");

const router = express.Router();

router
  .route("/")
  .get(async (req, res) => {
    try {
      if (req.query.title) {
        //will enter this loop if link is /movies?title=X-men
        const movies = await Movie.find({ title: req.query.title });
        res.send(movies);
      } else {
        const movies = await Movie.find().sort();
        res.send(movies);
      }
    } catch (error) {
      res.send(error.message);
    }
  })
  .post(async (req, res) => {
    try {
      const { error } = validateMovie(req);
      if (error) return res.send(error.details[0].message);
      const movie = await Movie.find({ title: req.body.title });
      if (movie.length !== 0) return res.send("Movie exist in database");
      const genre = await Genre.find({ _id: req.body.genreId });
      if (!genre) return res.send("Invalid Genre");
      //issue not catching invalid genre  here , also in genreschema we do not define _id in schema ,do checkout
      const newMovie = new Movie({
        title: req.body.title,
        genre: { _id: genre._id, name: genre.name },
        dailyRentalRate: req.body.dailyRentalRate,
        numberInStock: req.body.numberInStock
      });
      result = await newMovie.save();
      res.send(result);
    } catch (error) {
      res.send(error.message);
    }
  });

router
  .route("/:_id")
  .get(async (req, res) => {
    const movie = await Movie.findById(req.params._id);
    if (!movie) return res.send("Movie not found");
    res.send(movie);
  })
  .put(async ({ body, params }, res) => {
    const { error } = validateMovie(req);
    if (error) return res.send(error.details[0].message);
    const movie = await Movie.findById(params._id);
    if (!movie) return res.send("Movie not found");
    try {
      Object.keys(body).forEach(item => {
        if (typeof body[item] !== "object") movie[item] = body[item];
      });
      const result = await movie.save();
      res.send(result);
    } catch (err) {
      for (field in err.errors) res.send(err.errors[field]);
    }
  })
  .delete(async (req, res) => {
    try {
      const movie = await Movie.findByIdAndDelete(req.params._id);
      res.send(movie);
    } catch (error) {
      res.send(error.message);
    }
  });
module.exports = router;

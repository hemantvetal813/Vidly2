const express = require("express");
const { validateGenre, Genre } = require("../models/genre");
const JwtAuth = require("../Middleware/Authentication/Jwt_Auth");
const admin = require("../Middleware/Authentication/admin");
const asyncMiddleware = require("../Middleware/asyncMiddleware");

const router = express.Router();

router.get(
  "/",
  JwtAuth,
  asyncMiddleware(async (req, res) => {
    // throw new Error("afkjdfhkjdf");
    const genres = await Genre.find().sort();
    res.send(genres);
  })
);

router.get(
  "/:_id",
  [JwtAuth],
  asyncMiddleware(async (req, res) => {
    const genre = await Genre.find({ _id: req.params._id });
    res.send(genre);
  })
);

router.post("/", [JwtAuth, admin], async (req, res) => {
  const { error } = validateGenre(req);
  if (error) return res.send(error.details[0].message);
  try {
    const genre = new Genre({ name: req.body.name });
    result = await genre.save();
    res.send(result);
  } catch (error) {
    res.send(error.message);
  }
});

router.put("/:_id", [JwtAuth, admin], async (req, res) => {
  const { error } = validateGenre(req);
  if (error) return res.send(error.details[0].message);
  try {
    const genre = await Genre.findByIdAndUpdate(
      req.params._id,
      {
        name: req.body.name
      },
      { new: true }
    );
    res.send(genre);
  } catch (error) {
    res.send(error.message);
  }
});

router.delete("/:_id", [JwtAuth, admin], async (req, res) => {
  try {
    const genre = await Genre.findByIdAndDelete(req.params._id);
    res.send(genre);
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;

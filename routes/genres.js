const express = require("express");
const config = require("config");

const { validateGenre, Genre } = require("../models/genre");

const router = express.Router();

router.get("/", async (req, res) => {
  const genres = await Genre.find().sort();
  // console.log(config.get("vidly_password"));
  res.send(genres);
});

router.get("/:_id", async (req, res) => {
  // const genre = genres.filter(item => item._id == parseInt(req.params._id));
  // if (genre.length == 0) return res.send("genre not found");
  try {
    const genre = await Genre.find({ _id: req.params._id });
    res.send(genre);
  } catch (error) {
    res.send(error.message);
  }
});

router.post("/", async (req, res) => {
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

router.put("/:_id", async (req, res) => {
  const { error } = validateGenre(req);
  if (error) return res.send(error.details[0].message);

  // const genreArray = genres.filter(
  //   item => item._id !== parseInt(req.params._id)
  // );
  // if (genreArray.length == genres.length)
  //   return res.send("genre not found, cant update");
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

router.delete("/:_id", async (req, res) => {
  try {
    const genre = await Genre.findByIdAndDelete(req.params._id);
    res.send(genre);
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;

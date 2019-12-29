const express = require("express");
const config = require("config");

const { validateGenre } = require("../models/genre");

const router = express.Router();

let genres = [
  { name: "Action", _id: 1 },
  { name: "Comedy", _id: 2 },
  { name: "Thriller", _id: 3 }
];

router.get("/", (req, res) => {
  console.log(config.get("vidly_password"));
  res.send(genres);
});

router.get("/:_id", (req, res) => {
  const genre = genres.filter(item => item._id == parseInt(req.params._id));
  if (genre.length == 0) return res.send("genre not found");
  res.send(genre);
});

router.post("/", function(req, res) {
  const { error } = validateGenre(req);
  if (error) return res.send(error.details[0].message);

  const genre = { name: req.body.name, _id: genres.length + 1 };
  genres.push(genre);
  res.send(genre);
});

router.put("/:_id", (req, res) => {
  const { error } = validateGenre(req);
  if (error) return res.send(error.details[0].message);

  const genreArray = genres.filter(
    item => item._id !== parseInt(req.params._id)
  );
  if (genreArray.length == genres.length)
    return res.send("genre not found, cant update");

  const genre = { name: req.body.name, _id: req.params._id };
  genres = genreArray;
  genres.push(genre);
  res.send(genre);
});

router.delete("/:_id", (req, res) => {
  const genre = genres.filter(item => item._id == parseInt(req.params._id));
  if (genre.length == 0) return res.send("genre not found");

  const genreArray = genres.filter(
    item => item._id !== parseInt(req.params._id)
  );
  genres = genreArray;
  res.send(genre);
});

module.exports = router;

const express = require("express");
const router = express.Router();
const { validateAuthor, Author } = require("../models/author");

router
  .route("/")
  .get(async (req, res) => {
    const authors = await Author.find().sort();
    res.send(authors);
  })
  .post(async (req, res) => {
    const { error } = validateAuthor(req);
    if (error) return res.send(error.details[0].message);

    try {
      const author = new Author(req.body);
      result = await author.save();
      res.send(result);
    } catch (error) {
      res.send(error.message);
    }
  });

module.exports = router;

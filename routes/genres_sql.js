const express = require("express");
const mysqlDb = require("../startup/mysqlDB")(); //imp its a function

const router = express.Router();

router.get("/add", async (req, res) => {
  let genre = { name: req.body.name };
  let sqlQuery = "INSERT INTO genres SET ?"; // ? take next string from 2nd argument of query
  await mysqlDb.query(sqlQuery, genre, (err, rows) => {
    res.send("genre added");
  });
});
module.exports = router;

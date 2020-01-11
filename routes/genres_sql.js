const express = require("express");
const mysqlDb = require("../startup/mysqlDB"); //imp its a function
const { validateGenre } = require("../models/genre");

const router = express.Router();

router.get("/", async (req, res) => {
  let sqlQuery = "SELECT * FROM genres ";
  await mysqlDb.query(sqlQuery, (err, rows) => {
    res.send(rows);
  });
});

router.post("/add", async (req, res) => {
  const { error } = validateGenre(req);
  if (error) return res.send(error.details[0].message);
  let genre = { name: req.body.name };
  let sqlQuery = "INSERT INTO genres SET ?"; // ? take next string from 2nd argument of query
  await mysqlDb.query(sqlQuery, genre, (err, rows) => {
    res.send("genre added");
  });
});

router.put("/:id", async (req, res) => {
  const { error } = validateGenre(req);
  if (error) return res.send(error.details[0].message);
  let sqlQuery = `UPDATE genres SET name='${req.body.name}' WHERE id = ${req.params.id}`; // ? take next string from 2nd argument of query
  await mysqlDb.query(sqlQuery, (err, rows) => {
    const result = rows;
    res.send(result);
  });
});
router.delete("/:id", async (req, res) => {
  let sqlQuery = `DELETE FROM genres WHERE id = ${req.params.id}`; // ? take next string from 2nd argument of query
  await mysqlDb.query(sqlQuery, (err, rows) => {
    const result = rows;
    res.send(result);
  });
});
module.exports = router;

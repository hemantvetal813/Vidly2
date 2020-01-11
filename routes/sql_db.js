const express = require("express");
const mysqlDb = require("../startup/mysqlDB"); //imp its a function

const router = express.Router();

router.get("/createdb", (req, res) => {
  if (!req.query.name)
    return res.send(
      "provide database name e.g. /genres_sql/createdb?name=myDatabase"
    );
  let sqlQuery = `CREATE SCHEMA ${req.query.name}`;
  mysqlDb.query(sqlQuery, (err, rows) => {
    res.send("Database created");
  });
});

router.get("/createschema", (req, res) => {
  let sqlQuery = `CREATE TABLE genres(id int AUTO_INCREMENT, name VARCHAR(255),PRIMARY KEY (id))`;
  mysqlDb.query(sqlQuery, async (err, rows) => {
    if (err) throw err;
    await res.send("Table created");
  });
});

module.exports = router;

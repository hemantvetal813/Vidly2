const mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "9869865904",
  database: "vidly2"
  // insecureAuth: true
});

// run this line in sql to avoid authentication
// ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '9869865904'
connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
// con.query("SELECT points FROM customers", async (err, rows) => {
//   const result = await rows;
//   console.log(result);
// });
// , function(err, result, fields) {
//   if (err) throw err;
//   console.log(result);
// });

module.exports = connection;

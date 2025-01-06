var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Test1234",
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");






  // creates database
  con.query("CREATE DATABASE HelloWorldPOC", function (err, result) {
    if (err) throw err;
    console.log("Database created");
  });


  con.query("USE HelloWorldPOC", function (err, result) {
    if (err) throw err;
    console.log("Database Being used!");
  });


  var sql = "CREATE TABLE messages (id INT AUTO_INCREMENT PRIMARY KEY, message VARCHAR(255))";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });

  var sql = "INSERT INTO messages (message) VALUES ('HelloWorldPOC')";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Insert created");
  });


});

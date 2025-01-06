var mysql = require('mysql');
var http = require('http');

// Create a MySQL connection
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Test1234",
  database: 'HelloWorldPOC'
});

// Connect to MySQL database
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to the database!");

  // Query the database to get the message
  con.query('SELECT message FROM messages WHERE id = 1', (err, results) => {
    if (err) {
      console.error('Error executing query:', err.stack);
      return;
    }

    // Starts the HTTP server after the query completes
    http.createServer(function (req, res) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      // Send the message from the database as the response
      res.end('Message from database: ' + results[0].message);
    }).listen(8082, () => {
      console.log('Server is running at http://localhost:8082');
    });

    // Close the MySQL connection after query is done
    con.end();
    
  });
});

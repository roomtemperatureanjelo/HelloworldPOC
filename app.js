var mysql = require('mysql');
var http = require('http');



// Create a function to establish a new MySQL connection
function createNewConnection() {
  return mysql.createConnection({
    host: "mysql-db", // Use the service name instead of the IP address
    user: "root",
    password: "Test1234"
  });
}

// Initialize the connection
var con = createNewConnection();

// Function to connect to MySQL with retry mechanism
function connectToDatabase() {
  con.connect(function (err) {
    if (err) {
      console.error('Error connecting to MySQL, retrying in 1 minute:', err);

      // Close the current connection to reset state
      con.end(() => {
        // Retry connection after 1 minute
        setTimeout(() => {
          // Recreate the connection object before retrying
          con = createNewConnection();
          connectToDatabase();
        }, 60000);
      });

      return; // Exit to avoid executing further logic
    }

    console.log("Connected to MySQL!");

    // Create the database
    con.query("CREATE DATABASE IF NOT EXISTS HelloWorldPOC", function (err, result) {
      if (err) throw err;
      console.log("Database created or already exists");

      // Use the database
      con.query("USE HelloWorldPOC", function (err, result) {
        if (err) throw err;
        console.log("Using the HelloWorldPOC database");

        // Create the messages table
        var sql = "CREATE TABLE IF NOT EXISTS messages (id INT AUTO_INCREMENT PRIMARY KEY, message VARCHAR(255))";
        con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("Table created or already exists");

          // Insert a message into the table
          var sql = "INSERT INTO messages (message) VALUES ('HelloWorldPOC')";
          con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Message inserted");

            // Query the database for the message
            con.query('SELECT message FROM messages WHERE id = 1', (err, results) => {
              if (err) {
                console.error('Error executing query:', err.stack);
                return;
              }

              // Start the HTTP server after query completes
              http.createServer(function (req, res) {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                // Send the message from the database as the response
                res.end('Message from database: ' + results[0].message);
              }).listen(8082, () => {
                console.log('Server is running at http://0.0.0.0:8082');
              });

              // Close the MySQL connection after query is done
              // con.end();
            });
          });
        });
      });
    });
  });
}

// Initial call to connect to the database
connectToDatabase();

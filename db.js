const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

// Create a connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME, // Make sure to add this if you have a database name
    waitForConnections: true,      // Wait for a connection to become available
    connectionLimit: 10,           // Number of connections to create in the pool
    queueLimit: 0                  // Limit on the number of connection requests
});

// Export the pool for use in other parts of the application
module.exports = pool.promise();  // Use promise-based API for async/await
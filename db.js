const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'expensesApp_tracker', // Specify the database here
    waitForConnections: true,
    connectionLimit: 10, // Adjust this based on your application's load
    queueLimit: 0
});

db.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database:', connection.threadId);
    connection.release(); // Release the connection back to the pool
});

module.exports = db;
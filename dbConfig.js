require('dotenv').config(); // Ensure environment variables are loaded

module.exports = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'expensesApp_tracker', // Make sure this matches your database name
    port: 3306
};
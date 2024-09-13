require('dotenv').config(); // Ensure environment variables are loaded

module.exports = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306, // Defaults to 3306 if DB_PORT is not set
};
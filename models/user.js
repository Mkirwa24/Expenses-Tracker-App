const mysql = require('mysql2/promise');
const dbConfig = require('../dbConfig'); 

class User {
    static async findByEmail(email) {
        let connection;
        try {
            connection = await mysql.createConnection(dbConfig);
            const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
            return rows; // Ensure this returns an array
        } catch (error) {
            console.error('Error querying database:', error);
            throw new Error('Database query error');
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }

    static async findByResetToken(token) {
        let connection;
        try {
            connection = await mysql.createConnection(dbConfig);
            const [rows] = await connection.execute('SELECT * FROM users WHERE resetToken =? AND resetTokenExpiry > ?', [token, Date.now()]);
            return rows.length ? rows[0] : null; // Return the first user or null
        } catch (error) {
            console.error('Error finding user by reset token:', error);
            throw new Error('Database query error');
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }

    static async updateResetToken(userId, token, expiry) {
        let connection;
        try {
            connection = await mysql.createConnection(dbConfig);
            const [result] = await connection.execute(
                'UPDATE users SET resetToken = ?, resetTokenExpiry = ? WHERE id = ?',
                [token, expiry, userId]
            );
            return result;
        } catch (error) {
            console.error('Error updating reset token:', error);
            throw new Error('Database update error');
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }

    static async updatePassword(userId, hashedPassword) {
        let connection;
        try {
            connection = await mysql.createConnection(dbConfig);
            const [result] = await connection.execute(
                'UPDATE users SET password = ? WHERE id = ?',
                [hashedPassword, userId]
            );
            return result;
        } catch (error) {
            console.error('Error updating password:', error);
            throw new Error('Database update error');
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }

    static async clearResetToken(userId) {
        let connection;
        try {
            connection = await mysql.createConnection(dbConfig);
            const [result] = await connection.execute(
                'UPDATE users SET resetToken = NULL, resetTokenExpiry = NULL WHERE id = ?',
                [userId]
            );
            return result;
        } catch (error) {
            console.error('Error clearing reset token:', error);
            throw new Error('Database update error');
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }
}

module.exports = User;
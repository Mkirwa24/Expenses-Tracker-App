const express = require('express');
const path = require('path'); // Import the path module
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user'); // Ensure this is pointing to the correct User model

// Middleware to log incoming requests
router.use((req, res, next) => {
    console.log('Request Method:', req.method);
    console.log('Request Headers:', req.headers);
    console.log('Request Body:', req.body);
    console.log('Request Query:', req.query);
    next();
});

// GET route to serve the reset password form
router.get('/', async (req, res) => {
    const { token } = req.query; // Extract token from query parameter

    if (!token) {
        return res.status(400).send('No token provided');
    }

    try {
        const user = await User.findByResetToken(token);
        if (!user || user.resetTokenExpiry < Date.now()) {
            return res.status(400).send('Invalid or expired reset token');
        }

        // If the token is valid, serve the reset-password.html page
        res.sendFile(path.join(__dirname, '../public/reset-password.html')); // Adjust the path to your actual reset-password.html file location
    } catch (error) {
        console.error('Error checking reset token:', error.message);
        res.status(500).send('Internal server error');
    }
});

// POST route to handle password reset
router.post('/', async (req, res) => {
    const { token, newPassword } = req.body; // Extract newPassword from req.body

    if (!token) {
        return res.status(400).json({ message: 'No token provided' });
    }

    if (!newPassword || newPassword.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    try {
        const user = await User.findByResetToken(token);
        if (!user || user.resetTokenExpiry < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await User.updatePassword(user.id, hashedPassword);
        await User.clearResetToken(user.id);

        // notify the user
        sendSuccessEmail(user.email); 

        res.json({ message: 'Password has been reset successfully' });
    } catch (error) {
        console.error('Error during password reset:', error.message);
        res.status(500).json({ message: 'Error during password reset', error: error.message });
    }
});

module.exports = router;
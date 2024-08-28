const express = require('express');
const router = express.Router();
const User = require('../models/user');
const sendPasswordResetEmail = require('../utils/sendPasswordResetEmail');
const generateResetToken = require('../utils/tokenUtils');

router.post('/', async (req, res) => {
    const { email } = req.body;

    try {
        const results = await User.findByEmail(email);

        if (!results || !Array.isArray(results)) {
            return res.status(500).json({ message: 'Error fetching user data' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = results[0];
        const token = generateResetToken();
        const expiry = new Date(Date.now() + 3600000); // Token valid for 1 hour

        await User.updateResetToken(user.id, token, expiry);

        // Send reset email
        sendPasswordResetEmail(user.email, token);

        res.json({ message: 'Password reset link has been sent', token });
    } catch (err) {
        console.error('Error processing password reset:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
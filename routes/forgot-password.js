const express = require('express');
const router = express.Router();
const User = require('../models/user');
const {sendPasswordResetEmail} = require('../utils/sendPasswordResetEmail');
const {generateResetToken } = require('../utils/tokenUtils');
const bcrypt = require('bcrypt');

// Function to compare the provided answer with the stored hashed answer
const verifySecurityAnswerHash = async (storedAnswer, providedAnswer) => {
    if (!storedAnswer || !providedAnswer) {
        throw new Error('Missing data to compare answers');
    }
    return bcrypt.compare(providedAnswer, storedAnswer);
};

router.post('/', async (req, res) => {
    const { email, securityAnswer } = req.body;

    try {
        const results = await User.findByEmail(email);

        if (!results || !Array.isArray(results)) {
            return res.status(500).json({ message: 'Error fetching user data' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = results[0];

      // Check if the user has exceeded the maximum number of reset attempts (e.g., 3 attempts)
       const now = Date.now();
       const timeSinceLastAttempt = now - new Date(user.lastAttempt).getTime();

       if (user.resetAttempts >= 3 && timeSinceLastAttempt < 24 * 60 * 60 * 1000) { // 24-hour limit
       return res.status(429).json({ message: 'Too many reset attempts. Try again later.' });
        }
        
        // Verify the provided security answer with the hashed answer in the database
        const isAnswerValid = await verifySecurityAnswerHash(user.securityAnswerHash, securityAnswer);

        if (!isAnswerValid) {
            // Increment reset attempts
            await User.updateResetAttempts( user.id, user.resetAttempts + 1, now );
            return res.status(401).json({ message: 'Incorrect security answer' });
        }

         // If the answer is valid, reset the attempts and update the last attempt time
        await User.updateResetAttempts(user.id, 0, now);      // Create a method to reset attempts
        
        const token = generateResetToken();
        const expiry = Math.floor(Date.now() + 15 * 60 * 1000); // Token valid for 15 mins  and Set expiry as a Unix timestamp

        await User.updateResetToken(user.id, token, expiry);

        // Send reset email
        sendPasswordResetEmail(user.email, token);

        res.json({ message: 'Password reset email has been sent.'});
    } catch (err) {
        console.error('Error processing password reset:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
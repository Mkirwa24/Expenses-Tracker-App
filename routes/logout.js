const express = require('express');
const router = express.Router();

// Logout route (this clears the token from the client-side)
router.post('/', (req, res) => {
    console.log('Logout route accessed'); // Debugging
    res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;
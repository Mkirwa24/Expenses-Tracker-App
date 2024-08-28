const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/authenticateToken');

// Existing route to fetch total expenses
router.get('/', authenticateToken, async(req, res) => {
    try {
        const userId = req.user.id;
        console.log('Fetching total expenses for user ID:', userId);

        const [rows] = await db.promise().query('SELECT SUM(amount) AS totalExpenses FROM expenses WHERE user_id = ?', [userId]);
        const totalExpenses = rows[0].totalExpenses || 0;

        console.log('Total expenses fetched:', totalExpenses);
        res.status(200).json({ totalExpenses });
    } catch (err) {
        console.error('Error fetching total expenses:', err.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = router;
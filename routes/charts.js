const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/authenticateToken');

// Get total expenses by category
router.get('/expenses-by-category', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const expensesByCategoryQuery = `
            SELECT category, SUM(amount) as total
            FROM expenses
            WHERE user_id = ?
            GROUP BY category
        `;
        const [rows] = await db.promise().query(expensesByCategoryQuery, [userId]);

        res.status(200).json(rows);
    } catch (err) {
        console.error('Error fetching expenses by category:', err.message);
        res.status(500).json('Internal Server Error');
    }
});

// Get total expenses by month
router.get('/expenses-by-month', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const expensesByMonthQuery = `
            SELECT DATE_FORMAT(date, '%Y-%m') as month, SUM(amount) as total
            FROM expenses
            WHERE user_id = ?
            GROUP BY month
            ORDER BY month ASC
        `;
        const [rows] = await db.promise().query(expensesByMonthQuery, [userId]);

        res.status(200).json(rows);
    } catch (err) {
        console.error('Error fetching expenses by month:', err.message);
        res.status(500).json('Internal Server Error');
    }
});

module.exports = router;
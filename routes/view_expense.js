const express = require('express');
const router = express.Router();
const db = require('../db');  // Ensure this path is correct
const authenticateToken = require('../middleware/authenticateToken'); // Ensure this path is correct

// View expenses route
router.get('/', authenticateToken, (req, res) => {
    const userId = req.user.id;

    const getExpensesQuery = 'SELECT * FROM expenses WHERE user_id = ?';
    db.query(getExpensesQuery, [userId], (err, results) => {
        if (err) {
        console.error('Database query error:', err); 
        return res.status(500).json('Error fetching expenses');
    }
    if (results.length === 0) {
        return res.status(404).json('Expense not found');
    }

        return res.status(200).json(results);
    });
});

router.get('/:id', authenticateToken, (req, res) => {
    const expenseId = req.params.id;
    // Ensure query matches database and logic
    const getExpenseQuery = 'SELECT * FROM expenses WHERE id = ? AND user_id = ?';
    db.query(getExpenseQuery, [expenseId, req.user.id], (err, results) => {
        if (err) return res.status(500).json('Error fetching expense');
        if (results.length === 0) return res.status(404).json('Expense not found');
        return res.status(200).json(results[0]);
    });
});
module.exports = router;
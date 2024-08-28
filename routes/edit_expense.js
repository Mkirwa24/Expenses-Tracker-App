const express = require('express');
const router = express.Router();
const db = require('../db');  // Ensure this path is correct
const authenticateToken = require('../middleware/authenticateToken'); // Ensure this path is correct
// Edit expense route
router.put('/:id', authenticateToken, (req, res) => {
    const { name, amount, date, category } = req.body;
    const userId = req.user.id;
    const expenseId = req.params.id;

    if (!name || !amount || !date || !category) {
        return res.status(400).json('Missing required fields');
    }

    const updateExpenseQuery = 'UPDATE expenses SET name = ?, amount = ?, date = ?, category = ? WHERE id = ? AND user_id = ?';
    db.query(updateExpenseQuery, [name, amount, date, category, expenseId, userId], (err) => {
        if (err) return res.status(500).json('Error updating expense');
        return res.status(200).json('Expense updated successfully');
    });
});

module.exports = router;
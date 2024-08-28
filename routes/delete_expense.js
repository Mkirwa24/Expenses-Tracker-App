const express = require('express');
const router = express.Router();
const db = require('../db');  // Ensure this path is correct
const authenticateToken = require('../middleware/authenticateToken'); // Ensure this path is correct

// Delete expense route
router.delete('/:id', authenticateToken, (req, res) => {
    const expenseId = req.params.id;
    const userId = req.user.id;

    const deleteExpenseQuery = 'DELETE FROM expenses WHERE id = ? AND user_id = ?';
    db.query(deleteExpenseQuery, [expenseId, userId], (err, result) => {
        if (err) return res.status(500).json('Something went wrong');
        if (result.affectedRows === 0) return res.status(404).json('Expense not found or unauthorized');
        res.status(200).json('Expense deleted successfully');
    });
});

module.exports = router;
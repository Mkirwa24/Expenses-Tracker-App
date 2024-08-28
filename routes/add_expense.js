const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken'); // Ensure this path is correct
const db = require('../db');  // Ensure this path is correct

// Add expense route
router.post('/', authenticateToken, (req, res) => {
    console.log('Authenticated user:', req.user);  
    const { name, amount, date, category } = req.body;
    const userId = req.user.id;

    if (!name || !amount || !date || !category) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const addExpenseQuery = 'INSERT INTO expenses (user_id, name, amount, date, category) VALUES (?, ?, ?, ?, ?)';
    
    db.query(addExpenseQuery, [userId, name, amount, date, category], (err) => {
        if (err) {
            console.error('Database query error:', err); 
            return res.status(500).json({ error: 'Error adding expense', details: err.message });
        }
        
        return res.status(200).json({ message: 'Expense added successfully' });
    });
});

module.exports = router;
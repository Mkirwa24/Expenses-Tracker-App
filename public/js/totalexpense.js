document.addEventListener('DOMContentLoaded', function() {
    fetchTotalExpenses();

    document.getElementById('addExpenseForm').addEventListener('submit', async function(event) {
        event.preventDefault();

        const category = document.getElementById('category').value;
        const amount = parseFloat(document.getElementById('amount').value);

        if (!category || isNaN(amount) || amount <= 0) {
            alert('Please enter valid category and amount.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/expenses/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ category, amount })
            });

            if (!response.ok) {
                throw new Error('Failed to add expense');
            }

            const result = await response.json();
            alert(result.message);

            // Ensure `result.totalExpenses` exists or fetch again
            if (result.totalExpenses !== undefined) {
                updateTotalExpenses(result.totalExpenses);
            } else {
                // Fallback to re-fetch total expenses
                fetchTotalExpenses();
            }
        } catch (error) {
            console.error('Error adding expense:', error);
        }
    });

    async function fetchTotalExpenses() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/totalexpenses', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch total expenses');
            }

            const data = await response.json();
            updateTotalExpenses(data.totalExpenses);
        } catch (error) {
            console.error('Error fetching total expenses:', error);
            updateTotalExpenses('Error');
        }
    }

    function updateTotalExpenses(totalExpenses) {
        const totalExpensesElement = document.getElementById('totalExpensesAmount');
        if (totalExpensesElement) {
            totalExpensesElement.textContent = `KSH ${parseFloat(totalExpenses).toFixed(2)}`;
        } else {
            console.error('Element with id "totalExpensesAmount" not found');
        }
    }
});
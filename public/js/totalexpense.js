document.addEventListener('DOMContentLoaded', function() {
     // Fetch and display total expenses when the DOM is loaded
    fetchTotalExpenses();

// Function to fetch total expenses from the server
    async function fetchTotalExpenses() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('https://expenses-tracking-application1.onrender.com/totalexpenses', {
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
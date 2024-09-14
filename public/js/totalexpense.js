document.addEventListener('DOMContentLoaded', function() {
     // Fetch and display total expenses when the DOM is loaded
    fetchTotalExpenses();

// Function to fetch total expenses from the server
    async function fetchTotalExpenses() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found. Please log in.');
            }

            const response = await fetch('https://expenses-tracking-application1.onrender.com/totalexpenses', {
               method:'GET', 
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
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

// Function to update the total expenses displayed on the page
    function updateTotalExpenses(totalExpenses) {
        const totalExpensesElement = document.getElementById('totalExpensesAmount');
        if (totalExpensesElement) {
            totalExpensesElement.textContent = `KSH ${parseFloat(totalExpenses).toFixed(2)}`;
        } else {
            console.error('Element with id "totalExpensesAmount" not found');
        }
    }
});
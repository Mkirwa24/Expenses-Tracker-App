document.addEventListener('DOMContentLoaded', () => {
    // Fetch and display chart data when the DOM is fully loaded
    fetchChartData();

    // Add an event listener to the view expenses button
    const viewExpensesButton = document.getElementById('view_expensesButton');
    if (viewExpensesButton) {
        viewExpensesButton.addEventListener('click', async () => {
            const table = document.getElementById('expensesTable');
            if (table) {
                table.style.display = 'table'; // Show the table when button is clicked
                await fetchAndDisplayExpenses(); // Fetch and display the expenses
            }
        });
    }

    // Add an event listener to the transaction form to handle form submission
    const Form = document.getElementById('Form');
    if (Form) {
        Form.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent default form submission
            const formData = new FormData(event.target); // Gather form data
            const data = {
                name: formData.get('name'),
                amount: parseFloat(formData.get('amount')),
                date: formData.get('date'),
                category: formData.get('category'),
            };

            try {
                const response = await fetch('https://expenses-tracking-application1.onrender.com/add_expense', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(data) // Send form data as JSON
                });

                if (response.status === 401) {
                    // If token is expired, handle token expiration and retry adding the expense
                    await handleTokenExpiration();
                    await addExpense(data);
                } else if (!response.ok) {
                    console.log(`Error: ${response.status} - ${await response.text()}`); 
                    throw new Error('Error adding expense'); // Handle any other errors
                } else {
                    // Display success message and refresh the expenses table
                    showStatusMessage('Expense added successfully.', 'green');
                    await fetchAndDisplayExpenses();
                }
            } catch (error) {
                console.error('Error adding expense:', error);
                showStatusMessage('Error adding expense.', 'red'); // Display error message
            }
        });
    }

    // Add click event listeners to close buttons in modals
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.onclick = function() {
            this.closest('.modal').style.display = 'none'; // Close the modal when the close button is clicked
        }
    });


     // Add an event listener to the OK button in the session expired modal
 document.getElementById('sessionExpiredOkButton').addEventListener('click', () => {
    const sessionExpiredModal = document.getElementById('sessionExpiredModal');
        if (sessionExpiredModal) {
            sessionExpiredModal.style.display = 'none';
        }
    window.location.href = 'login.html';
});

// Automatically refresh token every 30 minutes
setInterval(refreshAccessToken, 30 * 60 * 1000); // 30 minutes interval

    // Add event listeners for dashboard navigation
    const addExpenseNav = document.getElementById('addExpenseNav');
    const chartsNav = document.getElementById('chartsNav');
    

    if (addExpenseNav) {
        addExpenseNav.addEventListener('click', () => {
            window.location.href = 'add_expense.html'; // Navigate to add expense page
        });
    }

    if (chartsNav) {
        chartsNav.addEventListener('click', () => {
            window.location.href = 'charts.html'; // Navigate to charts page
        });
    }

   // Function to format date as yyyy-MM-dd
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Format to yyyy-MM-dd
};

    // Fetch and display the list of expenses
    async function fetchAndDisplayExpenses() {
        try {
            const response = await fetch('https://expenses-tracking-application1.onrender.com/view_expense', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
    
            if (response.status === 401) {
                // Handle token expiration
                await handleTokenExpiration();
                await fetchAndDisplayExpenses(); // Retry fetching expenses
            } else if (!response.ok) {
                throw new Error('Error fetching expenses');
            } else {
                const expenses = await response.json();
                const tableBody = document.getElementById('expensesTableBody');
    
                if (tableBody) {
                    tableBody.innerHTML = expenses.length === 0
                        ? '<tr><td colspan="6">No expenses found.</td></tr>'
                        : expenses.map(expense => `
                            <tr>
                                <td>${expense.id}</td>
                                <td>${expense.name}</td>
                                <td>${expense.category}</td>
                                <td>KSh ${parseFloat(expense.amount).toFixed(2)}</td>
                                <td>${formatDate(expense.date)}</td>
                                <td>
                                    <button onclick='openEditModal(${expense.id})'>Edit</button>
                                    <button onclick='confirmDelete(${expense.id})'>Delete</button>
                                </td>
                            </tr>
                        `).join('');
                } else {
                    console.error('Table body element not found');
                }
            }
        } catch (error) {
            console.error('Error fetching expenses:', error);
            showStatusMessage('No expenses found.', 'red');
        }
    }

 // Function to handle token expiration
async function handleTokenExpiration() {
    console.log('Token expired. Handling token expiration.');
    await refreshAccessToken();
}

// Function to refresh access token
let lastRefreshTime = Date.now();

// Update the function to include time logging
let retryAttempts = 0;
const maxRetries = 2;

async function refreshAccessToken() {
    try {
        console.log(`Attempting to refresh token at ${new Date().toLocaleTimeString()}`);
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
            console.error('No refresh token available');
            await showSessionExpiredModal();
            return;
        }

        const response = await fetch('https://expenses-tracking-application1.onrender.com/refreshToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refreshToken: localStorage.getItem('refreshToken') })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Failed to refresh token. Server response:', errorText);
            throw new Error('Failed to refresh token');
        }
        
        const { accessToken } = await response.json();
        localStorage.setItem('token', accessToken);
        lastRefreshTime = Date.now(); // Update last refresh time
        console.log('Token refreshed successfully at', new Date(lastRefreshTime).toLocaleTimeString());
    } catch (error) {
        console.error('Error refreshing access token:', error);
        
        if (retryAttempts < maxRetries) {
            retryAttempts++;
            console.log(`Retry attempt ${retryAttempts}`);
            await refreshAccessToken();
        } else {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        await showSessionExpiredModal();
    }
}
}

function startTokenRefresh() {
    setTimeout(async () => {
        await refreshAccessToken();
        startTokenRefresh(); // Schedule next refresh
    }, 30 * 60 * 1000); // 30 minutes
}

startTokenRefresh();

document.addEventListener('DOMContentLoaded', () => {
    const showModalFlag = localStorage.getItem('showSessionExpiredModal');
    if (showModalFlag === 'true') {
        showSessionExpiredModal(); // Show modal if flag is set
    }
});
// Function to show session expired modal and wait for user action
function showSessionExpiredModal() {
    // Set flag to show modal
    localStorage.setItem('showSessionExpiredModal', 'true'); 

    return new Promise((resolve) => {
        const sessionExpiredModal = document.getElementById('sessionExpiredModal');
        if (sessionExpiredModal) {
            sessionExpiredModal.style.display = 'block';
            console.log('Session expired modal displayed.');

            const sessionExpiredOkButton = document.getElementById('sessionExpiredOkButton');
            if (sessionExpiredOkButton) {
                sessionExpiredOkButton.onclick = () => {
                    sessionExpiredModal.style.display = 'none';
                    console.log('Session expired modal OK button clicked.');
                    resolve();
                };
            } else {
                console.error('Session expired OK button not found.');
                resolve();    // Proceed if button not found
            }
        } else {
            console.error('Session expired modal not found.');
            resolve();     // Proceed if modal not found
        }
    }).then(() => {
        window.location.href = 'login.html';
        console.log('Redirecting to login page.');
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    await fetchChartData();
});
 // function to fetch and display chart data
async function fetchChartData() {
    try {
        // Get the token from local storage
        const token = localStorage.getItem('token');
        if (!token) throw new Error('User not authenticated');

        // Fetch chart data from the server with authorization header
        const responseCategory = await fetch('https://expenses-tracking-application1.onrender.com/charts/expenses-by-category', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!responseCategory.ok) throw new Error('Failed to fetch expenses by category');

        // Define dataCategory here
        const dataCategory = await responseCategory.json();

        // Create and display a pie chart
        const pieCtx = document.getElementById('expensePieChart').getContext('2d');
        new Chart(pieCtx, {
            type: 'pie',
            data: {
                labels: dataCategory.map(entry => entry.category),
                datasets: [{
                    data: dataCategory.map(entry => entry.total),
                    backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#7fff00', '#a52a2a', '#0000cd','#800000', '#32cd32' ],
                }]
            },
            options: {
                responsive: true,
        maintainAspectRatio: false,
                plugins: {
                    datalabels: {
                        formatter: (value) => `KSh ${value.toFixed(2)}`
                    }
                }
            }
        });

        // Fetch total expenses by month
        const responseMonth = await fetch('https://expenses-tracking-application1.onrender.com/charts/expenses-by-month', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!responseMonth.ok) throw new Error('Failed to fetch expenses by month');

        // Define dataMonth here
        const dataMonth = await responseMonth.json();

        // Create and display a bar chart
        const barCtx = document.getElementById('expenseBarChart').getContext('2d');
        new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: dataMonth.map(entry => entry.month),
                datasets: [{
                    label: 'Total Expenses by Month',
                    data: dataMonth.map(entry => entry.total),
                    backgroundColor: '#42a5f5',
                }]
            },
            options: {
                responsive: true,
        maintainAspectRatio: false,
                plugins: {
                    datalabels: {
                        formatter: (value) => `KSh ${value.toFixed(2)}`
                    }
                }
            }
        });

        // Create and display a line chart (example, update as needed)
        const lineCtx = document.getElementById('expenseLineChart').getContext('2d');
        new Chart(lineCtx, {
            type: 'line',
            data: {
                labels: dataMonth.map(entry => entry.month),
                datasets: [{
                    label: 'Total Expenses Over Time by Month',
                    data: dataMonth.map(entry => entry.total),
                    borderColor: '#42a5f5',
                    backgroundColor: 'rgba(66, 165, 245, 0.2)',
                }]
            },
            options: {
                responsive: true,
        maintainAspectRatio: false,
                plugins: {
                    datalabels: {
                        formatter: (value) => `KSh ${value.toFixed(2)}`
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error fetching chart data:', error); // Handle errors in fetching chart data
    }
}


// Event listener to resize charts dynamically
window.addEventListener('resize', function() {
    Chart.helpers.each(Chart.instances, function(instance) {
        instance.resize();
    });
});

 // Function to open the edit modal
  const openEditModal = async(expenseId) => {
    try {
        const response = await fetch(`https://expenses-tracking-application1.onrender.com/view_expense/${expenseId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch expense');
        }

        const expense = await response.json();
        document.getElementById('editExpenseId').value = expense.id;
        document.getElementById('editExpenseName').value = expense.name;
        document.getElementById('editExpenseAmount').value = expense.amount;
        
        
        // Convert date to yyyy-MM-dd format
        const expenseDate = new Date(expense.date).toISOString().split('T')[0];
        document.getElementById('editExpenseDate').value = expenseDate;

        document.getElementById('editExpenseCategory').value = expense.category;

        document.getElementById('editModal').style.display = 'block';
    } catch (error) {
        console.error('Error fetching expense for edit:', error);
    }
}

// Function to handle form submission
document.getElementById('editForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission
    
    const id = document.getElementById('editExpenseId').value;
    const name = document.getElementById('editExpenseName').value;
    const amount = document.getElementById('editExpenseAmount').value;
    const date = document.getElementById('editExpenseDate').value;
    const category = document.getElementById('editExpenseCategory').value;

    try {
        const response = await fetch(`https://expenses-tracking-application1.onrender.com/edit_expense/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ name, amount, date, category })
        });

        if (response.ok) {
            showStatusMessage('Expense updated successfully!', 'green');
            document.getElementById('editModal').style.display = 'none';
            await fetchAndDisplayExpenses(); // Refresh expenses table
        } else {
            showStatusMessage('Error updating expense.', 'red');
            throw new Error('Failed to update expense');
        }
    } catch (error) {
        console.error('Error updating expense:', error);
    }
});

// Close modals when clicking the close button
document.querySelectorAll('.close').forEach(function(closeBtn) {
    closeBtn.addEventListener('click', function() {
        closeBtn.closest('.modal').style.display = 'none';
    });
});
document.getElementById('statusMessageOkButton').addEventListener('click', function() {
    document.getElementById('statusMessageModal').style.display = 'none';
});

// Function to handle showing the confirm delete modal
function openConfirmDeleteModal(expenseId) {
    const modal = document.getElementById('confirmDeleteModal');
    modal.style.display = 'block';

    // Attach the expense ID to the confirm button
    document.getElementById('confirmDeleteButton').dataset.expenseId = expenseId;
}

// Event listener for the "Yes, Delete" button
document.getElementById('confirmDeleteButton').addEventListener('click', async function() {
    const expenseId = this.dataset.expenseId;
    
    try {
        const response = await fetch(`https://expenses-tracking-application1.onrender.com/delete_expense/${expenseId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            console.log('Expense deleted successfully.');
            // Close the modal
            document.getElementById('confirmDeleteModal').style.display = 'none';
            // Display the success message
            showStatusMessage('Expense deleted successfully!', 'green');
            // Optionally, refresh the expenses list
            await fetchAndDisplayExpenses();
        } else {
            console.error('Failed to delete expense.');
            showStatusMessage('Error deleting expense.', 'red');
        }
    } catch (error) {
        console.error('Error during deletion:', error);
        showStatusMessage('Error deleting expense.', 'red');
    }
    
});

function confirmDelete(expenseId) {
    openConfirmDeleteModal(expenseId);
}

// Example of how you might trigger it
document.querySelectorAll('.delete-expense-button').forEach(button => {
    button.addEventListener('click', function() {
        const expenseId = this.dataset.expenseId;
        confirmDelete(expenseId);
    });
});
// Event listener for the "Cancel" button
document.getElementById('cancelDeleteButton').addEventListener('click', function() {
    const modal = document.getElementById('confirmDeleteModal');
    modal.style.display = 'none';
});

// Function to hide the modal if clicked outside of it
window.onclick = function(event) {
    const modal = document.getElementById('confirmDeleteModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}


    //function to show a status message in a modal
    function showStatusMessage(message, color ='green') {
        // Get the status modal and message elements
        const modal = document.getElementById('statusMessageModal');
        const messageElement = document.getElementById('statusMessage');
        if (modal && messageElement) {
        // Set the text and color of the message
        messageElement.textContent = message;
        messageElement.style.color = color;
        
        // Show the modal
        modal.style.display = 'block';

         // Close the modal after clicking the OK button
         const okButton = document.getElementById('statusMessageOkButton');
         if (okButton) {
             okButton.onclick = () => {
                 modal.style.display = 'none';
             };
         }

        // Close the modal after 6 seconds
        setTimeout(() => {
            modal.style.display = 'none';
        }, 8000);
    } else {
        console.error('Status modal elements are not found in the DOM.');
    }
}
// Attach functions to the global window object
window.openEditModal = openEditModal;
window.confirmDelete = confirmDelete;
    
});

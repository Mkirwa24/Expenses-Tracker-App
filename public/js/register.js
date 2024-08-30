document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    const okButton = document.getElementById('okButton');
    const modal = document.getElementById('statusMessageModal');

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value; // Get the confirm password value


        // Check if password and confirm password match
        if (password !== confirmPassword) {
            showStatusMessage('Passwords do not match. Please try again.', 'red');
            return; // Stop the form from submitting
        }
        
        try {
            const response = await fetch('https://expense-tracker-application-5b92.onrender.com/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password }) // Send form data as JSON
            });

            const data = await response.json();

            if (response.ok) {
                // Display success message and redirect after 2 seconds
                showStatusMessage('Registration successful. Redirecting...', 'green');
                setTimeout(() => window.location.href = 'login.html', 2000);
            } else {
                // Display error message if user already exists or other issues
                showStatusMessage(data.message || 'User already exists.', 'red');
            }
        } catch (error) {
            console.error('Error during registration:', error);
            showStatusMessage('An error occurred during registration.', 'red'); // Display error message
        }
    });

    // Handle OK button click to close the modal
    okButton.addEventListener('click', () => {
        modal.style.display = 'none'; // Close the modal when "OK" is clicked
    });

    // Hide modals when clicking outside of them
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none'; // Close modal if clicked outside of it
        }
    };
});

// Function to show status message in a modal
function showStatusMessage(message, color) {
    const modal = document.getElementById('statusMessageModal');
    const statusMessage = document.getElementById('statusMessage');
    statusMessage.textContent = message; // Set the message text
    statusMessage.style.color = color; // Set the message color
    modal.style.display = 'block'; // Show the modal
}
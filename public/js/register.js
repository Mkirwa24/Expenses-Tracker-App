document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    const okButton = document.getElementById('okButton');
    const modal = document.getElementById('statusMessageModal');
    const strengthIndicator = document.getElementById('strengthIndicator');
    const passwordField = document.getElementById('password');

    
    // Show Password feature
    const passwordInput = document.getElementById('password'); // Password input field
    const confirmPasswordInput = document.getElementById('confirmPassword'); // Confirm password input field
    const showPasswordCheckbox = document.getElementById('showPassword'); // Checkbox to toggle show/hide passwords

     // Password strength indicator logic
     passwordField.addEventListener('input', () => {
        const strength = calculatePasswordStrength(passwordField.value);
        strengthIndicator.textContent = `Password Strength: ${strength}`;
        updateStrengthIndicatorVisual(strength);
    });

    function calculatePasswordStrength(password) {
        let strength = 'Weak';
        if (password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password) && /[!@#$%^&*]/.test(password)) {
            strength = 'Strong';
        } else if (password.length >= 6) {
            strength = 'Moderate';
        }
        return strength;
    }

    function updateStrengthIndicatorVisual(strength) {
        strengthIndicator.className = ''; // Reset classes
        if (strength === 'Weak') {
            strengthIndicator.classList.add('strength-weak');
        } else if (strength === 'Moderate') {
            strengthIndicator.classList.add('strength-moderate');
        } else if (strength === 'Strong') {
            strengthIndicator.classList.add('strength-strong');
        }
    }

// Show Password feature
    showPasswordCheckbox.addEventListener('change', function () {
        const type = showPasswordCheckbox.checked ? 'text' : 'password';
        passwordInput.type = type; // Toggle password visibility
        confirmPasswordInput.type = type; // Toggle confirm password visibility
    });
    
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value; // Get the confirm password value
        const securityQuestion = document.getElementById('securityQuestion').value;
        const securityAnswer = document.getElementById('securityAnswer').value;
    

        // Check if password and confirm password match
        if (password !== confirmPassword) {
            showStatusMessage('Passwords do not match. Please try again.', 'red');
            return; // Stop the form from submitting
        }
        
         // Check if security answer is provided
         if (!securityAnswer) {
            showStatusMessage('Please provide an answer to the security question.', 'red');
            return;
        }

        try {
            const response = await fetch('https://expenses-tracking-application1.onrender.com/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password, securityQuestion, securityAnswer }) // Send form data as JSON
            });

            const data = await response.json();

            if (response.ok) {
                // Display success message and redirect after 2 seconds
                showStatusMessage('Registration successful. Redirecting...', 'green');
                setTimeout(() => window.location.href = 'login.html', 2000);
            } else if (response.status === 409) {
                // Display 'User already exists' message
                showStatusMessage(data.message || 'User already exists.', 'red');
            } else {
                // Handle other cases such as server error
                showStatusMessage(data.message || 'An error occurred during registration.', 'red');
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
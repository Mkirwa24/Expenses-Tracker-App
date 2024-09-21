document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('resetPasswordForm');
    const tokenField = document.getElementById('token');
    const passwordField = document.getElementById('newPassword');
    const strengthIndicator = document.getElementById('strengthIndicator');

  // Show Password feature
  const showPasswordCheckbox = document.getElementById('showPassword');

  showPasswordCheckbox.addEventListener('change', function () {
      passwordField.type = showPasswordCheckbox.checked ? 'text' : 'password'; // Updated the selector to 'passwordField'
  });


    // Extract token from query string
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
        tokenField.value = token; // Set the token in the hidden field
    }

    // Password strength indicator logic
    passwordField.addEventListener('input', () => {
        const strength = calculatePasswordStrength(passwordField.value);
        strengthIndicator.textContent = strength;
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


    // Update the visual appearance of the strength indicator
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


    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const newPassword = document.getElementById('newPassword').value;
        const token = tokenField.value;

        try {
            const response = await fetch('https://expenses-tracking-application1.onrender.com/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newPassword, token })
            });

            const data = await response.json();

            console.log('Response Data:', data); // Log the server response
           
            if (response.ok) {
                // Redirect to login page
                alert('Password reset successfully. Redirecting to login page...');
                window.location.href = '/login.html';
            } else {
                // Display error message
                alert(data.message || 'Password reset failed.');
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            alert('An error occurred during password reset.');
        }
    });
});

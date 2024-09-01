document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('resetPasswordForm');
    const tokenField = document.getElementById('token');

    // Extract token from query string
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
        tokenField.value = token; // Set the token in the hidden field
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const newPassword = document.getElementById('newPassword').value;
        const token = tokenField.value;

        try {
            const response = await fetch('https://expenses-trackerrr-application.onrender.com/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newPassword, token })
            });

            const data = await response.json();

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

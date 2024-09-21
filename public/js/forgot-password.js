document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('forgotPasswordForm');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const securityAnswer = document.getElementById('securityAnswer').value;

        if (!email || !securityAnswer) {
            alert('Both email and security answer are required.');
            return;
        }

        try {
            const response = await fetch('https://expenses-tracking-application1.onrender.com/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, securityAnswer})
            });

            const data = await response.json();

            if (response.ok) {
                // Alert user that the password reset link has been sent
                alert('A password reset link has been sent to your email. Please check your inbox or spam folder.');
                // Redirect to the reset password page with token in the query string
                const resetPasswordUrl = `/reset-password?token=${data.token}`;
                window.location.href = resetPasswordUrl;

                } else if (response.status === 404) {
                // User not found
                alert(data.message || 'No user found with this email address.');
            } else if (response.status === 401) {
                // Incorrect security answer
                alert(data.message || 'Incorrect security answer. Please try again.');

            } else if (response.status === 429) {
                // Handle too many reset attempts
                alert(data.message || 'Too many reset attempts. Please try again later.');
                } else if (response.status === 500) {
                // Internal server error
                alert(data.message || 'A server error occurred. Please try again later.');
            } else {
                // Display error message
                alert(data.message || 'Password reset failed.');
            }
        } catch (error) {
            console.error('Error during password reset:', error);
            alert('An error occurred during password reset.');
        }
    });
});
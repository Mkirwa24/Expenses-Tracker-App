document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('forgotPasswordForm');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value;

        try {
            const response = await fetch('https://expenses-tracking-application1.onrender.com/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                // Alert user that the password reset link has been sent
                alert('A password reset link has been sent to your email. Please check your inbox.');
                // Redirect to the reset password page with token in the query string
                const resetPasswordUrl = `/reset-password?token=${data.token}`;
                window.location.href = resetPasswordUrl;
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
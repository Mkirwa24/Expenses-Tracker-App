document.addEventListener('DOMContentLoaded', function() {
    const logoutButton = document.getElementById('logoutButton');
    
    if (logoutButton) {
        console.log('Logout button found in the DOM');
        
        logoutButton.addEventListener('click', async function() {
            try {
                const token = localStorage.getItem('token');
                console.log('Logout button clicked, token:', token);

                const response = await fetch('https://expenses-trackerrr-application.onrender.com//logout', { // Ensure correct URL and port
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    console.log('Logout successful');

                    localStorage.removeItem('token');
                    
                    const logoutSuccessModal = document.getElementById('logoutSuccessModal');
                    const closeModalButton = document.getElementById('closeModalButton');

                    if (logoutSuccessModal) {
                        logoutSuccessModal.style.display = 'block';
                        console.log('Success message displayed');

                        closeModalButton.addEventListener('click', function() {
                            logoutSuccessModal.style.display = 'none';
                            console.log('Modal closed by user');
                            window.location.href = 'index.html'; // Redirect after closing modal
                        });

                        // Auto-close the modal and redirect after 3 seconds
                        setTimeout(() => {
                            console.log('Redirecting to index.html');
                            window.location.href = 'index.html';
                        }, 3000);
                    } else {
                        console.error('Success modal not found');
                    }
                } else {
                    console.error('Logout request failed with status:', response.status);
                    throw new Error('Logout failed');
                }
            } catch (error) {
                console.error('Error during logout:', error);
                alert('Logout failed. Please try again.');
            }
        });
    } else {
        console.error('Logout button not found in the DOM.');
    }
});
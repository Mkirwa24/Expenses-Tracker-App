
document.addEventListener('DOMContentLoaded', () => {
    const goBackButton = document.getElementById('goBackButton');
    if (goBackButton) {
        goBackButton.addEventListener('click', () => {
            console.log('Go Back button clicked');
            window.history.back(); // Navigate to the previous page in history
        });
    } else {
        console.error('Go Back button not found.');
    }
});
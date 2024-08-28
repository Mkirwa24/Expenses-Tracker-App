document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded');
    const menuBtn = document.getElementById('menu-btn');
    const closeBtn = document.getElementById('close-btn');
    const navMenu = document.getElementById('nav-menu');
    const overlay = document.getElementById('overlay');

    menuBtn.addEventListener('click', () => {
        console.log('Menu button clicked');
        navMenu.classList.add('active');
        overlay.style.display = 'block';
    });

    closeBtn.addEventListener('click', () => {
        console.log('Close button clicked');
        navMenu.classList.remove('active');
        overlay.style.display = 'none';
    });

    overlay.addEventListener('click', () => {
        console.log('Overlay clicked');
        navMenu.classList.remove('active');
        overlay.style.display = 'none';
    });
});
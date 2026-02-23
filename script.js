// Grab the menu button and the links container
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.getElementById('nav-links');

// Add a click event to the menu button
mobileMenu.addEventListener('click', () => {
    // Toggles the 'active' class on and off
    navLinks.classList.toggle('active');
});

// Optional: Close the menu automatically when a link is clicked
const links = document.querySelectorAll('.nav-links li a');
links.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});
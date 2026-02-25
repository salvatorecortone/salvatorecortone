// =========================
// MOBILE MENU
// =========================

// Grab the menu button and links
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.getElementById('nav-links');

// Toggle mobile menu
mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close menu when clicking link
document.querySelectorAll('.nav-links li a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});



// =========================
// PREMIUM VIDEO SCROLL
// =========================

document.addEventListener('DOMContentLoaded', function() {

    const videoGrid = document.querySelector('.video-grid');
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');
    const wrappers = document.querySelectorAll('.youtube-wrapper');

    if (!videoGrid || wrappers.length === 0) {
        console.log("Video gallery not found");
        return;
    }

    // Calculate dynamic scroll size
    const videoWidth = wrappers[0].offsetWidth;
    const gap = 20;
    const scrollAmount = videoWidth * 3 + gap * 3;



    // =========================
    // SMOOTH SCROLL FUNCTION
    // =========================

    function smoothScroll(distance) {

        videoGrid.scrollBy({
            left: distance,
            behavior: 'smooth'
        });

    }



    // =========================
    // ARROWS
    // =========================

    if (rightArrow) {
        rightArrow.addEventListener('click', () => {
            smoothScroll(scrollAmount);
        });
    }

    if (leftArrow) {
        leftArrow.addEventListener('click', () => {
            smoothScroll(-scrollAmount);
        });
    }



    // =========================
    // ULTRA SMOOTH DRAG SCROLL
    // =========================

    let isDown = false;
    let startX;
    let scrollLeft;

    videoGrid.addEventListener('mousedown', (e) => {

        isDown = true;

        videoGrid.style.cursor = "grabbing";

        startX = e.pageX - videoGrid.offsetLeft;
        scrollLeft = videoGrid.scrollLeft;

    });

    videoGrid.addEventListener('mouseleave', () => {

        isDown = false;
        videoGrid.style.cursor = "grab";

    });

    videoGrid.addEventListener('mouseup', () => {

        isDown = false;
        videoGrid.style.cursor = "grab";

    });

    videoGrid.addEventListener('mousemove', (e) => {

        if (!isDown) return;

        e.preventDefault();

        const x = e.pageX - videoGrid.offsetLeft;
        const walk = (x - startX) * 1.3;

        videoGrid.scrollLeft = scrollLeft - walk;

    });



    // =========================
    // TOUCH OPTIMIZATION
    // =========================

    videoGrid.addEventListener('touchstart', () => {

        videoGrid.style.scrollBehavior = "smooth";

    });



    // =========================
    // CENTER FIRST VIDEO
    // =========================

    setTimeout(() => {

        const firstVideo = wrappers[0];

        const offset =
            firstVideo.offsetLeft
            - (videoGrid.clientWidth / 2)
            + (firstVideo.clientWidth / 2);

        videoGrid.scrollTo({
            left: offset,
            behavior: 'smooth'
        });

    }, 300);



});
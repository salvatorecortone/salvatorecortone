// =============================================
// SAL HARMONICA WEBSITE - MAIN SCRIPT
// Features: Mobile Menu, Infinite Video Gallery, Smooth Scroll, Drag Scroll, Touch Optimization
// =============================================

document.addEventListener('DOMContentLoaded', function() {

    // =========================
    // MOBILE MENU
    // =========================
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');

    // Toggle mobile menu
    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links li a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // =========================
    // VIDEO GALLERY (FOR BOTH STUDENTS AND GALLERY SECTIONS)
    // =========================
    const videoContainers = document.querySelectorAll('.video-container');

    videoContainers.forEach(container => {
        const videoGrid = container.querySelector('.video-grid');
        const leftArrow = container.querySelector('.left-arrow');
        const rightArrow = container.querySelector('.right-arrow');
        const wrappers = container.querySelectorAll('.youtube-wrapper');

        if (!videoGrid || wrappers.length === 0) {
            console.log("Video gallery not found for this container");
            return;
        }

        // Clone videos to create initial infinite loop
        wrappers.forEach(wrapper => {
            const clone = wrapper.cloneNode(true);
            videoGrid.appendChild(clone);
        });

        // Calculate dynamic scroll size
        const videoWidth = wrappers[0].offsetWidth;
        const gap = 20;
        const scrollAmount = videoWidth * 2 + gap * 2; // Scroll by 2 videos at a time

        // Flags
        let isArrowScrolling = false;
        let isDown = false;
        let startX;
        let scrollLeft;

        // =========================
        // SMOOTH SCROLL FUNCTION
        // =========================
        function smoothScroll(distance) {
            isArrowScrolling = true;
            videoGrid.scrollBy({
                left: distance,
                behavior: 'smooth'
            });
            // Re-enable infinite scroll after scroll completes
            setTimeout(() => {
                isArrowScrolling = false;
            }, 1000);
        }

        // =========================
        // ARROWS EVENT LISTENERS
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
        // DRAG SCROLL
        // =========================
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
        // CENTER FIRST VIDEO ON LOAD
        // =========================
        setTimeout(() => {
            const firstVideo = wrappers[0];
            const offset = firstVideo.offsetLeft - (videoGrid.clientWidth / 2) + (firstVideo.clientWidth / 2);
            videoGrid.scrollTo({
                left: offset,
                behavior: 'smooth'
            });
        }, 300);

        // =========================
        // INFINITE SCROLL LOGIC
        // =========================
        videoGrid.addEventListener('scroll', () => {
            if (isArrowScrolling) return;

            const scrollLeft = videoGrid.scrollLeft;
            const scrollWidth = videoGrid.scrollWidth;
            const clientWidth = videoGrid.clientWidth;

            // If scrolled to the end, append cloned videos
            if (scrollLeft + clientWidth >= scrollWidth - 100) {
                wrappers.forEach(wrapper => {
                    const clone = wrapper.cloneNode(true);
                    videoGrid.appendChild(clone);
                });
            }

            // If scrolled to the beginning, prepend cloned videos
            if (scrollLeft <= 100) {
                wrappers.forEach(wrapper => {
                    const clone = wrapper.cloneNode(true);
                    videoGrid.insertBefore(clone, videoGrid.firstChild);
                });
                // Reset scroll position to avoid backward movement
                videoGrid.scrollLeft = scrollLeft + (videoWidth * wrappers.length + gap * wrappers.length);
            }
        });
    });
});

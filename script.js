// =============================================
// SAL HARMONICA WEBSITE - OPTIMIZED MAIN SCRIPT
// Features: Mobile Menu, Video Gallery with Infinite Scroll, Smooth Scrolling, Drag & Touch Support
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    // =========================
    // MOBILE MENU - OPTIMIZED
    // =========================
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');

    // Toggle mobile menu with single event listener
    mobileMenu.addEventListener('click', toggleMobileMenu);

    // Close menu when clicking any nav link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    function toggleMobileMenu() {
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    }

    function closeMobileMenu() {
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
    }

    
        // Initial call
        repositionBackground();

        // Reposition on window resize
        window.addEventListener('resize', repositionBackground);

        // Also check when images are loaded
        const bgImage = new Image();
        bgImage.src = 'Images/about_image.JPEG';
        bgImage.onload = repositionBackground;
    }
}

// Call the function when DOM is loaded
document.addEventListener('DOMContentLoaded', fixAboutBackground);

    // =========================
    // VIDEO GALLERY - FULLY OPTIMIZED
    // =========================
    class VideoGallery {
        constructor(container) {
            this.container = container;
            this.videoGrid = container.querySelector('.video-grid');
            this.leftArrow = container.querySelector('.left-arrow');
            this.rightArrow = container.querySelector('.right-arrow');
            this.wrappers = container.querySelectorAll('.youtube-wrapper');
            this.videoWidth = this.wrappers.length > 0 ? this.wrappers[0].offsetWidth : 0;
            this.gap = 20;
            this.scrollAmount = this.videoWidth * 2 + this.gap * 2;
            this.isArrowScrolling = false;
            this.isDown = false;
            this.startX = 0;
            this.scrollLeft = 0;
            this.clonesAdded = false;

            this.init();
        }

        init() {
            if (!this.videoGrid || this.wrappers.length === 0) return;

            this.setupInfiniteScroll();
            this.setupEventListeners();
            this.centerFirstVideo();
        }

        setupInfiniteScroll() {
            // Initial clone setup
            this.wrappers.forEach(wrapper => {
                const clone = wrapper.cloneNode(true);
                this.videoGrid.appendChild(clone);
            });
        }

        setupEventListeners() {
            // Arrow buttons
            if (this.rightArrow) {
                this.rightArrow.addEventListener('click', () => this.smoothScroll(this.scrollAmount));
            }

            if (this.leftArrow) {
                this.leftArrow.addEventListener('click', () => this.smoothScroll(-this.scrollAmount));
            }

            // Mouse drag events
            this.videoGrid.addEventListener('mousedown', (e) => this.startDrag(e));
            this.videoGrid.addEventListener('mouseleave', () => this.endDrag());
            this.videoGrid.addEventListener('mouseup', () => this.endDrag());
            this.videoGrid.addEventListener('mousemove', (e) => this.dragMove(e));

            // Touch events
            this.videoGrid.addEventListener('touchstart', () => {
                this.videoGrid.style.scrollBehavior = "smooth";
            });

            // Scroll events
            this.videoGrid.addEventListener('scroll', () => this.handleInfiniteScroll());
        }

        startDrag(e) {
            this.isDown = true;
            this.videoGrid.style.cursor = "grabbing";
            this.startX = e.pageX - this.videoGrid.offsetLeft;
            this.scrollLeft = this.videoGrid.scrollLeft;
        }

        endDrag() {
            this.isDown = false;
            this.videoGrid.style.cursor = "grab";
        }

        dragMove(e) {
            if (!this.isDown) return;
            e.preventDefault();
            const x = e.pageX - this.videoGrid.offsetLeft;
            const walk = (x - this.startX) * 1.3;
            this.videoGrid.scrollLeft = this.scrollLeft - walk;
        }

        smoothScroll(distance) {
            this.isArrowScrolling = true;
            this.videoGrid.scrollBy({
                left: distance,
                behavior: 'smooth'
            });

            // Re-enable infinite scroll after animation completes
            setTimeout(() => {
                this.isArrowScrolling = false;
            }, 1000);
        }

        centerFirstVideo() {
            setTimeout(() => {
                if (this.wrappers.length === 0) return;

                const firstVideo = this.wrappers[0];
                const offset = firstVideo.offsetLeft - (this.videoGrid.clientWidth / 2) + (firstVideo.clientWidth / 2);
                this.videoGrid.scrollTo({
                    left: offset,
                    behavior: 'smooth'
                });
            }, 300);
        }

        handleInfiniteScroll() {
            if (this.isArrowScrolling) return;

            const scrollLeft = this.videoGrid.scrollLeft;
            const scrollWidth = this.videoGrid.scrollWidth;
            const clientWidth = this.videoGrid.clientWidth;

            // If scrolled near the end, append clones
            if (scrollLeft + clientWidth >= scrollWidth - 100) {
                this.wrappers.forEach(wrapper => {
                    const clone = wrapper.cloneNode(true);
                    this.videoGrid.appendChild(clone);
                });
            }

            // If scrolled near the beginning, prepend clones
            if (scrollLeft <= 100) {
                this.wrappers.forEach(wrapper => {
                    const clone = wrapper.cloneNode(true);
                    this.videoGrid.insertBefore(clone, this.videoGrid.firstChild);
                });

                // Adjust scroll position to maintain visual continuity
                this.videoGrid.scrollLeft = scrollLeft + (this.videoWidth * this.wrappers.length + this.gap * this.wrappers.length);
            }
        }
    }

    // Initialize all video galleries
    document.querySelectorAll('.video-container').forEach(container => {
        new VideoGallery(container);
    });

    // =========================
    // PERFORMANCE OPTIMIZATIONS
    // =========================
    // Lazy load YouTube iframes
    function initLazyLoad() {
        const lazyVideos = document.querySelectorAll('.video-placeholder');

        if ('IntersectionObserver' in window) {
            const videoObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const placeholder = entry.target;
                        const iframe = document.createElement('iframe');
                        iframe.setAttribute('width', '200');
                        iframe.setAttribute('height', '350');
                        iframe.setAttribute('src', placeholder.getAttribute('data-src'));
                        iframe.setAttribute('frameborder', '0');
                        iframe.setAttribute('allowfullscreen', '');
                        iframe.setAttribute('loading', 'lazy');
                        placeholder.parentNode.replaceChild(iframe, placeholder);
                        observer.unobserve(placeholder);
                    }
                });
            }, {
                rootMargin: '100px 0px',
                threshold: 0.1
            });

            lazyVideos.forEach(video => videoObserver.observe(video));
        } else {
            // Fallback for browsers without IntersectionObserver
            lazyVideos.forEach(placeholder => {
                const iframe = document.createElement('iframe');
                iframe.setAttribute('width', '200');
                iframe.setAttribute('height', '350');
                iframe.setAttribute('src', placeholder.getAttribute('data-src'));
                iframe.setAttribute('frameborder', '0');
                iframe.setAttribute('allowfullscreen', '');
                iframe.setAttribute('loading', 'lazy');
                placeholder.parentNode.replaceChild(iframe, placeholder);
            });
        }
    }

    // Initialize lazy loading
    initLazyLoad();

    // =========================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // =========================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });
});

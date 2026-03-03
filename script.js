document.addEventListener('DOMContentLoaded', function() {
    // =========================
    // VIDEO GALLERY WITH INFINITE SCROLL
    // =========================
    class VideoGallery {
        constructor(container) {
            this.container = container;
            this.videoGrid = container.querySelector('.video-grid');
            this.leftArrow = container.querySelector('.left-arrow');
            this.rightArrow = container.querySelector('.right-arrow');
            this.wrappers = Array.from(container.querySelectorAll('.youtube-wrapper'));
            this.videoWidth = this.wrappers[0].offsetWidth + parseFloat(getComputedStyle(this.wrappers[0]).marginRight);
            this.scrollAmount = this.videoWidth * 3; // Scroll 3 videos at a time
            this.currentScroll = 0;
            this.isScrolling = false;

            this.init();
        }

        init() {
            if (!this.videoGrid || this.wrappers.length === 0) return;

            // Clone videos for infinite scroll
            this.wrappers.forEach(wrapper => {
                const clone = wrapper.cloneNode(true);
                this.videoGrid.appendChild(clone);
            });

            // Arrow click handlers
            this.rightArrow.addEventListener('click', () => this.scrollRight());
            this.leftArrow.addEventListener('click', () => this.scrollLeft());

            // Handle infinite scroll on manual scroll
            this.videoGrid.addEventListener('scroll', () => this.handleInfiniteScroll());
        }

        scrollRight() {
            if (this.isScrolling) return;
            this.isScrolling = true;
            this.currentScroll += this.scrollAmount;
            this.videoGrid.scrollTo({
                left: this.currentScroll,
                behavior: 'smooth'
            });
            setTimeout(() => { this.isScrolling = false; }, 1000);
        }

        scrollLeft() {
            if (this.isScrolling) return;
            this.isScrolling = true;
            this.currentScroll -= this.scrollAmount;
            this.videoGrid.scrollTo({
                left: this.currentScroll,
                behavior: 'smooth'
            });
            setTimeout(() => { this.isScrolling = false; }, 1000);
        }

        handleInfiniteScroll() {
            const scrollLeft = this.videoGrid.scrollLeft;
            const scrollWidth = this.videoGrid.scrollWidth;
            const clientWidth = this.videoGrid.clientWidth;

            // If scrolled near the end, append clones
            if (scrollLeft + clientWidth >= scrollWidth - 100) {
                this.wrappers.forEach(wrapper => {
                    const clone = wrapper.cloneNode(true);
                    this.videoGrid.appendChild(clone);
                });
                this.videoGrid.scrollLeft = scrollLeft - 100;
            }

            // If scrolled near the beginning, prepend clones
            if (scrollLeft <= 100) {
                this.wrappers.forEach(wrapper => {
                    const clone = wrapper.cloneNode(true);
                    this.videoGrid.insertBefore(clone, this.videoGrid.firstChild);
                });
                this.videoGrid.scrollLeft = scrollLeft + 100;
            }
        }
    }

    // Initialize all video galleries
    document.querySelectorAll('.video-container').forEach(container => {
        new VideoGallery(container);
    });

    // =========================
    // LAZY LOAD YOUTUBE IFRAMES
    // =========================
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
                        placeholder.parentNode.replaceChild(iframe, placeholder);
                        observer.unobserve(placeholder);
                    }
                });
            }, { rootMargin: '100px 0px', threshold: 0.1 });
            lazyVideos.forEach(video => videoObserver.observe(video));
        } else {
            lazyVideos.forEach(placeholder => {
                const iframe = document.createElement('iframe');
                iframe.setAttribute('width', '200');
                iframe.setAttribute('height', '350');
                iframe.setAttribute('src', placeholder.getAttribute('data-src'));
                iframe.setAttribute('frameborder', '0');
                iframe.setAttribute('allowfullscreen', '');
                placeholder.parentNode.replaceChild(iframe, placeholder);
            });
        }
    }
    initLazyLoad();
});

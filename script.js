document.addEventListener('DOMContentLoaded', function () {

    class VideoGallery {
        constructor(container) {
            this.container = container;
            this.track = container.querySelector('.carousel-track');
            this.leftArrow = container.querySelector('.carousel-btn.left');
            this.rightArrow = container.querySelector('.carousel-btn.right');
            this.items = Array.from(container.querySelectorAll('.carousel-item'));

            if (!this.track || this.items.length === 0) return;

            this.init();
        }

        init() {
            this.calculateScrollAmount();
            this.attachEvents();
            this.updateArrows();
        }

        calculateScrollAmount() {
            const item = this.items[0];
            const style = getComputedStyle(item);
            const marginRight = parseFloat(style.marginRight) || 0;

            this.itemWidth = item.offsetWidth + marginRight;
            this.scrollAmount = this.itemWidth * 3; // scroll 3 videos

            window.addEventListener('resize', () => {
                const style = getComputedStyle(item);
                const marginRight = parseFloat(style.marginRight) || 0;
                this.itemWidth = item.offsetWidth + marginRight;
                this.scrollAmount = this.itemWidth * 3;
            });
        }

        attachEvents() {
            this.rightArrow.addEventListener('click', () => {
                this.track.scrollBy({
                    left: this.scrollAmount,
                    behavior: 'smooth'
                });
            });

            this.leftArrow.addEventListener('click', () => {
                this.track.scrollBy({
                    left: -this.scrollAmount,
                    behavior: 'smooth'
                });
            });

            this.track.addEventListener('scroll', () => {
                this.updateArrows();
            });
        }

        updateArrows() {
            const maxScroll = this.track.scrollWidth - this.track.clientWidth;
            const currentScroll = this.track.scrollLeft;

            // Disable left arrow if at start
            if (currentScroll <= 0) {
                this.leftArrow.style.opacity = "0.3";
                this.leftArrow.style.pointerEvents = "none";
            } else {
                this.leftArrow.style.opacity = "1";
                this.leftArrow.style.pointerEvents = "auto";
            }

            // Disable right arrow if at end
            if (currentScroll >= maxScroll - 5) {
                this.rightArrow.style.opacity = "0.3";
                this.rightArrow.style.pointerEvents = "none";
            } else {
                this.rightArrow.style.opacity = "1";
                this.rightArrow.style.pointerEvents = "auto";
            }
        }
    }

    // Initialize all carousels
    document.querySelectorAll('.carousel-container').forEach(container => {
        new VideoGallery(container);
    });

});
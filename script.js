document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       LAZY LOAD YOUTUBE VIDEOS
    ========================= */

    function loadVideo(placeholder) {
        const iframe = document.createElement("iframe");

        iframe.src = placeholder.dataset.src;
        iframe.width = "200";
        iframe.height = "350";
        iframe.frameBorder = "0";
        iframe.loading = "lazy";
        iframe.allowFullscreen = true;
        iframe.allow =
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";

        placeholder.replaceWith(iframe);
    }

    function initLazyLoad() {

        const placeholders = document.querySelectorAll(".video-placeholder");

        if (!("IntersectionObserver" in window)) {
            placeholders.forEach(loadVideo);
            return;
        }

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {

                if (entry.isIntersecting) {
                    loadVideo(entry.target);
                    obs.unobserve(entry.target);
                }

            });
        }, {
            rootMargin: "200px",
            threshold: 0.1
        });

        placeholders.forEach(video => observer.observe(video));
    }


    /* =========================
       VIDEO GALLERY SCROLLER
    ========================= */

    class VideoGallery {

        constructor(container) {

            this.grid = container.querySelector(".video-grid");
            this.left = container.querySelector(".left-arrow");
            this.right = container.querySelector(".right-arrow");

            this.videoWidth =
                container.querySelector(".youtube-wrapper").offsetWidth + 20;

            this.scrollAmount = this.videoWidth * 3;

            this.init();
        }

        init() {

            this.cloneVideos();

            if (this.right) {
                this.right.addEventListener("click", () => {
                    this.grid.scrollBy({
                        left: this.scrollAmount,
                        behavior: "smooth"
                    });
                });
            }

            if (this.left) {
                this.left.addEventListener("click", () => {
                    this.grid.scrollBy({
                        left: -this.scrollAmount,
                        behavior: "smooth"
                    });
                });
            }

            this.grid.addEventListener("scroll", () => this.infiniteScroll());

        }

        cloneVideos() {

            const wrappers = this.grid.querySelectorAll(".youtube-wrapper");

            wrappers.forEach(wrapper => {
                const clone = wrapper.cloneNode(true);
                this.grid.appendChild(clone);
            });

            initLazyLoad();
        }

        infiniteScroll() {

            const scrollLeft = this.grid.scrollLeft;
            const scrollWidth = this.grid.scrollWidth;
            const visibleWidth = this.grid.clientWidth;

            if (scrollLeft + visibleWidth >= scrollWidth - 150) {
                this.cloneVideos();
            }

        }
    }


    /* =========================
       INIT ALL GALLERIES
    ========================= */

    document.querySelectorAll(".video-container").forEach(container => {
        new VideoGallery(container);
    });


    /* =========================
       START LAZY LOADING
    ========================= */

    initLazyLoad();

});
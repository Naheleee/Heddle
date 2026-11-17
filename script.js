if (sessionStorage.getItem("page-transition") === "in") {
    document.documentElement.classList.add("is-entering");
    sessionStorage.removeItem("page-transition");
}

document.addEventListener("DOMContentLoaded", () => {
    const patternGrid = document.querySelector(".button-logo");
    const gridSize = 10;
    const halfSize = gridSize / 2;
    const patternCells = [];

    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement("span");
        cell.className = "pattern-cell";
        patternGrid.appendChild(cell);
        patternCells.push(cell);
    }

    function generatePattern() {
        const halfPattern = Array.from({
                length: halfSize
            }, () =>
            Array.from({
                length: halfSize
            }, () => Math.random() < 0.5)
        );

        for (let row = 0; row < gridSize; row++) {
            for (let column = 0; column < gridSize; column++) {
                const mirroredRow = Math.min(row, gridSize - 1 - row);
                const mirroredColumn = Math.min(column, gridSize - 1 - column);
                patternCells[row * gridSize + column].classList.toggle(
                    "is-filled",
                    halfPattern[mirroredRow][mirroredColumn]
                );
            }
        }
    }

    const webAppButton = document.querySelector(".button2");
    let patternTimer;

    generatePattern();
    webAppButton.addEventListener("pointerenter", () => {
        generatePattern();
        patternTimer = setInterval(generatePattern, 200);
    });
    webAppButton.addEventListener("pointerleave", () => {
        clearInterval(patternTimer);
    });
    webAppButton.addEventListener("click", (event) => {
        if (
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
        ) {
            return;
        }

        event.preventDefault();
        if (document.body.classList.contains("page-leaving")) {
            return;
        }

        clearInterval(patternTimer);
        sessionStorage.setItem("page-transition", "in");
        document.body.classList.add("page-leaving");
        window.setTimeout(() => {
            window.location.assign(webAppButton.href);
        }, 350);
    });

    if (document.documentElement.classList.contains("is-entering")) {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                document.documentElement.classList.remove("is-entering");
            });
        });
    }

    const section1 = document.querySelector(".section1");
    const scrollCueImage = document.querySelector(".section-scroll-cue img");
    const loomSection = document.querySelector(".section3");
    const nextSection = document.querySelector(".section2");
    const section2Heading = document.querySelector(".section2-heading");
    const carouselSection = document.querySelector(".section2");
    const carouselHeading = document.querySelector(".carousel-heading");
    const section4Heading = document.querySelector(".section4-heading");
    const alignSectionHeadings = () => {
        const carouselHeadingTop =
            carouselHeading.getBoundingClientRect().top - carouselSection.getBoundingClientRect().top;
        section2Heading.style.setProperty(
            "--section2-heading-offset",
            `${carouselHeadingTop - section2Heading.offsetTop}px`
        );
        section4Heading.style.setProperty(
            "--section4-heading-offset",
            `${carouselHeadingTop - section4Heading.offsetTop}px`
        );
    };

    alignSectionHeadings();
    window.addEventListener("resize", alignSectionHeadings);

    let loomOverlayFrame = 0;
    const updateLoomOverlay = () => {
        if (loomOverlayFrame) {
            return;
        }

        loomOverlayFrame = requestAnimationFrame(() => {
            loomOverlayFrame = 0;
            const section1Progress = Math.min(
                1,
                Math.max(0, (section1.offsetHeight - section1.getBoundingClientRect().bottom) / (section1.offsetHeight / 2))
            );
            scrollCueImage.style.opacity = 1 - section1Progress;

            const sectionHeight = loomSection.offsetHeight;
            const scrolledIntoSection =
                window.innerHeight - loomSection.getBoundingClientRect().top;
            const progress =
                (scrolledIntoSection - sectionHeight / 2) / (sectionHeight / 2);
            const opacity = Math.min(1, Math.max(0, progress));
            loomSection.style.setProperty(
                "--loom-overlay-opacity",
                opacity
            );
            loomSection.style.setProperty(
                "--loom-overlay-offset",
                `${40 * (1 - opacity)}px`
            );
        });
    };

    window.addEventListener("scroll", updateLoomOverlay, {
        passive: true
    });
    window.addEventListener("resize", updateLoomOverlay);
    updateLoomOverlay();

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let targetScrollY = window.scrollY;
    let smoothScrollFrame = 0;
    let isSmoothScrolling = false;
    let sectionScrollFrame = 0;

    const canScrollInsideElement = (target, deltaY) => {
        let element = target instanceof Element ? target : null;

        while (element && element !== document.body && element !== document.documentElement) {
            const overflowY = window.getComputedStyle(element).overflowY;
            const isScrollable = /auto|scroll|overlay/.test(overflowY) &&
                element.scrollHeight > element.clientHeight;

            if (isScrollable) {
                const canScroll = deltaY > 0 ?
                    element.scrollTop + element.clientHeight < element.scrollHeight :
                    element.scrollTop > 0;

                if (canScroll) {
                    return true;
                }
            }

            element = element.parentElement;
        }

        return false;
    };

    const animateSmoothScroll = () => {
        const currentScrollY = window.scrollY;
        const distance = targetScrollY - currentScrollY;

        if (Math.abs(distance) < 1) {
            window.scrollTo(0, targetScrollY);
            smoothScrollFrame = 0;
            isSmoothScrolling = false;
            return;
        }

        window.scrollTo(0, currentScrollY + distance * 0.12);
        smoothScrollFrame = requestAnimationFrame(animateSmoothScroll);
    };

    document.querySelector(".section-scroll-cue").addEventListener("click", (event) => {
        event.preventDefault();
        targetScrollY = window.scrollY + nextSection.getBoundingClientRect().top;

        if (reducedMotion.matches) {
            if (smoothScrollFrame) {
                cancelAnimationFrame(smoothScrollFrame);
            }
            smoothScrollFrame = 0;
            isSmoothScrolling = false;
            if (sectionScrollFrame) {
                cancelAnimationFrame(sectionScrollFrame);
                sectionScrollFrame = 0;
            }
            window.scrollTo(0, targetScrollY);
            return;
        }

        if (smoothScrollFrame) {
            cancelAnimationFrame(smoothScrollFrame);
        }
        smoothScrollFrame = 0;
        isSmoothScrolling = false;
        if (sectionScrollFrame) {
            cancelAnimationFrame(sectionScrollFrame);
        }

        const startScrollY = window.scrollY;
        const startTime = performance.now();
        const duration = 1500;
        const animateToSection = (time) => {
            const progress = Math.min((time - startTime) / duration, 1);
            const easedProgress = progress < 0.5
                ? 4 * progress ** 3
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            window.scrollTo(
                0,
                startScrollY + (targetScrollY - startScrollY) * easedProgress
            );

            if (progress < 1) {
                sectionScrollFrame = requestAnimationFrame(animateToSection);
            } else {
                sectionScrollFrame = 0;
            }
        };

        sectionScrollFrame = requestAnimationFrame(animateToSection);
    });

    window.addEventListener("wheel", (event) => {
        if (
            reducedMotion.matches ||
            event.ctrlKey ||
            event.shiftKey ||
            Math.abs(event.deltaX) > Math.abs(event.deltaY)
        ) {
            return;
        }

        const deltaScale = event.deltaMode === WheelEvent.DOM_DELTA_LINE ?
            16 :
            event.deltaMode === WheelEvent.DOM_DELTA_PAGE ?
            window.innerHeight :
            1;
        const deltaY = event.deltaY * deltaScale;

        if (!deltaY || canScrollInsideElement(event.target, deltaY)) {
            return;
        }

        if (sectionScrollFrame) {
            cancelAnimationFrame(sectionScrollFrame);
            sectionScrollFrame = 0;
        }

        const currentTarget = isSmoothScrolling ? targetScrollY : window.scrollY;
        const maxScrollY = document.documentElement.scrollHeight - window.innerHeight;
        const nextTarget = Math.min(maxScrollY, Math.max(0, currentTarget + deltaY));

        if (nextTarget === currentTarget) {
            return;
        }

        event.preventDefault();
        targetScrollY = nextTarget;

        if (!isSmoothScrolling) {
            isSmoothScrolling = true;
            smoothScrollFrame = requestAnimationFrame(animateSmoothScroll);
        }
    }, {
        passive: false
    });

    const carousel = document.querySelector(".carousel");
    const carouselCards = Array.from(carousel.querySelectorAll(".carousel-card"));
    let activeCardIndex = 0;
    let carouselTimer = 0;
    let carouselIsVisible = false;
    let dragStart = null;
    let isDragging = false;
    let dragMoved = false;
    let pointerDownCard = null;
    let suppressNextClick = false;
    let suppressClickTimer = 0;

    const renderCarousel = () => {
        const cardWidth = carouselCards[0].offsetWidth;
        const cardStep = cardWidth + Math.max(20, cardWidth * 0.14);

        carouselCards.forEach((card, index) => {
            let offset = (index - activeCardIndex + carouselCards.length) % carouselCards.length;
            if (offset > carouselCards.length / 2) {
                offset -= carouselCards.length;
            }

            const distance = Math.abs(offset);
            card.style.setProperty("--card-offset", `${offset * cardStep}px`);
            card.style.setProperty("--card-scale", Math.max(0.52, 1 - distance * 0.14));
            card.style.setProperty("--card-opacity", Math.max(0, 1 - distance * 0.45));
            card.style.setProperty("--card-z", carouselCards.length - distance);
            card.setAttribute("aria-hidden", offset === 0 ? "false" : "true");
            card.setAttribute("aria-label", `${index + 1} of ${carouselCards.length}`);
        });
    };

    const moveCarousel = (direction) => {
        activeCardIndex =
            (activeCardIndex + direction + carouselCards.length) % carouselCards.length;
        renderCarousel();
    };

    const updateCarouselTimer = () => {
        window.clearInterval(carouselTimer);
        carouselTimer = 0;

        if (
            !carouselIsVisible ||
            document.hidden ||
            reducedMotion.matches ||
            isDragging ||
            carousel.matches(":hover") ||
            carousel.contains(document.activeElement)
        ) {
            return;
        }

        carouselTimer = window.setInterval(() => moveCarousel(1), 10000);
    };

    carousel.addEventListener("pointerenter", updateCarouselTimer);
    carousel.addEventListener("pointerleave", updateCarouselTimer);
    carousel.addEventListener("focusin", updateCarouselTimer);
    carousel.addEventListener("focusout", updateCarouselTimer);
    carousel.addEventListener("pointerdown", (event) => {
        window.clearTimeout(suppressClickTimer);
        suppressClickTimer = 0;
        suppressNextClick = false;
        pointerDownCard = event.target.closest(".carousel-card");

        if (
            event.button !== 0 ||
            event.target.closest("video, button, a, input, select, textarea")
        ) {
            pointerDownCard = null;
            return;
        }

        dragStart = {
            x: event.clientX,
            y: event.clientY
        };
        isDragging = true;
        dragMoved = false;
        carousel.classList.add("is-dragging");
        carousel.setPointerCapture(event.pointerId);
        updateCarouselTimer();
    });
    carousel.addEventListener("pointermove", (event) => {
        if (!dragStart) {
            return;
        }

        const deltaX = event.clientX - dragStart.x;
        const deltaY = event.clientY - dragStart.y;
        if (Math.hypot(deltaX, deltaY) > 6) {
            dragMoved = true;
        }

        carousel.style.setProperty(
            "--drag-offset",
            `${deltaX}px`
        );
    });
    const finishCarouselDrag = (event, shouldAdvance) => {
        if (!dragStart) {
            return;
        }

        const deltaX = event.clientX - dragStart.x;
        const deltaY = event.clientY - dragStart.y;
        const wasDragged = dragMoved;
        dragStart = null;
        isDragging = false;
        dragMoved = false;
        carousel.classList.remove("is-dragging");
        carousel.style.setProperty("--drag-offset", "0px");

        if (wasDragged) {
            suppressNextClick = true;
            suppressClickTimer = window.setTimeout(() => {
                suppressNextClick = false;
                pointerDownCard = null;
            }, 500);
        }

        if (
            shouldAdvance &&
            Math.abs(deltaX) > 50 &&
            Math.abs(deltaX) > Math.abs(deltaY)
        ) {
            moveCarousel(deltaX < 0 ? 1 : -1);
        }

        updateCarouselTimer();
    };
    carousel.addEventListener("click", (event) => {
        if (suppressNextClick) {
            suppressNextClick = false;
            window.clearTimeout(suppressClickTimer);
            pointerDownCard = null;
            return;
        }

        if (event.target.closest("video, button, a, input, select, textarea")) {
            pointerDownCard = null;
            return;
        }

        const clickedCard =
            event.target.closest(".carousel-card") || pointerDownCard;
        pointerDownCard = null;

        const clickedIndex = carouselCards.indexOf(clickedCard);
        if (clickedIndex !== -1 && clickedIndex !== activeCardIndex) {
            activeCardIndex = clickedIndex;
            renderCarousel();
        }
    });
    carousel.addEventListener("pointerup", (event) => {
        finishCarouselDrag(event, true);
    });
    carousel.addEventListener("pointercancel", (event) => {
        finishCarouselDrag(event, false);
    });
    window.addEventListener("resize", renderCarousel);
    document.addEventListener("visibilitychange", updateCarouselTimer);
    reducedMotion.addEventListener("change", updateCarouselTimer);

    if ("IntersectionObserver" in window) {
        const carouselObserver = new IntersectionObserver((entries) => {
            carouselIsVisible = entries.some((entry) => entry.isIntersecting);
            updateCarouselTimer();
        }, {
            threshold: 0.2
        });
        carouselObserver.observe(carousel);
    } else {
        carouselIsVisible = true;
        updateCarouselTimer();
    }

    renderCarousel();
});

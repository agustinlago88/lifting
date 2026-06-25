let revealObserver;

document.addEventListener("DOMContentLoaded", () => {
    revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
            }
        });
    }, { threshold: 0.18 });

    document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

    const slides = Array.from(document.querySelectorAll("[data-testimonial-slide]"));
    const dotsContainer = document.querySelector("[data-testimonial-dots]");
    const prevButton = document.querySelector("[data-testimonial-prev]");
    const nextButton = document.querySelector("[data-testimonial-next]");

    if (slides.length > 1 && dotsContainer && prevButton && nextButton) {
        let currentSlide = 0;
        let autoplayId;

        const dots = slides.map((_, index) => {
            const dot = document.createElement("button");
            dot.type = "button";
            dot.className = "h-2.5 w-2.5 rounded-full bg-on-primary/35 transition-all";
            dot.setAttribute("aria-label", `Ver testimonio ${index + 1}`);
            dot.addEventListener("click", () => showSlide(index));
            dotsContainer.appendChild(dot);
            return dot;
        });

        const updateDots = () => {
            dots.forEach((dot, index) => {
                dot.classList.toggle("bg-on-primary", index === currentSlide);
                dot.classList.toggle("w-8", index === currentSlide);
            });
        };

        const showSlide = (index) => {
            currentSlide = (index + slides.length) % slides.length;
            slides.forEach((slide, slideIndex) => {
                slide.classList.toggle("hidden", slideIndex !== currentSlide);
            });
            updateDots();
            window.clearInterval(autoplayId);
            autoplayId = window.setInterval(() => showSlide(currentSlide + 1), 6000);
        };

        prevButton.addEventListener("click", () => showSlide(currentSlide - 1));
        nextButton.addEventListener("click", () => showSlide(currentSlide + 1));
        showSlide(0);
    }

    // FAQ Accordion Logic
    const faqItems = document.querySelectorAll("[data-faq-item]");
    faqItems.forEach((item) => {
        const toggle = item.querySelector("[data-faq-toggle]");
        const content = item.querySelector("[data-faq-content]");
        const icon = item.querySelector("[data-faq-icon]");

        if (toggle && content) {
            toggle.addEventListener("click", () => {
                const isOpen = !content.classList.contains("max-h-0");

                // Close all other open FAQ items first for accordion effect
                faqItems.forEach((otherItem) => {
                    if (otherItem !== item) {
                        const otherContent = otherItem.querySelector("[data-faq-content]");
                        const otherIcon = otherItem.querySelector("[data-faq-icon]");
                        if (otherContent && !otherContent.classList.contains("max-h-0")) {
                            otherContent.style.maxHeight = null;
                            otherContent.classList.add("max-h-0");
                            if (otherIcon) {
                                otherIcon.classList.remove("rotate-180");
                            }
                        }
                    }
                });

                // Toggle current item
                if (isOpen) {
                    content.style.maxHeight = null;
                    content.classList.add("max-h-0");
                    if (icon) {
                        icon.classList.remove("rotate-180");
                    }
                } else {
                    // Set max-height to scrollHeight for a smooth transition
                    content.style.maxHeight = content.scrollHeight + "px";
                    content.classList.remove("max-h-0");
                    if (icon) {
                        icon.classList.add("rotate-180");
                    }
                }
            });
        }
    });
});

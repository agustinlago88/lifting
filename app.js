let revealObserver;

document.addEventListener("DOMContentLoaded", () => {
    // Intersection Observer para animaciones Reveal suaves
    revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

    // Testimonial Slider
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

                // Cierra otros acordeones para mantener orden visual
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

                // Toggle elemento actual
                if (isOpen) {
                    content.style.maxHeight = null;
                    content.classList.add("max-h-0");
                    if (icon) {
                        icon.classList.remove("rotate-180");
                    }
                } else {
                    content.style.maxHeight = content.scrollHeight + "px";
                    content.classList.remove("max-h-0");
                    if (icon) {
                        icon.classList.add("rotate-180");
                    }
                }
            });
        }
    });

    // Menú Móvil
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    const mobileMenuIcon = document.getElementById("mobile-menu-icon");

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener("click", () => {
            const isHidden = mobileMenu.classList.contains("hidden");
            if (isHidden) {
                mobileMenu.classList.remove("hidden");
                mobileMenuBtn.setAttribute("aria-expanded", "true");
                if (mobileMenuIcon) mobileMenuIcon.textContent = "close";
            } else {
                mobileMenu.classList.add("hidden");
                mobileMenuBtn.setAttribute("aria-expanded", "false");
                if (mobileMenuIcon) mobileMenuIcon.textContent = "menu";
            }
        });

        // Cerrar menú al hacer clic en enlaces
        mobileMenu.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                mobileMenu.classList.add("hidden");
                mobileMenuBtn.setAttribute("aria-expanded", "false");
                if (mobileMenuIcon) mobileMenuIcon.textContent = "menu";
            });
        });
    }

    // Seguimiento Seguro de Eventos de Conversión (Meta Pixel)
    document.querySelectorAll("a[href*='wa.me'], a[href*='whatsapp.com']").forEach((el) => {
        el.addEventListener("click", () => {
            if (typeof fbq === "function") {
                fbq("track", "Contact");
            }
        });
    });

    document.querySelectorAll("a[href^='tel:']").forEach((el) => {
        el.addEventListener("click", () => {
            if (typeof fbq === "function") {
                fbq("track", "Contact");
            }
        });
    });
});

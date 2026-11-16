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



    // ============================================================================
    // CONFIGURACIÓN DE FORMSPREE PARA EL FORMULARIO DE CONTACTO
    // IMPORTANTE: REEMPLAZAR TU_FORM_ID por el ID real de Formspree antes de publicar
    // Ejemplo: const FORMSPREE_ENDPOINT = "https://formspree.io/f/xabcdefg";
    // ============================================================================
    const FORMSPREE_ENDPOINT = "https://formspree.io/f/TU_FORM_ID";

    const leadForm = document.getElementById("lead-contact-form");
    if (leadForm) {
        const nombreInput = document.getElementById("lead-nombre");
        const emailInput = document.getElementById("lead-email");
        const telefonoInput = document.getElementById("lead-telefono");
        const zonaInput = document.getElementById("lead-zona");
        const mensajeInput = document.getElementById("lead-mensaje");
        const honeypotInput = document.getElementById("lead-website");

        const errorNombre = document.getElementById("error-nombre");
        const errorEmail = document.getElementById("error-email");
        const errorTelefono = document.getElementById("error-telefono");
        const statusBox = document.getElementById("form-status-message");
        const submitBtn = document.getElementById("lead-submit-btn");
        const submitText = document.getElementById("lead-submit-text");

        const setFieldError = (inputEl, errorEl, message) => {
            if (!inputEl || !errorEl) return;
            if (message) {
                errorEl.textContent = message;
                errorEl.classList.remove("hidden");
                inputEl.classList.add("border-red-400");
                inputEl.setAttribute("aria-invalid", "true");
            } else {
                errorEl.textContent = "";
                errorEl.classList.add("hidden");
                inputEl.classList.remove("border-red-400");
                inputEl.removeAttribute("aria-invalid");
            }
        };

        // Normaliza el teléfono al formato internacional E.164 (ej. +5491139583670)
        // Si el usuario no ingresó código de país (+), asume Argentina (+54).
        const normalizePhoneE164 = (rawPhone) => {
            const trimmed = (rawPhone || "").trim();
            const hasPlus = trimmed.startsWith("+");
            let digits = trimmed.replace(/\D/g, "");

            if (!digits) return "";

            if (hasPlus) {
                return "+" + digits;
            }
            if (trimmed.startsWith("00")) {
                return "+" + digits.slice(2);
            }
            if (digits.startsWith("54") && digits.length >= 11) {
                return "+" + digits;
            }
            // Quitar prefijo local 0 si existe (ej. 011 -> 11)
            if (digits.startsWith("0")) {
                digits = digits.slice(1);
            }
            return "+54" + digits;
        };

        const isValidEmail = (email) => {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        };

        const validateForm = () => {
            let valid = true;
            const nombreVal = (nombreInput.value || "").trim();
            const emailVal = (emailInput.value || "").trim();
            const telVal = (telefonoInput.value || "").trim();
            const telDigits = telVal.replace(/\D/g, "");

            if (!nombreVal || nombreVal.length < 2) {
                setFieldError(nombreInput, errorNombre, "Por favor, ingresá tu nombre completo.");
                valid = false;
            } else {
                setFieldError(nombreInput, errorNombre, "");
            }

            if (!emailVal || !isValidEmail(emailVal)) {
                setFieldError(emailInput, errorEmail, "Por favor, ingresá un email válido (ej. nombre@correo.com).");
                valid = false;
            } else {
                setFieldError(emailInput, errorEmail, "");
            }

            if (!telVal || telDigits.length < 8) {
                setFieldError(telefonoInput, errorTelefono, "Por favor, ingresá un número de teléfono válido con código de área.");
                valid = false;
            } else {
                setFieldError(telefonoInput, errorTelefono, "");
            }

            return valid;
        };

        [
            [nombreInput, errorNombre],
            [emailInput, errorEmail],
            [telefonoInput, errorTelefono]
        ].forEach(([inputEl, errEl]) => {
            if (inputEl) {
                inputEl.addEventListener("input", () => setFieldError(inputEl, errEl, ""));
            }
        });

        leadForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            if (statusBox) {
                statusBox.className = "hidden rounded-sm p-4 text-xs sm:text-sm";
                statusBox.textContent = "";
            }

            // Filtro Honeypot silencioso contra bots
            if (honeypotInput && honeypotInput.value.trim() !== "") {
                leadForm.reset();
                return;
            }

            if (!validateForm()) {
                return;
            }

            const normalizedEmail = emailInput.value.trim().toLowerCase();
            const normalizedPhone = normalizePhoneE164(telefonoInput.value);

            submitBtn.disabled = true;
            submitBtn.setAttribute("aria-busy", "true");
            if (submitText) submitText.textContent = "Enviando...";

            try {
                const payload = {
                    nombre: nombreInput.value.trim(),
                    email: normalizedEmail,
                    telefono: normalizedPhone,
                    zona_interes: zonaInput ? zonaInput.value : "",
                    mensaje: mensajeInput ? mensajeInput.value.trim() : ""
                };

                const response = await fetch(FORMSPREE_ENDPOINT, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    throw new Error("Error en el envío del formulario");
                }

                // Disparo de evento para Google Tag Manager / Google Ads Enhanced Conversions for Leads
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                    event: "generate_lead",
                    user_data: {
                        email: normalizedEmail,
                        phone_number: normalizedPhone
                    }
                });

                leadForm.reset();
                if (statusBox) {
                    statusBox.className = "rounded-sm p-4 text-xs sm:text-sm bg-accent-teal/15 border border-accent-teal text-white";
                    statusBox.textContent = "¡Gracias! Recibimos tus datos correctamente. El equipo del Dr. Leandro Vila se pondrá en contacto con vos a la brevedad.";
                }
            } catch (err) {
                if (statusBox) {
                    statusBox.className = "rounded-sm p-4 text-xs sm:text-sm bg-red-950/60 border border-red-400 text-red-200";
                    statusBox.textContent = "No pudimos enviar el formulario en este momento. Por favor verificá tu conexión o escribinos directamente por WhatsApp.";
                }
            } finally {
                submitBtn.disabled = false;
                submitBtn.removeAttribute("aria-busy");
                if (submitText) submitText.textContent = "Enviar solicitud";
            }
        });
    }
});

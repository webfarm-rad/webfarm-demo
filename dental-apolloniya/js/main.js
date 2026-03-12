// ====================================
// Main JavaScript for Apolloniya Dental Clinic
// ====================================

(function() {
    'use strict';

    // ====================================
    // Mobile Menu Toggle
    // ====================================
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const nav = document.getElementById('nav');

    if (mobileMenuToggle && nav) {
        mobileMenuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.classList.toggle('active');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                nav.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });

        // Close mobile menu when clicking on a link
        const navLinks = nav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                nav.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            });
        });
    }

    // ====================================
    // Header Scroll Effect
    // ====================================
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // ====================================
    // Smooth Scroll for Anchor Links
    // ====================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href === '#' || href === '') return;

            e.preventDefault();

            const target = document.querySelector(href);
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientTop() + window.pageYOffset - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ====================================
    // Service Cards Animation on Scroll
    // ====================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';

                setTimeout(() => {
                    entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });

    // Observe doctor cards
    const doctorCards = document.querySelectorAll('.doctor-card');
    doctorCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.15}s`;
        observer.observe(card);
    });

    // ====================================
    // Works Tabs Filtering
    // ====================================
    const worksTabs = document.querySelectorAll('.works-tab');
    const workItems = document.querySelectorAll('.work-item');

    worksTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const category = this.getAttribute('data-category');

            // Update active tab
            worksTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // Filter work items
            workItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');

                if (category === 'all' || itemCategory === category) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // ====================================
    // Reviews Carousel
    // ====================================
    const reviewsCarousel = document.querySelector('.reviews-carousel');
    const reviewCards = document.querySelectorAll('.review-card');
    const reviewPrev = document.querySelector('.review-prev');
    const reviewNext = document.querySelector('.review-next');

    if (reviewsCarousel && reviewCards.length > 0) {
        let currentReviewIndex = 0;
        let reviewsPerView = 4;

        // Adjust reviews per view based on screen size
        function updateReviewsPerView() {
            if (window.innerWidth <= 768) {
                reviewsPerView = 1;
            } else if (window.innerWidth <= 1024) {
                reviewsPerView = 2;
            } else {
                reviewsPerView = 4;
            }
        }

        updateReviewsPerView();
        window.addEventListener('resize', updateReviewsPerView);

        function showReviews(index) {
            reviewCards.forEach((card, i) => {
                card.style.display = 'none';
                card.style.opacity = '0';
            });

            for (let i = index; i < index + reviewsPerView && i < reviewCards.length; i++) {
                reviewCards[i].style.display = 'block';
                setTimeout(() => {
                    reviewCards[i].style.opacity = '1';
                }, 50);
            }
        }

        if (reviewPrev) {
            reviewPrev.addEventListener('click', function() {
                currentReviewIndex = Math.max(0, currentReviewIndex - reviewsPerView);
                showReviews(currentReviewIndex);
            });
        }

        if (reviewNext) {
            reviewNext.addEventListener('click', function() {
                currentReviewIndex = Math.min(reviewCards.length - reviewsPerView, currentReviewIndex + reviewsPerView);
                showReviews(currentReviewIndex);
            });
        }

        // Auto-rotate reviews every 5 seconds
        setInterval(function() {
            currentReviewIndex++;
            if (currentReviewIndex > reviewCards.length - reviewsPerView) {
                currentReviewIndex = 0;
            }
            showReviews(currentReviewIndex);
        }, 5000);

        showReviews(currentReviewIndex);
    }

    // ====================================
    // Statistics Counter Animation
    // ====================================
    const statNumbers = document.querySelectorAll('.stat-number');

    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, 0, target, 2000);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });

    function animateCounter(element, start, end, duration) {
        let startTime = null;

        function animation(currentTime) {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);

            const current = Math.floor(progress * (end - start) + start);
            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(animation);
            } else {
                element.textContent = end;
            }
        }

        requestAnimationFrame(animation);
    }

    // ====================================
    // FAQ Accordion
    // ====================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', function() {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // ====================================
    // Appointment Modal
    // ====================================
    const appointmentModal = document.getElementById('appointmentModal');
    const appointmentBtns = document.querySelectorAll('#appointmentBtn, #heroAppointmentBtn, #servicesAppointmentBtn, .doctor-appointment');
    const modalClose = document.querySelector('.modal-close');
    const modalOverlay = document.querySelector('.modal-overlay');

    function openModal() {
        appointmentModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        appointmentModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    appointmentBtns.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }

    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && appointmentModal.classList.contains('active')) {
            closeModal();
        }
    });

    // ====================================
    // Consultation Button (WhatsApp)
    // ====================================
    const consultationBtn = document.getElementById('consultationBtn');

    if (consultationBtn) {
        consultationBtn.addEventListener('click', function() {
            const phone = '79184664484';
            const message = encodeURIComponent('Здравствуйте! Хочу записаться на бесплатную консультацию в стоматологию Апполония.');
            window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
        });
    }

    // ====================================
    // Call Button
    // ====================================
    const callBtn = document.getElementById('callBtn');

    if (callBtn) {
        callBtn.addEventListener('click', function() {
            window.location.href = 'tel:+79184664484';
        });
    }

    // ====================================
    // Form Handling
    // ====================================
    const appointmentForm = document.getElementById('appointmentForm');
    const ctaForm = document.getElementById('ctaForm');

    function handleFormSubmit(e, formName) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        // Create WhatsApp message
        let message = `🦷 Новая заявка с сайта Апполония\n\n`;
        message += `👤 Имя: ${data.name}\n`;
        message += `📱 Телефон: ${data.phone}\n`;

        if (data.service) {
            const serviceNames = {
                'consultation': 'Консультация',
                'therapy': 'Лечение кариеса',
                'implants': 'Имплантация',
                'veneers': 'Виниры',
                'whitening': 'Отбеливание',
                'hygiene': 'Профгигиена',
                'braces': 'Брекеты',
                'other': 'Другое'
            };
            message += `🔧 Услуга: ${serviceNames[data.service] || data.service}\n`;
        }

        if (data.comment) {
            message += `💬 Комментарий: ${data.comment}\n`;
        }

        const phone = '79184664484';
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

        // Open WhatsApp
        window.open(url, '_blank');

        // Reset form
        e.target.reset();

        // Close modal if it was opened
        if (formName === 'appointment') {
            closeModal();
        }
    }

    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            handleFormSubmit(e, 'appointment');
        });
    }

    if (ctaForm) {
        ctaForm.addEventListener('submit', function(e) {
            handleFormSubmit(e, 'cta');
        });
    }

    // ====================================
    // Phone Input Formatting
    // ====================================
    const phoneInputs = document.querySelectorAll('input[type="tel"]');

    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');

            if (value.length > 0) {
                if (value[0] !== '7' && value[0] !== '8') {
                    value = '7' + value;
                } else if (value[0] === '8') {
                    value = '7' + value.slice(1);
                }
            }

            let formatted = '';
            if (value.length > 0) {
                formatted = '+7';
                if (value.length > 1) {
                    formatted += ' (' + value.substring(1, 4);
                }
                if (value.length >= 5) {
                    formatted += ') ' + value.substring(4, 7);
                }
                if (value.length >= 8) {
                    formatted += '-' + value.substring(7, 9);
                }
                if (value.length >= 10) {
                    formatted += '-' + value.substring(9, 11);
                }
            }

            e.target.value = formatted;
        });

        // Set initial format if value exists
        if (input.value) {
            input.dispatchEvent(new Event('input'));
        }
    });

    // Parallax removed — caused overlay desync with background image

    // ====================================
    // Service Cards Hover Effect
    // ====================================
    const serviceCardsHover = document.querySelectorAll('.service-card');

    serviceCardsHover.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.service-icon');
            if (icon) {
                icon.style.transform = 'rotate(5deg) scale(1.1)';
            }
        });

        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.service-icon');
            if (icon) {
                icon.style.transform = 'rotate(0deg) scale(1)';
            }
        });
    });

    // ====================================
    // Active Navigation Link on Scroll
    // ====================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveNav() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 150;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);

    // ====================================
    // Scroll to Top Button (Hidden by default)
    // ====================================
    let scrollTopBtn = document.createElement('button');
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--primary-color);
        color: white;
        border: none;
        cursor: pointer;
        opacity: 0;
        pointer-events: none;
        transition: all 0.3s ease;
        z-index: 998;
        box-shadow: 0 4px 16px rgba(0,0,0,0.2);
    `;

    document.body.appendChild(scrollTopBtn);

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 500) {
            scrollTopBtn.style.opacity = '1';
            scrollTopBtn.style.pointerEvents = 'all';
        } else {
            scrollTopBtn.style.opacity = '0';
            scrollTopBtn.style.pointerEvents = 'none';
        }
    });

    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

})();
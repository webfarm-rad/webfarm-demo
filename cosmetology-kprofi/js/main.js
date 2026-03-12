/**
 * K-profi Cosmetology Studio
 * Main JavaScript File
 */

// ==========================================
// Utility Functions
// ==========================================

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const addClass = (el, className) => el && el.classList.add(className);
const removeClass = (el, className) => el && el.classList.remove(className);
const toggleClass = (el, className) => el && el.classList.toggle(className);
const hasClass = (el, className) => el && el.classList.contains(className);

// ==========================================
// Header Scroll Effect
// ==========================================

function initHeaderScroll() {
    const header = $('#header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            addClass(header, 'scrolled');
        } else {
            removeClass(header, 'scrolled');
        }

        lastScroll = currentScroll;
    });
}

// ==========================================
// Mobile Menu
// ==========================================

function initMobileMenu() {
    const burger = $('#burger');
    const nav = $('#nav');
    const navLinks = $$('.nav-link');
    const body = document.body;

    if (!burger || !nav) return;

    burger.addEventListener('click', () => {
        toggleClass(burger, 'active');
        toggleClass(nav, 'active');
        toggleClass(body, 'menu-open');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            removeClass(burger, 'active');
            removeClass(nav, 'active');
            removeClass(body, 'menu-open');
        });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !burger.contains(e.target) && hasClass(nav, 'active')) {
            removeClass(burger, 'active');
            removeClass(nav, 'active');
            removeClass(body, 'menu-open');
        }
    });
}

// ==========================================
// Smooth Scroll
// ==========================================

function initSmoothScroll() {
    const links = $$('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            if (href === '#') {
                e.preventDefault();
                return;
            }

            const target = $(href);
            if (!target) return;

            e.preventDefault();

            const headerHeight = $('#header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

// ==========================================
// Before/After Slider
// ==========================================

function initBeforeAfterSlider() {
    const slider = $('.before-after-slider');
    if (!slider) return;

    const slides = $$('.before-after-slide');
    const prevBtn = $('.slider-prev');
    const nextBtn = $('.slider-next');
    const dotsContainer = $('.slider-dots');

    if (slides.length === 0) return;

    let currentSlide = 0;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = $$('.slider-dot');

    function showSlide(n) {
        slides.forEach(slide => removeClass(slide, 'active'));
        dots.forEach(dot => removeClass(dot, 'active'));

        if (n >= slides.length) currentSlide = 0;
        if (n < 0) currentSlide = slides.length - 1;

        addClass(slides[currentSlide], 'active');
        addClass(dots[currentSlide], 'active');
    }

    function goToSlide(n) {
        currentSlide = n;
        showSlide(currentSlide);
    }

    function nextSlide() {
        currentSlide++;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide--;
        showSlide(currentSlide);
    }

    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Show first slide
    showSlide(currentSlide);

    // Auto-play
    let autoplayInterval = setInterval(nextSlide, 5000);

    // Pause on hover
    slider.addEventListener('mouseenter', () => {
        clearInterval(autoplayInterval);
    });

    slider.addEventListener('mouseleave', () => {
        autoplayInterval = setInterval(nextSlide, 5000);
    });
}

// ==========================================
// Statistics Counter Animation
// ==========================================

function initStatsCounter() {
    const stats = $$('.stat-number');
    if (stats.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stat = entry.target;
                const target = parseInt(stat.getAttribute('data-target'));
                animateCounter(stat, target);
                observer.unobserve(stat);
            }
        });
    }, {
        threshold: 0.5
    });

    stats.forEach(stat => observer.observe(stat));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const duration = 2000;
    const stepTime = duration / 50;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, stepTime);
}

// ==========================================
// FAQ Accordion
// ==========================================

function initFAQ() {
    const faqItems = $$('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const isActive = hasClass(item, 'active');

            // Close all items
            faqItems.forEach(faqItem => {
                removeClass(faqItem, 'active');
            });

            // Open clicked item if it wasn't active
            if (!isActive) {
                addClass(item, 'active');
            }
        });
    });
}

// ==========================================
// Modal Functions
// ==========================================

function initModals() {
    const modal = $('#callbackModal');
    const modalOverlay = $('.modal-overlay');
    const modalClose = $('#modalClose');
    const callbackButtons = $$('.btn-callback');

    if (!modal) return;

    // Open modal
    callbackButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });

    // Close modal
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && hasClass(modal, 'active')) {
            closeModal();
        }
    });

    function openModal() {
        addClass(modal, 'active');
        addClass(document.body, 'modal-open');
    }

    function closeModal() {
        removeClass(modal, 'active');
        removeClass(document.body, 'modal-open');
    }
}

// ==========================================
// Form Handling
// ==========================================

function initForms() {
    const forms = $$('form');

    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });

    // Phone mask
    const phoneInputs = $$('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');

            if (value.length > 0) {
                if (value[0] !== '7') {
                    value = '7' + value;
                }

                let formatted = '+7';
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

                e.target.value = formatted;
            }
        });
    });
}

function handleFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    // Get form data
    const data = {};
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }

    // Get phone and service
    const phone = form.querySelector('input[type="tel"]').value;
    const name = form.querySelector('input[type="text"]').value;
    const service = form.querySelector('select') ? form.querySelector('select').value : 'Консультация';

    // Create WhatsApp message
    const message = encodeURIComponent(
        `Здравствуйте! Меня зовут ${name}.\n` +
        `Хочу записаться на: ${getServiceName(service)}\n` +
        `Мой телефон: ${phone}`
    );

    // Redirect to WhatsApp
    window.open(`https://wa.me/79281411120?text=${message}`, '_blank');

    // Close modal if open
    const modal = $('#callbackModal');
    if (modal && hasClass(modal, 'active')) {
        removeClass(modal, 'active');
        removeClass(document.body, 'modal-open');
    }

    // Reset form
    form.reset();

    // Show success message
    showNotification('Спасибо! Сейчас вы будете перенаправлены в WhatsApp.', 'success');
}

function getServiceName(value) {
    const services = {
        'laser': 'Лазерная эпиляция',
        'facial': 'Уход за лицом',
        'body': 'Уход за телом',
        'injections': 'Инъекционная косметология',
        'consultation': 'Консультация'
    };
    return services[value] || 'Консультация';
}

// ==========================================
// Notifications
// ==========================================

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 16px 24px;
        background-color: ${type === 'success' ? '#52C93F' : '#E8B4B8'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 350px;
        font-family: 'Open Sans', sans-serif;
        font-size: 14px;
        font-weight: 600;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ==========================================
// Scroll Animations
// ==========================================

function initScrollAnimations() {
    const elements = $$('.service-card, .why-card, .review-card, .stat-card, .faq-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.remove('scroll-hidden');
                    entry.target.classList.add('scroll-visible');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    elements.forEach(element => {
        element.classList.add('scroll-hidden');
        observer.observe(element);
    });
}

// ==========================================
// Active Nav Link
// ==========================================

function initActiveNav() {
    const sections = $$('section[id]');
    const navLinks = $$('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.pageYOffset + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = sectionId;
            }
        });

        navLinks.forEach(link => {
            removeClass(link, 'active');
            const href = link.getAttribute('href');
            if (href === `#${current}` || (current === '' && href === 'index.html')) {
                addClass(link, 'active');
            }
        });
    });
}

// ==========================================
// Lazy Loading Images
// ==========================================

function initLazyLoading() {
    const images = $$('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// ==========================================
// Back to Top Button
// ==========================================

function initBackToTop() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #E8B4B8 0%, #D89BA0 100%);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        font-size: 18px;
    `;

    document.body.appendChild(backToTopBtn);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==========================================
// Initialize All Functions
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initMobileMenu();
    initSmoothScroll();
    initBeforeAfterSlider();
    initStatsCounter();
    initFAQ();
    initModals();
    initForms();
    initScrollAnimations();
    initActiveNav();
    initLazyLoading();
    initBackToTop();
});

// ==========================================
// Performance Optimization
// ==========================================

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add loading state
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
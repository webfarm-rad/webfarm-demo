// ========================================
// Initialize AOS (Animate On Scroll)
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }
});

// ========================================
// Mobile Navigation Toggle
// ========================================

const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');

if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking on a link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ========================================
// Header Scroll Effect
// ========================================

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

// ========================================
// Smooth Scrolling for Anchor Links
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');

        if (href !== '#' && href.length > 1) {
            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ========================================
// Counter Animation
// ========================================

function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = Math.floor(target);
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Intersection Observer for counters
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            const target = parseInt(entry.target.getAttribute('data-target'));
            animateCounter(entry.target, target);
            entry.target.classList.add('counted');
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.trust-number, .stat-number').forEach(counter => {
    counterObserver.observe(counter);
});

// ========================================
// Reviews Slider
// ========================================

const reviewsTrack = document.getElementById('reviewsTrack');
const reviewsPrev = document.getElementById('reviewsPrev');
const reviewsNext = document.getElementById('reviewsNext');

if (reviewsTrack && reviewsPrev && reviewsNext) {
    let currentIndex = 0;
    const reviewCards = reviewsTrack.querySelectorAll('.review-card');
    const totalReviews = reviewCards.length;
    const cardWidth = 450 + 30; // card width + gap

    // Calculate max index based on viewport
    function getMaxIndex() {
        const viewportWidth = window.innerWidth;
        if (viewportWidth < 768) {
            return totalReviews - 1;
        } else if (viewportWidth < 1200) {
            return totalReviews - 2;
        } else {
            return totalReviews - 3;
        }
    }

    function updateSlider() {
        const offset = -currentIndex * cardWidth;
        reviewsTrack.style.transform = `translateX(${offset}px)`;

        // Update button states
        reviewsPrev.style.opacity = currentIndex === 0 ? '0.5' : '1';
        reviewsPrev.style.cursor = currentIndex === 0 ? 'not-allowed' : 'pointer';

        const maxIndex = getMaxIndex();
        reviewsNext.style.opacity = currentIndex >= maxIndex ? '0.5' : '1';
        reviewsNext.style.cursor = currentIndex >= maxIndex ? 'not-allowed' : 'pointer';
    }

    reviewsNext.addEventListener('click', () => {
        const maxIndex = getMaxIndex();
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateSlider();
        }
    });

    reviewsPrev.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });

    // Reset on window resize
    window.addEventListener('resize', () => {
        currentIndex = 0;
        updateSlider();
    });

    // Auto-play slider
    let autoPlayInterval = setInterval(() => {
        const maxIndex = getMaxIndex();
        if (currentIndex >= maxIndex) {
            currentIndex = 0;
        } else {
            currentIndex++;
        }
        updateSlider();
    }, 5000);

    // Pause auto-play on hover
    reviewsTrack.addEventListener('mouseenter', () => {
        clearInterval(autoPlayInterval);
    });

    reviewsTrack.addEventListener('mouseleave', () => {
        autoPlayInterval = setInterval(() => {
            const maxIndex = getMaxIndex();
            if (currentIndex >= maxIndex) {
                currentIndex = 0;
            } else {
                currentIndex++;
            }
            updateSlider();
        }, 5000);
    });

    // Initial update
    updateSlider();
}

// ========================================
// FAQ Accordion
// ========================================

const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all items
        faqItems.forEach(otherItem => {
            otherItem.classList.remove('active');
        });

        // Open clicked item if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// ========================================
// Gallery Modal
// ========================================

const galleryModal = document.getElementById('galleryModal');
const galleryImage = document.getElementById('galleryImage');
const galleryClose = document.getElementById('galleryClose');
const galleryBtns = document.querySelectorAll('.gallery-btn');

if (galleryModal && galleryImage) {
    galleryBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const imageSrc = this.getAttribute('data-image');
            galleryImage.src = imageSrc;
            galleryModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    if (galleryClose) {
        galleryClose.addEventListener('click', () => {
            galleryModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    galleryModal.querySelector('.modal-overlay').addEventListener('click', () => {
        galleryModal.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Close with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && galleryModal.classList.contains('active')) {
            galleryModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ========================================
// Call Modal
// ========================================

const callModal = document.getElementById('callModal');
const ctaBtn = document.getElementById('ctaBtn');
const serviceCallBtn = document.getElementById('serviceCallBtn');
const modalClose = document.getElementById('modalClose');

function openCallModal() {
    if (callModal) {
        callModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeCallModal() {
    if (callModal) {
        callModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

if (ctaBtn) {
    ctaBtn.addEventListener('click', openCallModal);
}

if (serviceCallBtn) {
    serviceCallBtn.addEventListener('click', openCallModal);
}

if (modalClose) {
    modalClose.addEventListener('click', closeCallModal);
}

if (callModal) {
    callModal.querySelector('.modal-overlay').addEventListener('click', closeCallModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && callModal.classList.contains('active')) {
            closeCallModal();
        }
    });
}

// ========================================
// Call Form Handler
// ========================================

const callForm = document.getElementById('callForm');

if (callForm) {
    // Phone mask
    const phoneInput = document.getElementById('callPhone');

    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');

            if (value.length > 0) {
                if (value[0] === '8') {
                    value = '7' + value.substring(1);
                }

                let formatted = '+7';

                if (value.length > 1) {
                    formatted += ' (' + value.substring(1, 4);
                }
                if (value.length >= 4) {
                    formatted += ') ' + value.substring(4, 7);
                }
                if (value.length >= 7) {
                    formatted += '-' + value.substring(7, 9);
                }
                if (value.length >= 9) {
                    formatted += '-' + value.substring(9, 11);
                }

                e.target.value = formatted;
            }
        });
    }

    callForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('callName').value;
        const phone = document.getElementById('callPhone').value;

        // Create WhatsApp message
        const message = `Здравствуйте! Меня зовут ${name}. Прошу перезвонить по номеру ${phone}.`;
        const whatsappUrl = `https://wa.me/79272073428?text=${encodeURIComponent(message)}`;

        // Open WhatsApp
        window.open(whatsappUrl, '_blank');

        // Close modal and reset form
        closeCallModal();
        callForm.reset();

        // Show success message (optional)
        alert('Перенаправляем вас в WhatsApp...');
    });
}

// ========================================
// Scroll to Top Button
// ========================================

const scrollTopBtn = document.getElementById('scrollTop');

if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========================================
// Lazy Loading Images
// ========================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ========================================
// Service Card Hover Effects
// ========================================

const serviceCards = document.querySelectorAll('.service-card');

serviceCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// ========================================
// Parallax Effect for Hero
// ========================================

const heroBg = document.querySelector('.hero-bg img');

if (heroBg) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5;

        if (scrolled < window.innerHeight) {
            heroBg.style.transform = `translateY(${rate}px)`;
        }
    });
}

// ========================================
// Trust Badge Animation on Scroll
// ========================================

const trustBadge = document.querySelector('.about-badge');

if (trustBadge) {
    const badgeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                trustBadge.style.animation = 'scaleIn 0.6s ease';
            }
        });
    }, { threshold: 0.5 });

    badgeObserver.observe(trustBadge);
}

// ========================================
// Active Navigation Link
// ========================================

function setActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', setActiveNavLink);

// ========================================
// Prevent Default for Empty Links
// ========================================

document.querySelectorAll('a[href="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
    });
});

// ========================================
// Performance: Debounce Function
// ========================================

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

// Apply debounce to scroll events
const debouncedScroll = debounce(() => {
    setActiveNavLink();
}, 100);

window.addEventListener('scroll', debouncedScroll);

// ========================================
// Initialize on DOM Ready
// ========================================

console.log('🔧 Ремонт обуви на Гагарина - сайт загружен');

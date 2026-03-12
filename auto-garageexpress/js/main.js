/* ==========================================
   GARAGE EXPRESS - MAIN JAVASCRIPT
   Interactive functionality for the website
   ========================================== */

'use strict';

/* ==========================================
   1. PAGE LOADER
   ========================================== */

window.addEventListener('load', () => {
  const pageLoader = document.getElementById('pageLoader');
  if (pageLoader) {
    pageLoader.classList.add('hidden');
    setTimeout(() => pageLoader.remove(), 500);
  }
});

/* ==========================================
   2. HEADER SCROLL BEHAVIOR
   ========================================== */

const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 100) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  lastScroll = currentScroll;
});

/* ==========================================
   3. MOBILE MENU
   ========================================== */

const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuClose = document.getElementById('mobileMenuClose');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu__link');

function openMobileMenu() {
  mobileMenu.classList.add('active');
  burger.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  mobileMenu.classList.remove('active');
  burger.classList.remove('active');
  document.body.style.overflow = '';
}

if (burger) {
  burger.addEventListener('click', () => {
    if (mobileMenu.classList.contains('active')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });
}

if (mobileMenuClose) {
  mobileMenuClose.addEventListener('click', closeMobileMenu);
}

mobileMenuLinks.forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

// Close mobile menu on click outside
mobileMenu?.addEventListener('click', (e) => {
  if (e.target === mobileMenu) {
    closeMobileMenu();
  }
});

/* ==========================================
   4. HERO SLIDER
   ========================================== */

const heroSlides = document.querySelectorAll('.hero__slide');
const heroDots = document.querySelectorAll('.hero__dot');
const heroArrowPrev = document.getElementById('heroArrowPrev');
const heroArrowNext = document.getElementById('heroArrowNext');

let currentSlide = 0;
const slideInterval = 5000; // 5 seconds
let slideTimer;

function showSlide(index) {
  // Remove active classes
  heroSlides.forEach(slide => slide.classList.remove('hero__slide--active'));
  heroDots.forEach(dot => dot.classList.remove('hero__dot--active'));

  // Wrap around
  if (index >= heroSlides.length) {
    currentSlide = 0;
  } else if (index < 0) {
    currentSlide = heroSlides.length - 1;
  } else {
    currentSlide = index;
  }

  // Add active classes
  heroSlides[currentSlide].classList.add('hero__slide--active');
  heroDots[currentSlide].classList.add('hero__dot--active');
}

function nextSlide() {
  showSlide(currentSlide + 1);
}

function prevSlide() {
  showSlide(currentSlide - 1);
}

function startSlideTimer() {
  slideTimer = setInterval(nextSlide, slideInterval);
}

function resetSlideTimer() {
  clearInterval(slideTimer);
  startSlideTimer();
}

// Initialize slider
if (heroSlides.length > 0) {
  startSlideTimer();

  heroArrowNext?.addEventListener('click', () => {
    nextSlide();
    resetSlideTimer();
  });

  heroArrowPrev?.addEventListener('click', () => {
    prevSlide();
    resetSlideTimer();
  });

  heroDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      resetSlideTimer();
    });
  });
}

/* ==========================================
   5. SERVICES TABS
   ========================================== */

const serviceTabs = document.querySelectorAll('.services-tab');
const servicePanels = document.querySelectorAll('.services-panel');

serviceTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const targetTab = tab.dataset.tab;

    // Remove active classes
    serviceTabs.forEach(t => t.classList.remove('active'));
    servicePanels.forEach(p => p.classList.remove('active'));

    // Add active class to clicked tab
    tab.classList.add('active');

    // Show corresponding panel
    const targetPanel = document.getElementById(`panel-${targetTab}`);
    if (targetPanel) {
      targetPanel.classList.add('active');
    }
  });
});

/* ==========================================
   6. SCROLL REVEAL ANIMATIONS
   ========================================== */

const revealElements = document.querySelectorAll(
  '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger'
);

if (revealElements.length > 0) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Optionally unobserve after revealing
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  revealElements.forEach(el => revealObserver.observe(el));
}

/* ==========================================
   7. ANIMATED COUNTERS
   ========================================== */

function animateCounter(element) {
  const target = parseInt(element.dataset.target, 10);
  const suffix = element.dataset.suffix || '';
  const prefix = element.dataset.prefix || '';
  const duration = 2000; // 2 seconds
  const start = performance.now();

  function updateCounter(currentTime) {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function (easeOutCubic)
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);

    element.textContent = prefix + current.toLocaleString('ru-RU') + suffix;

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    }
  }

  requestAnimationFrame(updateCounter);
}

const counters = document.querySelectorAll('[data-target]');

if (counters.length > 0) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(counter => counterObserver.observe(counter));
}

/* ==========================================
   8. REVIEWS CAROUSEL
   ========================================== */

const reviewsTrack = document.getElementById('reviewsTrack');
const reviewsPrev = document.getElementById('reviewsPrev');
const reviewsNext = document.getElementById('reviewsNext');
const reviewCards = document.querySelectorAll('.review-card');

let currentReviewIndex = 0;
let reviewsPerView = 3;

function updateReviewsPerView() {
  if (window.innerWidth <= 768) {
    reviewsPerView = 1;
  } else if (window.innerWidth <= 1024) {
    reviewsPerView = 2;
  } else {
    reviewsPerView = 3;
  }
}

function moveReviewsCarousel(direction) {
  const maxIndex = Math.max(0, reviewCards.length - reviewsPerView);

  if (direction === 'next') {
    currentReviewIndex = Math.min(currentReviewIndex + 1, maxIndex);
  } else {
    currentReviewIndex = Math.max(currentReviewIndex - 1, 0);
  }

  const cardWidth = reviewCards[0].offsetWidth;
  const gap = 32; // 2rem in pixels
  const offset = -(currentReviewIndex * (cardWidth + gap));

  reviewsTrack.style.transform = `translateX(${offset}px)`;
}

if (reviewsTrack) {
  updateReviewsPerView();

  reviewsNext?.addEventListener('click', () => moveReviewsCarousel('next'));
  reviewsPrev?.addEventListener('click', () => moveReviewsCarousel('prev'));

  window.addEventListener('resize', () => {
    updateReviewsPerView();
    currentReviewIndex = 0;
    reviewsTrack.style.transform = 'translateX(0)';
  });
}

/* ==========================================
   9. FAQ ACCORDION
   ========================================== */

const faqQuestions = document.querySelectorAll('.faq__question');

faqQuestions.forEach(question => {
  question.addEventListener('click', () => {
    const isExpanded = question.getAttribute('aria-expanded') === 'true';
    const answer = question.nextElementSibling;

    // Close all other items
    faqQuestions.forEach(q => {
      if (q !== question) {
        q.setAttribute('aria-expanded', 'false');
        q.nextElementSibling.hidden = true;
      }
    });

    // Toggle current item
    question.setAttribute('aria-expanded', !isExpanded);
    answer.hidden = isExpanded;
  });
});

/* ==========================================
   10. CALLBACK FORM HANDLER
   ========================================== */

const callbackForm = document.getElementById('callbackForm');
const callbackBtn = document.getElementById('callbackBtn');

// Open callback modal (scroll to form)
callbackBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  const callbackSection = document.getElementById('callback');
  if (callbackSection) {
    callbackSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
});

// Form submission
if (callbackForm) {
  callbackForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(callbackForm);
    const name = formData.get('name') || '';
    const phone = formData.get('phone') || '';
    const message = formData.get('message') || 'Запрос на обратный звонок';

    // Redirect to WhatsApp
    const whatsappMessage = `Здравствуйте! Меня зовут ${name}.%0AТелефон: ${phone}%0A${message}`;
    const whatsappURL = `https://wa.me/79302908822?text=${whatsappMessage}`;

    window.open(whatsappURL, '_blank');
    callbackForm.reset();
  });
}

/* ==========================================
   11. BACK TO TOP BUTTON
   ========================================== */

const backToTopBtn = document.getElementById('backToTop');

if (backToTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================
   12. SMOOTH SCROLL FOR ANCHOR LINKS
   ========================================== */

const anchorLinks = document.querySelectorAll('a[href^="#"]');

anchorLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');

    // Skip if it's just "#" or empty
    if (!href || href === '#') return;

    const target = document.querySelector(href);

    if (target) {
      e.preventDefault();
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

/* ==========================================
   13. PHONE NUMBER FORMATTING
   ========================================== */

const phoneInputs = document.querySelectorAll('input[type="tel"]');

phoneInputs.forEach(input => {
  input.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits

    if (value.length > 0) {
      if (value[0] === '8') {
        value = '7' + value.slice(1);
      }

      // Format: +7 (XXX) XXX-XX-XX
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

/* ==========================================
   14. LAZY LOAD IMAGES (OPTIONAL)
   ========================================== */

const lazyImages = document.querySelectorAll('img[data-src]');

if (lazyImages.length > 0 && 'IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);

          img.addEventListener('load', () => {
            img.classList.add('loaded');
          });
        }
      });
    },
    { rootMargin: '200px' }
  );

  lazyImages.forEach(img => imageObserver.observe(img));
}

/* ==========================================
   15. PREVENT FORM DOUBLE SUBMISSION
   ========================================== */

const forms = document.querySelectorAll('form');

forms.forEach(form => {
  form.addEventListener('submit', function(e) {
    const submitBtn = this.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      setTimeout(() => {
        submitBtn.disabled = false;
      }, 3000);
    }
  });
});

/* ==========================================
   16. DETECT MOBILE DEVICES
   ========================================== */

function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Add class to body if mobile
if (isMobileDevice()) {
  document.body.classList.add('is-mobile');
}

/* ==========================================
   17. HEADER CALLBACK BUTTON HANDLER
   ========================================== */

// Both header callback button and hero CTA scroll to callback form
const heroCta = document.getElementById('hero-cta');

heroCta?.addEventListener('click', (e) => {
  e.preventDefault();
  const callbackSection = document.getElementById('callback');
  if (callbackSection) {
    callbackSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
});

/* ==========================================
   18. CONSOLE LOG (DEVELOPMENT)
   ========================================== */

console.log('%cGarage Express', 'font-size: 24px; font-weight: bold; color: #D32F2F;');
console.log('%cWebsite loaded successfully!', 'font-size: 14px; color: #1A1A1A;');

/* ==========================================
   19. PERFORMANCE OPTIMIZATION
   ========================================== */

// Debounce function for resize events
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

// Use debounced resize handler
const handleResize = debounce(() => {
  // Any resize-dependent operations
  updateReviewsPerView();
}, 250);

window.addEventListener('resize', handleResize);

/* ==========================================
   20. ANALYTICS TRACKING (PLACEHOLDER)
   ========================================== */

// Track button clicks for analytics
const trackableButtons = document.querySelectorAll('[data-track]');

trackableButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    const trackingData = {
      action: button.dataset.track,
      label: button.textContent.trim(),
      timestamp: new Date().toISOString()
    };

    // In production, send to analytics service:
    // gtag('event', trackingData.action, { ... });
    // or
    // ym(XXXXXX, 'reachGoal', trackingData.action);
  });
});

/* ===================================================================
   VET CLINIC TEMPLATE - INTERACTIVE JAVASCRIPT
   All modern interactivity features
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all features
  initMobileMenu();
  initStickyHeader();
  initScrollAnimations();
  initAnimatedCounters();
  initFAQ();
  initModals();
  initScrollTop();
  initServicesTabs();
  initReviewsCarousel();
});

/* ========== MOBILE MENU ========== */
function initMobileMenu() {
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (!burger || !mobileMenu) return;

  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  // Close on link click
  const mobileLinks = mobileMenu.querySelectorAll('.mobile-menu__link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
      burger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/* ========== STICKY HEADER ========== */
function initStickyHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  }, { passive: true });
}

/* ========== SCROLL ANIMATIONS ========== */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger, [data-animate]'
  );

  if (!revealElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  revealElements.forEach((el) => observer.observe(el));
}

/* ========== ANIMATED COUNTERS ========== */
function initAnimatedCounters() {
  const counters = document.querySelectorAll('[data-target]');
  if (!counters.length) return;

  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const decimals = parseInt(el.dataset.decimals) || 0;
    const duration = 2000;
    const start = performance.now();
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;

      if (decimals > 0) {
        el.textContent = prefix + current.toFixed(decimals) + suffix;
      } else {
        el.textContent = prefix + Math.round(current).toLocaleString('ru-RU') + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
}

/* ========== FAQ ACCORDION ========== */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq__item');
  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const question = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');

    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isOpen = question.getAttribute('aria-expanded') === 'true';

      // Close all other items
      faqItems.forEach((otherItem) => {
        const otherQuestion = otherItem.querySelector('.faq__question');
        const otherAnswer = otherItem.querySelector('.faq__answer');
        if (otherItem !== item) {
          otherQuestion.setAttribute('aria-expanded', 'false');
          otherAnswer.hidden = true;
        }
      });

      // Toggle current item
      question.setAttribute('aria-expanded', !isOpen);
      answer.hidden = isOpen;
    });
  });
}

/* ========== MODALS ========== */
function initModals() {
  // Appointment modal
  const appointmentBtns = document.querySelectorAll('#appointmentBtn, #ctaAppointmentBtn, .service-item__btn');
  const appointmentModal = document.getElementById('appointmentModal');
  const appointmentForm = document.getElementById('appointmentForm');

  if (appointmentBtns.length && appointmentModal) {
    appointmentBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const serviceName = btn.dataset.service || '';
        if (serviceName) {
          const serviceTypeField = appointmentForm.querySelector('#serviceType');
          if (serviceTypeField) {
            serviceTypeField.value = serviceName;
          }
        }
        openModal(appointmentModal);
      });
    });
  }

  // Call modal
  const callBtns = document.querySelectorAll('#emergencyBtn, #floatCallBtn');
  const callModal = document.getElementById('callModal');

  if (callBtns.length && callModal) {
    callBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        openModal(callModal);
      });
    });
  }

  // Close modal handlers
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    const closeBtn = modal.querySelector('.modal__close');
    const overlay = modal.querySelector('.modal__overlay');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => closeModal(modal));
    }

    if (overlay) {
      overlay.addEventListener('click', () => closeModal(modal));
    }
  });

  // Form submissions
  if (appointmentForm) {
    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleFormSubmit(appointmentForm, appointmentModal);
    });
  }

  const callForm = document.getElementById('callForm');
  if (callForm) {
    callForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleFormSubmit(callForm, callModal);
    });
  }

  // Generic .open-modal buttons (used on about/contacts pages)
  const genericModalBtns = document.querySelectorAll('.open-modal[data-modal]');
  genericModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.dataset.modal;
      const targetModal = document.getElementById(modalId);
      if (targetModal) {
        openModal(targetModal);
      }
    });
  });

  // Contact form (contacts page)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());
      console.log('Contact form submitted:', data);
      alert('Спасибо за обращение! Мы ответим вам в ближайшее время.');
      contactForm.reset();
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modals.forEach(modal => {
        if (modal.classList.contains('active')) {
          closeModal(modal);
        }
      });
    }
  });
}

function openModal(modal) {
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function handleFormSubmit(form, modal) {
  // Get form data
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  console.log('Form submitted:', data);

  // TODO: Send to backend
  // For demo purposes, just show success message
  alert('Заявка отправлена! Мы свяжемся с вами в ближайшее время.');

  // Reset form and close modal
  form.reset();
  closeModal(modal);
}

/* ========== SCROLL TO TOP ========== */
function initScrollTop() {
  const scrollTopBtn = document.getElementById('scrollTop');
  if (!scrollTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ========== SERVICES TABS ========== */
function initServicesTabs() {
  const tabs = document.querySelectorAll('.services-tab-main');
  const categories = document.querySelectorAll('.service-category');

  if (!tabs.length || !categories.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetCategory = tab.dataset.category;

      // Remove active from all
      tabs.forEach(t => t.classList.remove('active'));
      categories.forEach(c => c.classList.remove('active'));

      // Add active to clicked
      tab.classList.add('active');
      const targetElement = document.querySelector(`[data-category="${targetCategory}"].service-category`);
      if (targetElement) {
        targetElement.classList.add('active');
      }
    });
  });

  // Handle hash navigation
  const hash = window.location.hash.substring(1);
  if (hash) {
    const targetTab = document.querySelector(`[data-category="${hash}"]`);
    if (targetTab) {
      targetTab.click();
    }
  }
}

/* ========== REVIEWS CAROUSEL ========== */
function initReviewsCarousel() {
  const carousel = document.querySelector('.reviews-carousel');
  if (!carousel) return;

  const track = carousel.querySelector('.reviews-carousel__track');
  const prevBtn = carousel.querySelector('.reviews-carousel__btn--prev');
  const nextBtn = carousel.querySelector('.reviews-carousel__btn--next');
  const dotsContainer = carousel.querySelector('.reviews-carousel__dots');
  const slides = track.querySelectorAll('.review-card');

  if (!track || !slides.length) return;

  let currentIndex = 0;
  const totalSlides = slides.length;

  // Create dots
  if (dotsContainer) {
    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = 'reviews-carousel__dot';
      if (index === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Отзыв ${index + 1}`);
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });
  }

  function updateCarousel() {
    const offset = -currentIndex * 100;
    track.style.transform = `translateX(${offset}%)`;

    // Update dots
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.reviews-carousel__dot');
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    }
  }

  function goToSlide(index) {
    currentIndex = Math.max(0, Math.min(index, totalSlides - 1));
    updateCarousel();
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateCarousel();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateCarousel();
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', prevSlide);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', nextSlide);
  }

  // Auto-advance every 8 seconds
  let autoplayInterval = setInterval(nextSlide, 8000);

  // Pause on hover
  carousel.addEventListener('mouseenter', () => {
    clearInterval(autoplayInterval);
  });

  carousel.addEventListener('mouseleave', () => {
    autoplayInterval = setInterval(nextSlide, 8000);
  });

  // Touch/swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swiped left - next slide
        nextSlide();
      } else {
        // Swiped right - previous slide
        prevSlide();
      }
    }
  }
}

/* ========== SMOOTH SCROLL FOR ANCHOR LINKS ========== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');

    // Skip if href is just "#" or modal trigger
    if (href === '#' || this.hasAttribute('data-modal')) {
      return;
    }

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();

      // Close mobile menu if open
      const burger = document.getElementById('burger');
      const mobileMenu = document.getElementById('mobileMenu');
      if (burger && mobileMenu) {
        burger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      }

      // Smooth scroll to target
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

/* ========== LAZY LOADING IMAGES ========== */
if ('IntersectionObserver' in window) {
  const lazyImages = document.querySelectorAll('img[data-src]');

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        img.classList.add('loaded');
        imageObserver.unobserve(img);
      }
    });
  }, {
    rootMargin: '200px'
  });

  lazyImages.forEach((img) => imageObserver.observe(img));
}

/* ========== PREVENT ANIMATION ON PAGE LOAD ========== */
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});

/* ========== HANDLE FORM PHONE INPUT FORMATTING ========== */
document.querySelectorAll('input[type="tel"]').forEach(input => {
  input.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');

    if (value.length > 0) {
      if (value[0] === '8') {
        value = '7' + value.substring(1);
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

/* ========== CONSOLE BRANDING ========== */
console.log('%cВетеринарная клиника', 'font-size: 24px; font-weight: bold; color: #0d9488;');
console.log('%cСделано с помощью Claude Code', 'font-size: 12px; color: #6b7280;');

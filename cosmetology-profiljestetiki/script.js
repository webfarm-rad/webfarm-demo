/**
 * ПРОФИЛЬ ЭСТЕТИКИ - Main JavaScript
 * Features: Smooth scroll, lazy loading, lightbox, image comparison slider,
 * carousel, tabs, accordion, form validation, animated counters, sticky header
 */

// ===== UTILITY FUNCTIONS =====
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// ===== STICKY HEADER =====
class StickyHeader {
  constructor() {
    this.header = document.getElementById('header');
    this.scrollThreshold = 100;
    this.init();
  }

  init() {
    if (!this.header) return;
    window.addEventListener('scroll', throttle(() => this.handleScroll(), 100));
    this.handleScroll();
  }

  handleScroll() {
    if (window.scrollY > this.scrollThreshold) {
      this.header.classList.add('scrolled');
    } else {
      this.header.classList.remove('scrolled');
    }
  }
}

// ===== MOBILE NAVIGATION =====
class MobileNav {
  constructor() {
    this.navToggle = document.getElementById('navToggle');
    this.nav = document.getElementById('nav');
    this.navBackdrop = document.getElementById('navBackdrop');
    this.navLinks = document.querySelectorAll('.nav__link');
    this.init();
  }

  init() {
    if (!this.navToggle || !this.nav) return;

    this.navToggle.addEventListener('click', () => this.toggle());

    if (this.navBackdrop) {
      this.navBackdrop.addEventListener('click', () => this.close());
    }

    this.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        // Don't close menu when clicking dropdown trigger on mobile
        const isDropdownTrigger = link.parentElement && link.parentElement.classList.contains('nav__item--dropdown');
        if (isDropdownTrigger && window.innerWidth <= 768) return;
        this.close();
      });
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.nav.classList.contains('active')) {
        this.close();
      }
    });
  }

  toggle() {
    const isActive = this.nav.classList.contains('active');
    if (isActive) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.nav.classList.add('active');
    this.navToggle.classList.add('active');
    if (this.navBackdrop) {
      this.navBackdrop.classList.add('active');
    }
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.nav.classList.remove('active');
    this.navToggle.classList.remove('active');
    if (this.navBackdrop) {
      this.navBackdrop.classList.remove('active');
    }
    document.body.style.overflow = '';
  }
}

// ===== DROPDOWN MENU =====
class DropdownMenu {
  constructor() {
    this.dropdownItems = document.querySelectorAll('.nav__item--dropdown');
    this.init();
  }

  init() {
    if (this.dropdownItems.length === 0) return;

    // For mobile: toggle dropdown on click (check width dynamically)
    this.dropdownItems.forEach(item => {
      const link = item.querySelector('.nav__link');

      if (link) {
        link.addEventListener('click', (e) => {
          if (window.innerWidth <= 768) {
            e.preventDefault();
            e.stopImmediatePropagation();

            // Close all other dropdowns
            this.dropdownItems.forEach(otherItem => {
              if (otherItem !== item) {
                otherItem.classList.remove('active');
              }
            });

            // Toggle current dropdown
            item.classList.toggle('active');
          }
        });
      }
    });

    // Re-init on resize
    window.addEventListener('resize', debounce(() => {
      if (window.innerWidth > 768) {
        this.dropdownItems.forEach(item => {
          item.classList.remove('active');
        });
      }
    }, 250));
  }
}

// ===== SMOOTH SCROLL =====
class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
          const headerHeight = document.getElementById('header')?.offsetHeight || 0;
          const targetPosition = target.offsetTop - headerHeight - 20;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }
}

// ===== LAZY LOADING IMAGES =====
class LazyLoader {
  constructor() {
    this.images = document.querySelectorAll('img[loading="lazy"]');
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
            }
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px'
      });

      this.images.forEach(img => imageObserver.observe(img));
    }
  }
}

// ===== BEFORE/AFTER IMAGE COMPARISON SLIDER =====
class BeforeAfterSlider {
  constructor() {
    this.items = document.querySelectorAll('.before-after-item');
    this.init();
  }

  init() {
    this.items.forEach(item => {
      const slider = item.querySelector('.before-after-item__slider');
      const afterImage = item.querySelector('.before-after-item__image--after');
      const container = item.querySelector('.before-after-item__container');

      if (!slider || !afterImage || !container) return;

      let isSliding = false;

      const slide = (e) => {
        if (!isSliding) return;

        const rect = container.getBoundingClientRect();
        let x;

        if (e.type.includes('touch')) {
          x = e.touches[0].clientX - rect.left;
        } else {
          x = e.clientX - rect.left;
        }

        const position = Math.max(0, Math.min(x, rect.width));
        const percentage = (position / rect.width) * 100;

        slider.style.left = `${percentage}%`;
        afterImage.style.clipPath = `inset(0 0 0 ${percentage}%)`;
      };

      // Mouse events
      slider.addEventListener('mousedown', () => {
        isSliding = true;
        container.style.cursor = 'ew-resize';
      });

      document.addEventListener('mouseup', () => {
        if (isSliding) {
          isSliding = false;
          container.style.cursor = '';
        }
      });

      container.addEventListener('mousemove', slide);

      // Touch events
      slider.addEventListener('touchstart', (e) => {
        isSliding = true;
        e.preventDefault();
      });

      document.addEventListener('touchend', () => {
        isSliding = false;
      });

      container.addEventListener('touchmove', (e) => {
        slide(e);
        e.preventDefault();
      });

      // Click to move
      container.addEventListener('click', (e) => {
        if (e.target === slider) return;

        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = (x / rect.width) * 100;

        slider.style.left = `${percentage}%`;
        afterImage.style.clipPath = `inset(0 0 0 ${percentage}%)`;
      });
    });
  }
}

// ===== REVIEWS CAROUSEL =====
class ReviewsCarousel {
  constructor() {
    this.track = document.getElementById('reviewsTrack');
    this.prevBtn = document.getElementById('reviewsPrev');
    this.nextBtn = document.getElementById('reviewsNext');
    this.dotsContainer = document.getElementById('reviewsDots');

    if (!this.track) return;

    this.cards = Array.from(this.track.children);
    this.currentIndex = 0;
    this.autoplayInterval = null;
    this.autoplayDelay = 5000;
    this.init();
  }

  init() {
    if (this.cards.length === 0) return;

    this.createDots();
    this.updateCarousel();
    this.attachEvents();
    this.startAutoplay();
  }

  createDots() {
    if (!this.dotsContainer) return;

    this.dotsContainer.innerHTML = '';
    this.cards.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('reviews-carousel__dot');
      dot.setAttribute('aria-label', `Перейти к отзыву ${index + 1}`);
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => this.goToSlide(index));
      this.dotsContainer.appendChild(dot);
    });
  }

  updateCarousel() {
    const cardWidth = this.cards[0].offsetWidth;
    const gap = 32; // 2rem gap
    const offset = -(this.currentIndex * (cardWidth + gap));

    this.track.style.transform = `translateX(${offset}px)`;

    // Update dots
    if (this.dotsContainer) {
      const dots = this.dotsContainer.querySelectorAll('.reviews-carousel__dot');
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === this.currentIndex);
      });
    }
  }

  goToSlide(index) {
    this.currentIndex = index;
    this.updateCarousel();
    this.resetAutoplay();
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.cards.length;
    this.updateCarousel();
    this.resetAutoplay();
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.cards.length) % this.cards.length;
    this.updateCarousel();
    this.resetAutoplay();
  }

  attachEvents() {
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.next());
    }

    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prev());
    }

    // Swipe support
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    this.track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      this.stopAutoplay();
    });

    this.track.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;
    });

    this.track.addEventListener('touchend', () => {
      if (!isDragging) return;

      const diff = startX - currentX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          this.next();
        } else {
          this.prev();
        }
      }

      isDragging = false;
      this.startAutoplay();
    });

    // Pause autoplay on hover
    this.track.addEventListener('mouseenter', () => this.stopAutoplay());
    this.track.addEventListener('mouseleave', () => this.startAutoplay());

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
    });

    // Update on resize
    window.addEventListener('resize', debounce(() => this.updateCarousel(), 250));
  }

  startAutoplay() {
    this.stopAutoplay();
    this.autoplayInterval = setInterval(() => this.next(), this.autoplayDelay);
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  resetAutoplay() {
    this.stopAutoplay();
    this.startAutoplay();
  }
}

// ===== FAQ ACCORDION =====
class Accordion {
  constructor() {
    this.items = document.querySelectorAll('.faq-item');
    this.init();
  }

  init() {
    this.items.forEach(item => {
      const question = item.querySelector('.faq-item__question');

      if (!question) return;

      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all items
        this.items.forEach(i => i.classList.remove('active'));

        // Open clicked item if it wasn't active
        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
  }
}

// ===== TABS =====
class Tabs {
  constructor() {
    this.tabContainers = document.querySelectorAll('.tabs');
    this.init();
  }

  init() {
    this.tabContainers.forEach(container => {
      const buttons = container.querySelectorAll('.tabs__btn');
      const contents = container.querySelectorAll('.tabs__content');

      buttons.forEach((button, index) => {
        button.addEventListener('click', () => {
          // Remove active from all
          buttons.forEach(btn => btn.classList.remove('active'));
          contents.forEach(content => content.classList.remove('active'));

          // Add active to clicked
          button.classList.add('active');
          if (contents[index]) {
            contents[index].classList.add('active');
          }
        });
      });
    });
  }
}

// ===== ANIMATED COUNTERS =====
class AnimatedCounters {
  constructor() {
    this.counters = document.querySelectorAll('[data-count]');
    this.animated = new Set();
    this.init();
  }

  init() {
    if (this.counters.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.animated.has(entry.target)) {
          this.animateCounter(entry.target);
          this.animated.add(entry.target);
        }
      });
    }, { threshold: 0.5 });

    this.counters.forEach(counter => observer.observe(counter));
  }

  animateCounter(element) {
    const target = parseInt(element.dataset.count);
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;

      if (current >= target) {
        element.textContent = target.toLocaleString('ru-RU');
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current).toLocaleString('ru-RU');
      }
    }, stepDuration);
  }
}

// ===== LIGHTBOX GALLERY =====
class Lightbox {
  constructor() {
    this.lightbox = null;
    this.images = [];
    this.currentIndex = 0;
    this.init();
  }

  init() {
    // Create lightbox element
    this.createLightbox();

    // Add click handlers to gallery images
    document.querySelectorAll('.before-after-item, .certificate-card').forEach((item, index) => {
      const img = item.querySelector('img');
      if (!img) return;

      this.images.push(img.src);

      item.addEventListener('click', () => {
        this.currentIndex = index;
        this.open();
      });
    });
  }

  createLightbox() {
    this.lightbox = document.createElement('div');
    this.lightbox.className = 'lightbox';
    this.lightbox.innerHTML = `
      <div class="lightbox__content">
        <img src="" alt="" class="lightbox__image">
        <button class="lightbox__close" aria-label="Закрыть">&times;</button>
        <button class="lightbox__nav lightbox__nav--prev" aria-label="Предыдущее">
          <i class="fas fa-chevron-left"></i>
        </button>
        <button class="lightbox__nav lightbox__nav--next" aria-label="Следующее">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    `;

    document.body.appendChild(this.lightbox);

    // Event listeners
    this.lightbox.querySelector('.lightbox__close').addEventListener('click', () => this.close());
    this.lightbox.querySelector('.lightbox__nav--prev').addEventListener('click', () => this.prev());
    this.lightbox.querySelector('.lightbox__nav--next').addEventListener('click', () => this.next());

    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox) this.close();
    });

    document.addEventListener('keydown', (e) => {
      if (!this.lightbox.classList.contains('active')) return;

      if (e.key === 'Escape') this.close();
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
    });
  }

  open() {
    this.updateImage();
    this.lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.updateImage();
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.updateImage();
  }

  updateImage() {
    const img = this.lightbox.querySelector('.lightbox__image');
    img.src = this.images[this.currentIndex];
  }
}

// ===== FORM VALIDATION =====
class FormValidator {
  constructor() {
    this.forms = document.querySelectorAll('.contact-form');
    this.init();
  }

  init() {
    this.forms.forEach(form => {
      form.addEventListener('submit', (e) => this.handleSubmit(e));

      // Real-time validation
      const inputs = form.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        input.addEventListener('blur', () => this.validateField(input));
        input.addEventListener('input', () => {
          if (input.parentElement.classList.contains('error')) {
            this.validateField(input);
          }
        });
      });
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    let isValid = true;

    // Validate all fields
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    if (isValid) {
      this.submitForm(form);
    }
  }

  validateField(input) {
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup?.querySelector('.form-error');

    if (!formGroup) return true;

    let isValid = true;
    let errorMessage = '';

    // Required check
    if (input.hasAttribute('required') && !input.value.trim()) {
      isValid = false;
      errorMessage = 'Это поле обязательно для заполнения';
    }

    // Email validation
    if (input.type === 'email' && input.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value)) {
        isValid = false;
        errorMessage = 'Введите корректный email';
      }
    }

    // Phone validation
    if (input.type === 'tel' && input.value) {
      const phoneRegex = /^[\d\s\+\-\(\)]+$/;
      if (!phoneRegex.test(input.value) || input.value.replace(/\D/g, '').length < 10) {
        isValid = false;
        errorMessage = 'Введите корректный номер телефона';
      }
    }

    // Update UI
    if (isValid) {
      formGroup.classList.remove('error');
    } else {
      formGroup.classList.add('error');
      if (errorElement) {
        errorElement.textContent = errorMessage;
      }
    }

    return isValid;
  }

  async submitForm(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Create WhatsApp message
    const message = this.createWhatsAppMessage(data);
    const phone = '79180814368';
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    // Show success message
    const successElement = form.querySelector('.form-success');
    if (successElement) {
      successElement.classList.add('show');
      setTimeout(() => {
        successElement.classList.remove('show');
      }, 5000);
    }

    // Reset form
    form.reset();

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
  }

  createWhatsAppMessage(data) {
    let message = '🏥 *Новая заявка с сайта*\n\n';

    if (data.name) message += `👤 Имя: ${data.name}\n`;
    if (data.phone) message += `📱 Телефон: ${data.phone}\n`;
    if (data.email) message += `📧 Email: ${data.email}\n`;
    if (data.service) message += `💉 Услуга: ${data.service}\n`;
    if (data.message) message += `\n💬 Сообщение:\n${data.message}\n`;

    return message;
  }
}

// ===== CONSULTATION MODAL =====
function openConsultationModal() {
  // Create simple modal
  const modal = document.createElement('div');
  modal.className = 'lightbox active';
  modal.style.zIndex = '99999';
  modal.innerHTML = `
    <div class="lightbox__content" style="max-width: 500px; background: white; padding: 3rem; border-radius: 12px;">
      <button class="lightbox__close" style="color: #2C2C2C;" aria-label="Закрыть">&times;</button>

      <h3 style="font-size: 1.75rem; margin-bottom: 1rem; color: #2C2C2C; text-align: center;">
        Записаться на консультацию
      </h3>
      <p style="color: #7A7A7A; text-align: center; margin-bottom: 2rem;">
        Заполните форму, и мы свяжемся с вами в ближайшее время
      </p>

      <form class="contact-form" id="consultationForm">
        <div class="form-group">
          <label for="modalName">Ваше имя *</label>
          <input type="text" id="modalName" name="name" required>
          <p class="form-error"></p>
        </div>

        <div class="form-group">
          <label for="modalPhone">Телефон *</label>
          <input type="tel" id="modalPhone" name="phone" placeholder="+7 (___) ___-__-__" required>
          <p class="form-error"></p>
        </div>

        <div class="form-group">
          <label for="modalService">Интересующая услуга</label>
          <select id="modalService" name="service">
            <option value="">Выберите услугу</option>
            <option value="Контурная пластика">Контурная пластика</option>
            <option value="Биоревитализация">Биоревитализация</option>
            <option value="Коллагенотерапия">Коллагенотерапия</option>
            <option value="Ботулинотерапия">Ботулинотерапия</option>
            <option value="Эстетическая косметология">Эстетическая косметология</option>
            <option value="Пилинги">Пилинги</option>
            <option value="Мезотерапия волос">Мезотерапия волос</option>
            <option value="Плазмотерапия">Плазмотерапия</option>
            <option value="Другие процедуры">Другие процедуры</option>
            <option value="Консультация">Общая консультация</option>
          </select>
        </div>

        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">
          <i class="fas fa-paper-plane"></i>
          <span>Отправить заявку</span>
        </button>

        <p style="font-size: 0.75rem; color: #7A7A7A; text-align: center; margin-top: 1rem;">
          Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
        </p>

        <div class="form-success">
          <i class="fas fa-check-circle" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
          <p>Заявка отправлена! Мы свяжемся с вами в ближайшее время.</p>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';

  // Close handlers
  const closeBtn = modal.querySelector('.lightbox__close');
  closeBtn.addEventListener('click', () => {
    modal.remove();
    document.body.style.overflow = '';
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
      document.body.style.overflow = '';
    }
  });

  // Initialize form validation for this modal
  new FormValidator();

  // Phone mask
  const phoneInput = modal.querySelector('#modalPhone');
  phoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');

    if (value.length > 0) {
      if (value[0] === '7' || value[0] === '8') {
        value = value.substring(1);
      }

      let formatted = '+7';
      if (value.length > 0) formatted += ` (${value.substring(0, 3)}`;
      if (value.length >= 4) formatted += `) ${value.substring(3, 6)}`;
      if (value.length >= 7) formatted += `-${value.substring(6, 8)}`;
      if (value.length >= 9) formatted += `-${value.substring(8, 10)}`;

      e.target.value = formatted;
    }
  });
}

// ===== ACTIVE NAV LINK =====
class ActiveNavLink {
  constructor() {
    this.init();
  }

  init() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav__link');

    navLinks.forEach(link => {
      const linkPath = new URL(link.href).pathname;

      if (currentPath === linkPath || (currentPath === '/' && linkPath.includes('index.html'))) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

// ===== PAGE TRANSITIONS =====
class PageTransitions {
  constructor() {
    this.init();
  }

  init() {
    // Fade in on load
    document.body.style.opacity = '0';
    window.addEventListener('load', () => {
      document.body.style.transition = 'opacity 0.5s ease';
      document.body.style.opacity = '1';
    });

    // Smooth transitions between pages
    document.querySelectorAll('a').forEach(link => {
      // Only internal links
      if (link.hostname === window.location.hostname && !link.getAttribute('href')?.startsWith('#')) {
        link.addEventListener('click', (e) => {
          const target = link.getAttribute('href');
          if (target && !link.hasAttribute('target')) {
            e.preventDefault();
            document.body.style.opacity = '0';
            setTimeout(() => {
              window.location.href = target;
            }, 300);
          }
        });
      }
    });
  }
}

// ===== SCROLL ANIMATIONS =====
class ScrollAnimations {
  constructor() {
    this.elements = document.querySelectorAll('.service-card, .doctor-card, .price-card, .about-split__feature');
    this.init();
  }

  init() {
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
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
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    this.elements.forEach(el => observer.observe(el));
  }
}

// ===== INITIALIZE ALL =====
document.addEventListener('DOMContentLoaded', () => {
  // Core functionality
  new StickyHeader();
  new MobileNav();
  new DropdownMenu();
  new SmoothScroll();
  new LazyLoader();

  // Components
  new BeforeAfterSlider();
  new ReviewsCarousel();
  new Accordion();
  new Tabs();
  new AnimatedCounters();
  new Lightbox();
  new FormValidator();

  // Enhancements
  new ActiveNavLink();
  new PageTransitions();
  new ScrollAnimations();
});

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
  console.error('Application error:', e.error);
});

// ===== EXPORT FOR TESTING =====
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    StickyHeader,
    MobileNav,
    ReviewsCarousel,
    Accordion,
    FormValidator
  };
}
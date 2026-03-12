/* ================================================
   САЛКАЗАНТИ — main.js
   Mobile menu, sticky header, scroll animations,
   testimonials slider, FAQ accordion, lightbox,
   counters, back-to-top, callback modal
   ================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ------------------------------------------------
     1. MOBILE MENU
     ------------------------------------------------ */
  var header = document.querySelector('.site-header');
  var menuToggle = document.querySelector('.menu-toggle');
  var body = document.body;

  if (menuToggle && header) {
    menuToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = header.classList.toggle('nav-open');
      menuToggle.classList.toggle('active');
      body.classList.toggle('menu-open', isOpen);
    });

    // Close on nav link click
    document.querySelectorAll('.site-header__nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        header.classList.remove('nav-open');
        menuToggle.classList.remove('active');
        body.classList.remove('menu-open');
      });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (header.classList.contains('nav-open') && !header.contains(e.target)) {
        header.classList.remove('nav-open');
        menuToggle.classList.remove('active');
        body.classList.remove('menu-open');
      }
    });
  }

  /* ------------------------------------------------
     2. STICKY HEADER
     ------------------------------------------------ */
  if (header) {
    var lastScroll = 0;
    window.addEventListener('scroll', function () {
      var scrollY = window.scrollY;
      if (scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      lastScroll = scrollY;
    }, { passive: true });
  }

  /* ------------------------------------------------
     3. SCROLL ANIMATIONS (IntersectionObserver)
     ------------------------------------------------ */
  var animatedEls = document.querySelectorAll(
    '.fade-in, .slide-up, .slide-left, .slide-right, .scale-in, .stagger-children'
  );

  if (animatedEls.length > 0 && 'IntersectionObserver' in window) {
    var scrollObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          scrollObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    animatedEls.forEach(function (el) {
      scrollObserver.observe(el);
    });
  }

  /* ------------------------------------------------
     4. SMOOTH SCROLL for anchor links
     ------------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '#!') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var headerH = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--header-height')) || 80;
        var top = target.getBoundingClientRect().top + window.scrollY - headerH;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ------------------------------------------------
     5. ACTIVE NAV HIGHLIGHT
     ------------------------------------------------ */
  var currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.site-header__nav-link').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ------------------------------------------------
     6. TESTIMONIALS SLIDER
     ------------------------------------------------ */
  var sliderTrack = document.querySelector('.testimonials-slider__track');
  var slides = document.querySelectorAll('.testimonials-slider__slide');
  var prevBtn = document.querySelector('.slider-btn--prev');
  var nextBtn = document.querySelector('.slider-btn--next');
  var dotsContainer = document.querySelector('.slider-dots');
  var currentSlide = 0;
  var slideCount = slides.length;
  var autoPlayTimer = null;
  var touchStartX = 0;
  var touchEndX = 0;

  function goToSlide(index) {
    if (index < 0) index = slideCount - 1;
    if (index >= slideCount) index = 0;
    currentSlide = index;
    if (sliderTrack) {
      sliderTrack.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
    }
    updateDots();
  }

  function updateDots() {
    if (!dotsContainer) return;
    var dots = dotsContainer.querySelectorAll('.slider-dot');
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  function startAutoPlay() {
    stopAutoPlay();
    autoPlayTimer = setInterval(function () {
      goToSlide(currentSlide + 1);
    }, 5000);
  }

  function stopAutoPlay() {
    if (autoPlayTimer) clearInterval(autoPlayTimer);
  }

  if (slideCount > 0 && sliderTrack) {
    // Create dots
    if (dotsContainer) {
      for (var i = 0; i < slideCount; i++) {
        var dot = document.createElement('button');
        dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Отзыв ' + (i + 1));
        dot.dataset.index = i;
        dot.addEventListener('click', function () {
          goToSlide(parseInt(this.dataset.index));
          startAutoPlay();
        });
        dotsContainer.appendChild(dot);
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        goToSlide(currentSlide - 1);
        startAutoPlay();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        goToSlide(currentSlide + 1);
        startAutoPlay();
      });
    }

    // Touch swipe
    if (sliderTrack) {
      sliderTrack.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      sliderTrack.addEventListener('touchend', function (e) {
        touchEndX = e.changedTouches[0].screenX;
        var diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
          if (diff > 0) goToSlide(currentSlide + 1);
          else goToSlide(currentSlide - 1);
          startAutoPlay();
        }
      }, { passive: true });
    }

    startAutoPlay();
  }

  /* ------------------------------------------------
     7. ANIMATED COUNTERS
     ------------------------------------------------ */
  var counters = document.querySelectorAll('[data-target]');

  function animateCounter(el) {
    var target = parseInt(el.dataset.target, 10);
    var duration = 2000;
    var start = performance.now();
    var suffix = el.dataset.suffix || '';
    var prefix = el.dataset.prefix || '';

    function update(now) {
      var elapsed = now - start;
      var progress = Math.min(elapsed / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(eased * target);
      el.textContent = prefix + current.toLocaleString('ru-RU') + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  if (counters.length > 0 && 'IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (c) {
      counterObserver.observe(c);
    });
  }

  /* ------------------------------------------------
     8. FAQ ACCORDION
     ------------------------------------------------ */
  var faqItems = document.querySelectorAll('.faq__item');
  faqItems.forEach(function (item) {
    var question = item.querySelector('.faq__question');
    var answer = item.querySelector('.faq__answer');
    if (!question || !answer) return;

    question.addEventListener('click', function () {
      var isActive = item.classList.contains('active');

      // Close all others
      faqItems.forEach(function (other) {
        if (other !== item) {
          other.classList.remove('active');
          var otherAnswer = other.querySelector('.faq__answer');
          if (otherAnswer) otherAnswer.style.maxHeight = '0';
        }
      });

      // Toggle current
      item.classList.toggle('active');
      if (!isActive) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        answer.style.maxHeight = '0';
      }
    });
  });

  /* ------------------------------------------------
     9. GALLERY LIGHTBOX
     ------------------------------------------------ */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = lightbox ? lightbox.querySelector('.lightbox__img') : null;
  var lightboxClose = lightbox ? lightbox.querySelector('.lightbox__close') : null;
  var lightboxPrev = lightbox ? lightbox.querySelector('.lightbox__nav--prev') : null;
  var lightboxNext = lightbox ? lightbox.querySelector('.lightbox__nav--next') : null;
  var galleryItems = document.querySelectorAll('.gallery-item[data-full]');
  var lightboxIndex = 0;

  function openLightbox(index) {
    if (!lightbox || !lightboxImg || !galleryItems.length) return;
    lightboxIndex = index;
    lightboxImg.src = galleryItems[index].dataset.full;
    lightboxImg.alt = galleryItems[index].querySelector('img')
      ? galleryItems[index].querySelector('img').alt
      : '';
    lightbox.classList.add('active');
    body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    body.style.overflow = '';
  }

  galleryItems.forEach(function (item, i) {
    item.addEventListener('click', function () {
      openLightbox(i);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }
  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', function (e) {
      e.stopPropagation();
      var newIndex = lightboxIndex - 1;
      if (newIndex < 0) newIndex = galleryItems.length - 1;
      openLightbox(newIndex);
    });
  }
  if (lightboxNext) {
    lightboxNext.addEventListener('click', function (e) {
      e.stopPropagation();
      var newIndex = lightboxIndex + 1;
      if (newIndex >= galleryItems.length) newIndex = 0;
      openLightbox(newIndex);
    });
  }

  document.addEventListener('keydown', function (e) {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft' && lightboxPrev) lightboxPrev.click();
    if (e.key === 'ArrowRight' && lightboxNext) lightboxNext.click();
  });

  /* ------------------------------------------------
     10. BACK TO TOP BUTTON
     ------------------------------------------------ */
  var backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ------------------------------------------------
     11. CALLBACK MODAL
     ------------------------------------------------ */
  var modalOverlay = document.getElementById('callbackModal');
  var modalOpenBtns = document.querySelectorAll('[data-modal="callback"]');
  var modalCloseBtn = modalOverlay ? modalOverlay.querySelector('.modal__close') : null;

  function openModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.add('active');
    body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    body.style.overflow = '';
  }

  modalOpenBtns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      openModal();
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

  if (modalOverlay) {
    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) closeModal();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  // Handle callback modal form → WhatsApp
  var modalForm = modalOverlay ? modalOverlay.querySelector('form') : null;
  if (modalForm) {
    modalForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = modalForm.querySelector('#callbackName').value;
      var phone = modalForm.querySelector('#callbackPhone').value;
      var text = encodeURIComponent('Здравствуйте! Меня зовут ' + name + '. Мой телефон: ' + phone + '. Перезвоните, пожалуйста.');
      window.open('https://wa.me/79189533645?text=' + text, '_blank');
      closeModal();
      modalForm.reset();
    });
  }

  // Handle contact form → WhatsApp (contacts page)
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = (document.getElementById('name') || {}).value || '';
      var phone = (document.getElementById('phone') || {}).value || '';
      var message = (document.getElementById('message') || {}).value || '';
      var text = encodeURIComponent(
        'Здравствуйте! Меня зовут ' + name + '.\n' +
        'Телефон: ' + phone + '.\n' +
        (message ? 'Сообщение: ' + message : '')
      );
      window.open('https://wa.me/79189533645?text=' + text, '_blank');
      contactForm.reset();
    });
  }

  /* ------------------------------------------------
     12. BEFORE/AFTER SLIDERS (multiple)
     ------------------------------------------------ */
  var baSliders = document.querySelectorAll('.before-after--slider');
  var activeDrag = null;

  function updateSlider(container, x) {
    var rect = container.getBoundingClientRect();
    var pos = (x - rect.left) / rect.width;
    pos = Math.max(0.05, Math.min(0.95, pos));
    var pct = pos * 100;
    var baBefore = container.querySelector('.before-after__img--before');
    var baHandle = container.querySelector('.before-after__handle');
    if (baBefore) baBefore.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
    if (baHandle) baHandle.style.left = pct + '%';
  }

  baSliders.forEach(function (slider) {
    slider.addEventListener('mousedown', function (e) {
      activeDrag = slider;
      updateSlider(slider, e.clientX);
    });
    slider.addEventListener('touchstart', function (e) {
      activeDrag = slider;
      updateSlider(slider, e.touches[0].clientX);
    }, { passive: true });
  });

  document.addEventListener('mousemove', function (e) {
    if (!activeDrag) return;
    e.preventDefault();
    updateSlider(activeDrag, e.clientX);
  });
  document.addEventListener('mouseup', function () {
    activeDrag = null;
  });
  document.addEventListener('touchmove', function (e) {
    if (!activeDrag) return;
    updateSlider(activeDrag, e.touches[0].clientX);
  }, { passive: false });
  document.addEventListener('touchend', function () {
    activeDrag = null;
  });

  /* ------------------------------------------------
     13. PARALLAX SCROLL
     ------------------------------------------------ */
  var parallaxEls = document.querySelectorAll('.parallax-bg');
  if (parallaxEls.length > 0) {
    window.addEventListener('scroll', function () {
      var scrollY = window.scrollY;
      parallaxEls.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        var speed = parseFloat(el.dataset.speed) || 0.3;
        var offset = (rect.top + scrollY - window.innerHeight / 2) * speed;
        el.style.setProperty('--parallax-offset', offset + 'px');
      });
    }, { passive: true });
  }

  /* ------------------------------------------------
     14. 3D TILT ON SERVICE CARDS
     ------------------------------------------------ */
  var tiltCards = document.querySelectorAll('.service-card');
  tiltCards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = 'perspective(800px) rotateX(' + (-y * 6) + 'deg) rotateY(' + (x * 6) + 'deg) translateY(-4px)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });

  /* ------------------------------------------------
     15. PORTFOLIO FILTER
     ------------------------------------------------ */
  var filterTabs = document.querySelectorAll('.filter-tab[data-filter]');
  var portfolioGrid = document.getElementById('portfolioGrid');

  if (filterTabs.length > 0 && portfolioGrid) {
    var gridItems = portfolioGrid.querySelectorAll('.gallery-item[data-category]');

    filterTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        // Update active tab
        filterTabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');

        var filter = tab.dataset.filter;

        gridItems.forEach(function (item) {
          if (filter === 'all' || item.dataset.category === filter) {
            item.classList.remove('hidden');
          } else {
            item.classList.add('hidden');
          }
        });
      });
    });
  }

  /* ------------------------------------------------
     16. PHONE INPUT MASK (+7 (___) ___-__-__)
     ------------------------------------------------ */
  var phoneInputs = document.querySelectorAll('input[type="tel"]');
  phoneInputs.forEach(function (input) {
    input.addEventListener('input', function (e) {
      var val = input.value.replace(/\D/g, '');
      if (val.length === 0) { input.value = ''; return; }
      if (val[0] === '8') val = '7' + val.slice(1);
      if (val[0] !== '7') val = '7' + val;
      var formatted = '+7';
      if (val.length > 1) formatted += ' (' + val.slice(1, 4);
      if (val.length > 4) formatted += ') ' + val.slice(4, 7);
      if (val.length > 7) formatted += '-' + val.slice(7, 9);
      if (val.length > 9) formatted += '-' + val.slice(9, 11);
      input.value = formatted;
    });

    input.addEventListener('focus', function () {
      if (!input.value) input.value = '+7 (';
    });

    input.addEventListener('blur', function () {
      if (input.value === '+7 (' || input.value === '+7') input.value = '';
    });
  });

});

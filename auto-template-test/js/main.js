/* ==========================================================================
   AUTO SERVICE TEMPLATE — JavaScript
   IIFE, no global pollution
   ========================================================================== */
(function () {
  'use strict';

  /* ---- DOM refs ---- */
  var header   = document.getElementById('header');
  var burger   = document.getElementById('burger');
  var body     = document.body;
  var backBtn  = document.getElementById('back-to-top');
  var modalOverlay = document.getElementById('modal-callback');
  var modalForm    = document.getElementById('callback-form');

  /* ==========================================================================
     1. Sticky Header — add class after 50px scroll
     ========================================================================== */
  var lastScroll = 0;

  function handleScroll() {
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;

    /* header background */
    if (scrollY > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }

    /* back-to-top visibility */
    if (scrollY > 500) {
      backBtn.classList.add('back-to-top--visible');
    } else {
      backBtn.classList.remove('back-to-top--visible');
    }

    lastScroll = scrollY;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); /* initial check */

  /* ==========================================================================
     2. Mobile burger menu
     ========================================================================== */
  burger.addEventListener('click', function () {
    body.classList.toggle('menu-open');
  });

  /* ==========================================================================
     3. Close menu on nav link click
     ========================================================================== */
  var mobileLinks = document.querySelectorAll('.mobile-menu__link');
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      body.classList.remove('menu-open');
    });
  });

  /* ==========================================================================
     4. Smooth scroll with header offset
     ========================================================================== */
  var scrollLinks = document.querySelectorAll('a[href^="#"]');

  scrollLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      /* Handle callback modal trigger */
      if (targetId === '#callback') {
        e.preventDefault();
        openModal();
        return;
      }

      var target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      var headerH = header.offsetHeight;
      var top = target.getBoundingClientRect().top + window.pageYOffset - headerH;

      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ==========================================================================
     5. Scroll animations — IntersectionObserver
     ========================================================================== */
  var hiddenEls = document.querySelectorAll('.scroll-hidden');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('scroll-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    hiddenEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    /* Fallback: show everything */
    hiddenEls.forEach(function (el) {
      el.classList.add('scroll-visible');
    });
  }

  /* ==========================================================================
     6. Services Tabs
     ========================================================================== */
  var tabs = document.querySelectorAll('.services-tab');
  var panels = document.querySelectorAll('.services-panel');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var target = this.getAttribute('data-tab');

      tabs.forEach(function (t) { t.classList.remove('active'); });
      panels.forEach(function (p) { p.classList.remove('active'); });

      this.classList.add('active');
      var panel = document.querySelector('[data-panel="' + target + '"]');
      if (panel) panel.classList.add('active');
    });
  });

  /* ==========================================================================
     7. Counter animation
     ========================================================================== */
  var counters = document.querySelectorAll('.counter');

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var duration = 1600; /* ms */
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      /* ease-out quad */
      var ease = 1 - (1 - progress) * (1 - progress);
      var current = Math.floor(ease * target);
      el.textContent = current.toLocaleString('ru-RU');
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString('ru-RU');
      }
    }

    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window && counters.length) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counters.forEach(function (c) {
      counterObserver.observe(c);
    });
  }

  /* ==========================================================================
     7. Back-to-top button
     ========================================================================== */
  backBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ==========================================================================
     8. Callback modal — open / close
     ========================================================================== */
  function openModal() {
    modalOverlay.classList.add('modal-overlay--active');
    body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('modal-overlay--active');
    body.style.overflow = '';
  }

  /* Open triggers */
  var modalTriggers = document.querySelectorAll('[data-modal="callback"]');
  modalTriggers.forEach(function (trigger) {
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      openModal();
    });
  });

  /* Close button */
  var closeBtn = modalOverlay.querySelector('.modal__close');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  /* Close on overlay click */
  modalOverlay.addEventListener('click', function (e) {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  /* Close on Escape */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modalOverlay.classList.contains('modal-overlay--active')) {
      closeModal();
    }
  });

  /* ==========================================================================
     9. Form submit → WhatsApp redirect
     ========================================================================== */
  if (modalForm) {
    modalForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var nameInput  = modalForm.querySelector('[name="name"]');
      var phoneInput = modalForm.querySelector('[name="phone"]');

      var name  = nameInput  ? nameInput.value.trim()  : '';
      var phone = phoneInput ? phoneInput.value.trim() : '';

      if (!name || !phone) return;

      var message = encodeURIComponent(
        'Здравствуйте! Меня зовут ' + name + '. Мой номер: ' + phone + '. Хочу записаться на диагностику.'
      );

      /* Use the whatsapp URL from data attribute or fallback */
      var waBase = modalForm.getAttribute('data-whatsapp') || 'https://wa.me/';
      var waUrl = waBase + '?text=' + message;

      window.open(waUrl, '_blank');
      closeModal();
      modalForm.reset();
    });
  }

})();

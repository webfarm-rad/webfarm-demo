/* ============================================
   Дзен Лазер — Main JavaScript
   ============================================ */

(function () {
  'use strict';

  /* --- DOM Ready --- */
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initHeader();
    initHeroCarousel();
    initMobileNav();
    initSmoothScroll();
    initFaqAccordion();
    initCounters();
    initReviewSlider();
    initScrollAnimations();
    initBackToTop();
  }

  /* === STICKY HEADER === */
  function initHeader() {
    var header = document.querySelector('.header');
    if (!header) return;

    function onScroll() {
      if (window.scrollY > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* === HERO CAROUSEL === */
  function initHeroCarousel() {
    var slides = document.querySelectorAll('.hero__slide');
    var dots = document.querySelectorAll('.hero__dot');
    var prevBtn = document.querySelector('.hero__arrow--prev');
    var nextBtn = document.querySelector('.hero__arrow--next');
    if (slides.length === 0) return;

    var current = 0;
    var total = slides.length;
    var interval = null;
    var touchStartX = 0;
    var touchEndX = 0;

    function goTo(index) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = (index + total) % total;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function startAuto() {
      stopAuto();
      interval = setInterval(next, 5000);
    }

    function stopAuto() {
      if (interval) clearInterval(interval);
    }

    if (nextBtn) nextBtn.addEventListener('click', function () { next(); startAuto(); });
    if (prevBtn) prevBtn.addEventListener('click', function () { prev(); startAuto(); });

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goTo(i); startAuto(); });
    });

    /* Touch swipe */
    var hero = document.querySelector('.hero');
    if (hero) {
      hero.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      hero.addEventListener('touchend', function (e) {
        touchEndX = e.changedTouches[0].screenX;
        var diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
          if (diff > 0) next(); else prev();
          startAuto();
        }
      }, { passive: true });
    }

    startAuto();
  }

  /* === MOBILE NAV === */
  function initMobileNav() {
    var burger = document.querySelector('.burger');
    var mobileNav = document.querySelector('.mobile-nav');
    if (!burger || !mobileNav) return;

    burger.addEventListener('click', function () {
      burger.classList.toggle('active');
      mobileNav.classList.toggle('active');
      document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });

    var links = mobileNav.querySelectorAll('.mobile-nav__link');
    links.forEach(function (link) {
      link.addEventListener('click', function () {
        burger.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  /* === SMOOTH SCROLL === */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;
        var target = document.querySelector(targetId);
        if (!target) return;
        e.preventDefault();
        var headerH = document.querySelector('.header').offsetHeight || 70;
        var top = target.getBoundingClientRect().top + window.pageYOffset - headerH;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  /* === FAQ ACCORDION === */
  function initFaqAccordion() {
    var items = document.querySelectorAll('.faq__item');
    items.forEach(function (item) {
      var question = item.querySelector('.faq__question');
      var answer = item.querySelector('.faq__answer');
      if (!question || !answer) return;

      question.addEventListener('click', function () {
        var isOpen = item.classList.contains('active');

        /* Close all first */
        items.forEach(function (other) {
          other.classList.remove('active');
          var a = other.querySelector('.faq__answer');
          if (a) a.style.maxHeight = null;
        });

        if (!isOpen) {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  }

  /* === COUNTER ANIMATION === */
  function initCounters() {
    var counters = document.querySelectorAll('.numbers__value');
    if (counters.length === 0) return;

    var animated = false;

    function animateCounters() {
      if (animated) return;
      animated = true;

      counters.forEach(function (counter) {
        var target = parseInt(counter.getAttribute('data-target'), 10);
        var suffix = counter.getAttribute('data-suffix') || '';
        var duration = 2000;
        var start = 0;
        var startTime = null;

        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          var progress = Math.min((timestamp - startTime) / duration, 1);
          /* Ease out quad */
          var eased = 1 - (1 - progress) * (1 - progress);
          var current = Math.floor(eased * target);
          counter.textContent = current.toLocaleString('ru-RU') + suffix;
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            counter.textContent = target.toLocaleString('ru-RU') + suffix;
          }
        }

        requestAnimationFrame(step);
      });
    }

    var section = document.querySelector('.numbers');
    if (!section) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounters();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(section);
  }

  /* === REVIEW SLIDER === */
  function initReviewSlider() {
    var track = document.querySelector('.reviews__track');
    var dots = document.querySelectorAll('.reviews__dot');
    var cards = document.querySelectorAll('.review-card');
    if (!track || cards.length === 0) return;

    var current = 0;
    var total = cards.length;
    var interval = null;

    function goTo(index) {
      current = (index + total) % total;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      dots.forEach(function (d, i) {
        d.classList.toggle('active', i === current);
      });
    }

    function next() { goTo(current + 1); }

    function startAuto() {
      stopAuto();
      interval = setInterval(next, 6000);
    }

    function stopAuto() {
      if (interval) clearInterval(interval);
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goTo(i); startAuto(); });
    });

    startAuto();
  }

  /* === SCROLL ANIMATIONS === */
  function initScrollAnimations() {
    var elements = document.querySelectorAll('.scroll-hidden');
    if (elements.length === 0) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('scroll-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    elements.forEach(function (el) { observer.observe(el); });
  }

  /* === BACK TO TOP === */
  function initBackToTop() {
    var btn = document.querySelector('.back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 500) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

})();

/* ==========================================================================
   КОСМОС АВТО — main.js
   Burger menu, smooth scroll, sticky header, callback modal
   ========================================================================== */

(function () {
    'use strict';

    // Elements
    var header = document.getElementById('header');
    var burger = document.getElementById('burger');
    var nav = document.getElementById('nav');
    var modal = document.getElementById('callbackModal');
    var modalBackdrop = document.getElementById('modalBackdrop');
    var modalClose = document.getElementById('modalClose');
    var callbackForm = document.getElementById('callbackForm');

    // CTA buttons that open modal
    var ctaButtons = document.querySelectorAll('[href="#callback"]');

    // ---- Burger menu ----
    burger.addEventListener('click', function () {
        burger.classList.toggle('burger--open');
        nav.classList.toggle('header__nav--open');
        document.body.classList.toggle('menu-open');
    });

    // Close menu on link click
    var navLinks = nav.querySelectorAll('.header__link');
    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            burger.classList.remove('burger--open');
            nav.classList.remove('header__nav--open');
            document.body.classList.remove('menu-open');
        });
    });

    // ---- Header scroll ----
    var lastScroll = 0;
    window.addEventListener('scroll', function () {
        var scrollY = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollY > 60) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
        lastScroll = scrollY;
    }, { passive: true });

    // ---- Modal ----
    function openModal() {
        modal.classList.add('modal--open');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('modal--open');
        document.body.style.overflow = '';
    }

    ctaButtons.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            openModal();
        });
    });

    modalBackdrop.addEventListener('click', closeModal);
    modalClose.addEventListener('click', closeModal);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('modal--open')) {
            closeModal();
        }
    });

    // ---- Form submit → WhatsApp ----
    callbackForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = callbackForm.querySelector('[name="name"]').value.trim();
        var phone = callbackForm.querySelector('[name="phone"]').value.trim();

        if (!name || !phone) return;

        var text = encodeURIComponent(
            'Заявка с сайта:\nИмя: ' + name + '\nТелефон: ' + phone
        );
        window.open('https://wa.me/78432500670?text=' + text, '_blank');
        closeModal();
        callbackForm.reset();
    });

})();

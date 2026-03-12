/* ============================================
   ЦИРЮЛЬНЯ -- Minimal JS
   Burger menu, smooth scroll, header shrink
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* --- Header shrink on scroll --- */
    const header = document.querySelector('.header');
    function checkScroll() {
        if (!header) return;
        header.classList.toggle('scrolled', window.scrollY > 30);
    }
    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();

    /* --- Burger menu toggle --- */
    const burger = document.querySelector('.burger');
    const mobileNav = document.querySelector('.mobile-nav');

    if (burger && mobileNav) {
        burger.addEventListener('click', () => {
            const isOpen = burger.classList.toggle('open');
            mobileNav.classList.toggle('open');
            if (isOpen) {
                mobileNav.removeAttribute('hidden');
            } else {
                mobileNav.setAttribute('hidden', '');
            }
            document.body.classList.toggle('no-scroll');
            burger.setAttribute('aria-expanded', isOpen);
        });

        // Close menu on link click
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('open');
                mobileNav.classList.remove('open');
                mobileNav.setAttribute('hidden', '');
                document.body.classList.remove('no-scroll');
                burger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* --- Smooth scroll for anchor links --- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const id = anchor.getAttribute('href');
            if (id === '#' || id === '#top') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            const target = document.querySelector(id);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    /* --- Active nav link on scroll --- */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function highlightNav() {
        const y = window.scrollY + 100;
        sections.forEach(sec => {
            const top = sec.offsetTop;
            const h = sec.offsetHeight;
            const id = sec.getAttribute('id');
            if (y >= top && y < top + h) {
                navLinks.forEach(l => {
                    l.classList.toggle('active', l.getAttribute('href') === '#' + id);
                });
            }
        });
    }

    if (navLinks.length && sections.length) {
        window.addEventListener('scroll', highlightNav, { passive: true });
    }

    /* --- Footer year --- */
    const yearEl = document.querySelector('.js-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

});

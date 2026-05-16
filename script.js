/* ───────────────────────────────────────────────
   HOTEL A' PINNATA — interactions
   ─────────────────────────────────────────────── */

(() => {
  'use strict';

  /* ─── Nav: scrolled state ─── */
  const nav = document.getElementById('nav');
  let lastY = 0;

  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 30);
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ─── Burger: mobile menu toggle ─── */
  const burger = document.getElementById('burger');
  const links  = document.querySelector('.nav__links');

  if (burger && links) {
    burger.addEventListener('click', () => {
      const open = links.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('is-open');
        burger.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ─── Smooth scroll for in-page anchors ─── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ─── Reveal on scroll ─── */
  const revealTargets = document.querySelectorAll(
    '.section__head, .intro__body, .feature, .room, .breakfast__media, .breakfast__body, .exp, .gallery__item, .review, .location__body, .location__map, .cta__inner'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // stagger items inside the same group
          const delay = entry.target.dataset.delay || (i % 4) * 80;
          setTimeout(() => entry.target.classList.add('is-visible'), delay);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealTargets.forEach(el => io.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('is-visible'));
  }

  /* ─── Subtle parallax on hero image ─── */
  const heroImg = document.querySelector('.hero__media img');
  if (heroImg && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < window.innerHeight) {
          heroImg.style.transform = `translate3d(0, ${y * 0.25}px, 0) scale(${1 + y * 0.0002})`;
        }
        ticking = false;
      });
    }, { passive: true });
  }

  /* ─── Booking form: prefill dates ─── */
  const checkIn = document.querySelector('input[type="date"]');
  const checkOut = document.querySelectorAll('input[type="date"]')[1];
  if (checkIn && checkOut) {
    const today = new Date();
    const tmr = new Date(today); tmr.setDate(tmr.getDate() + 1);
    const fmt = d => d.toISOString().split('T')[0];
    checkIn.min = fmt(today);
    checkOut.min = fmt(tmr);
    checkIn.addEventListener('change', () => {
      const next = new Date(checkIn.value);
      next.setDate(next.getDate() + 1);
      checkOut.min = fmt(next);
      if (new Date(checkOut.value) <= new Date(checkIn.value)) {
        checkOut.value = fmt(next);
      }
    });
  }

})();

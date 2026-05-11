/* ═══════════════════════════════════════════════════════════════
   Restaurant NET v2 — script.js
   ═══════════════════════════════════════════════════════════════ */

(() => {
  'use strict';

  /* ─── Nav scroll state ───────────────────────────────────── */
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ─── Hamburger ──────────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('navMenu');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const open = navMenu.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
    });
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ─── Hero video — slow cinema + bulletproof fade-in ─────── */
  const heroVideo = document.getElementById('heroVideo');
  if (heroVideo) {
    heroVideo.playbackRate = 0.85;

    const showVideo = () => heroVideo.classList.add('is-ready');
    heroVideo.addEventListener('canplay',    showVideo, { once: true });
    heroVideo.addEventListener('playing',    showVideo, { once: true });
    heroVideo.addEventListener('loadeddata', showVideo, { once: true });
    setTimeout(showVideo, 1500);
    if (heroVideo.readyState >= 3) showVideo();
    heroVideo.play().catch(() => {});

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) heroVideo.pause();
      else heroVideo.play().catch(() => {});
    });
  }

  /* ─── Dnešní datum česky ─────────────────────────────────── */
  const dnyArr = ['neděle', 'pondělí', 'úterý', 'středa', 'čtvrtek', 'pátek', 'sobota'];
  const mesArr = ['ledna', 'února', 'března', 'dubna', 'května', 'června',
                  'července', 'srpna', 'září', 'října', 'listopadu', 'prosince'];
  const dnes = new Date();
  const dateText = `${dnyArr[dnes.getDay()].charAt(0).toUpperCase() + dnyArr[dnes.getDay()].slice(1)} ${dnes.getDate()}. ${mesArr[dnes.getMonth()]} ${dnes.getFullYear()}`;
  const dateEl = document.getElementById('todayDate');
  if (dateEl) dateEl.textContent = dateText;

  /* ─── IntersectionObserver scroll reveals ────────────────── */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: .1, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ─── Scroll-spy: aktivní nav link dle pozice ────────────── */
  const navLinks = document.querySelectorAll('.nav__link');
  const sections = Array.from(navLinks)
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  const setActive = () => {
    const fromTop = window.scrollY + nav.offsetHeight + 80;
    let current = sections[0];
    sections.forEach(sec => {
      if (sec && sec.offsetTop <= fromTop) current = sec;
    });
    navLinks.forEach(a => {
      a.classList.toggle('is-active', current && a.getAttribute('href') === '#' + current.id);
    });
  };
  window.addEventListener('scroll', setActive, { passive: true });
  setActive();

  /* ─── Smooth scroll s offsetem ───────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - nav.offsetHeight - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ─── Stat counter animation (IntersectionObserver triggered) ─ */
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.count, 10);
    if (!target || isNaN(target)) return;
    const duration = 1800;
    const start = performance.now();
    const fmt = new Intl.NumberFormat('cs-CZ');
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      // ease-out-expo
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      const value = Math.round(target * eased);
      el.textContent = target >= 1000 ? fmt.format(value) + '+' : fmt.format(value);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        counterIO.unobserve(e.target);
      }
    });
  }, { threshold: .4 });
  document.querySelectorAll('.stat__value[data-count]').forEach(el => counterIO.observe(el));

  /* ─── Magnetic dish-card hover (subtle 3D tilt) ──────────── */
  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (supportsHover) {
    document.querySelectorAll('.dish-card').forEach(card => {
      let rafId;
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width  - 0.5;
        const y = (e.clientY - rect.top)  / rect.height - 0.5;
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          card.style.transform = `translateY(-8px) perspective(800px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 4).toFixed(2)}deg)`;
        });
      });
      card.addEventListener('mouseleave', () => {
        cancelAnimationFrame(rafId);
        card.style.transform = '';
      });
    });
  }

  /* ─── Hero parallax (jemný posun) ────────────────────────── */
  if (supportsHover) {
    const heroContent = document.querySelector('.hero__content');
    const heroMedia   = document.querySelector('.hero__media video');
    if (heroContent && heroMedia) {
      let rafId;
      const onMouseMove = (e) => {
        const cx = (e.clientX / window.innerWidth)  - 0.5;
        const cy = (e.clientY / window.innerHeight) - 0.5;
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          heroContent.style.transform = `translate(${cx * -8}px, ${cy * -6}px)`;
          // video posun je už řízený CSS animací, jen jemný drift
        });
      };
      window.addEventListener('mousemove', onMouseMove, { passive: true });
    }
  }

  /* ─── Hero scroll parallax ────────────────────────────────── */
  const hero = document.querySelector('.hero');
  const heroVid = document.querySelector('.hero__media video');
  if (hero && heroVid) {
    window.addEventListener('scroll', () => {
      const rect = hero.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const speed = 0.15;
      const offset = window.scrollY * speed;
      heroVid.style.objectPosition = `center ${50 + offset * 0.05}%`;
    }, { passive: true });
  }

})();

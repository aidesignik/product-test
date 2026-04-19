// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (toggle) {
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

// Page loader: fade out once hero video is fully buffered, then reveal content
const pageLoader = document.getElementById('pageLoader');
const heroVidA = document.getElementById('heroVidA');
if (pageLoader && heroVidA) {
  let hidden = false;
  const hideLoader = () => {
    if (hidden) return;
    hidden = true;
    pageLoader.classList.add('is-loaded');
    setTimeout(() => document.body.classList.remove('is-loading'), 500);
  };
  if (heroVidA.readyState >= 4) {
    hideLoader();
  } else {
    heroVidA.addEventListener('canplaythrough', hideLoader, { once: true });
  }
  setTimeout(hideLoader, 8000);
}

// Nav background on scroll (transparent over hero, solid after)
const nav = document.querySelector('.nav');
const hero = document.querySelector('.hero');

if (nav && hero) {
  const updateNav = () => {
    if (window.scrollY > hero.offsetHeight - 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
}

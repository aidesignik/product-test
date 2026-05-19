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

// Page loader: hide as soon as the page is ready — hero intro is rendered
// inline (SVG) so there's no buffering wait.
const pageLoader = document.getElementById('pageLoader');
if (pageLoader) {
  let hidden = false;
  const hideLoader = () => {
    if (hidden) return;
    hidden = true;
    pageLoader.classList.add('is-loaded');
    // Drop is-loading right away — the loader's own CSS opacity transition
    // handles the visual fade, no need to delay the page reveal further.
    document.body.classList.remove('is-loading');
  };
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    requestAnimationFrame(hideLoader);
  } else {
    document.addEventListener('DOMContentLoaded', () => requestAnimationFrame(hideLoader));
  }
  setTimeout(hideLoader, 2000);
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

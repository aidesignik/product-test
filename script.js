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

// Password gate for case studies
const CASE_STUDY_KEY = 'portfolio_authenticated';

function isCaseStudyAuthenticated() {
  return localStorage.getItem(CASE_STUDY_KEY) === 'true';
}

// If on a project page without auth, redirect to homepage
if (/project\d+\.html/.test(window.location.pathname) && !isCaseStudyAuthenticated()) {
  window.location.href = 'index.html';
}

// Password modal logic (only on index page)
const passwordModal = document.getElementById('passwordModal');
if (passwordModal) {
  const passwordForm = document.getElementById('passwordForm');
  const passwordInput = document.getElementById('passwordInput');
  const passwordError = document.getElementById('passwordError');
  const modalClose = document.getElementById('passwordModalClose');
  const backdrop = passwordModal.querySelector('.password-modal-backdrop');
  let pendingHref = '';

  // If already authenticated, swap buttons back to direct links
  if (isCaseStudyAuthenticated()) {
    document.querySelectorAll('.password-gate').forEach(el => {
      const href = el.dataset.href;
      if (el.tagName === 'BUTTON') {
        const link = document.createElement('a');
        link.href = href;
        link.className = el.className.replace('password-gate', '').trim();
        link.textContent = 'See Case Study';
        el.replaceWith(link);
      } else {
        el.href = href;
        el.classList.remove('password-gate');
      }
    });
  } else {
    // Intercept clicks on password-gated elements
    document.querySelectorAll('.password-gate').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        pendingHref = el.dataset.href;
        passwordError.classList.remove('visible');
        passwordInput.value = '';
        passwordModal.classList.add('open');
        setTimeout(() => passwordInput.focus(), 100);
      });
    });

    passwordForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (passwordInput.value === 'MakeInnovationHappen') {
        localStorage.setItem(CASE_STUDY_KEY, 'true');
        window.location.href = pendingHref;
      } else {
        passwordError.classList.add('visible');
        passwordInput.value = '';
        passwordInput.focus();
      }
    });

    const closeModal = () => {
      passwordModal.classList.remove('open');
      pendingHref = '';
    };

    modalClose.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && passwordModal.classList.contains('open')) closeModal();
    });
  }
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

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

// Typewriter tooltips on the fixed social icons (hover devices only —
// on touch, tooltips can stick and the email icon's mailto: should
// open the default mail app instead of running the clipboard copy)
const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
if (supportsHover) {
document.querySelectorAll('.social-fixed-icon').forEach((icon) => {
  const tip = icon.querySelector('.social-fixed-tooltip');
  if (!tip) return;
  const defaultText = icon.getAttribute('data-tooltip') || '';
  let typeTimer;

  const typeText = (str) => {
    clearInterval(typeTimer);
    tip.textContent = '';
    tip.classList.add('is-visible');
    let i = 0;
    typeTimer = setInterval(() => {
      i += 1;
      tip.textContent = str.slice(0, i);
      if (i >= str.length) clearInterval(typeTimer);
    }, 14);
  };

  const hide = () => {
    clearInterval(typeTimer);
    tip.classList.remove('is-visible');
    tip.textContent = '';
  };

  icon.addEventListener('mouseenter', () => {
    if (icon.dataset.lock === '1') return;
    typeText(icon.getAttribute('data-tooltip') || defaultText);
  });
  icon.addEventListener('mouseleave', () => {
    if (icon.dataset.lock === '1') return;
    hide();
  });

  icon._tooltipType = typeText;
  icon._tooltipHide = hide;
});

// Click-to-copy email
const emailCopy = document.getElementById('emailCopy');
if (emailCopy) {
  const email = emailCopy.getAttribute('data-copy');
  let resetTimer;
  emailCopy.addEventListener('click', (e) => {
    e.preventDefault();
    if (!(navigator.clipboard && navigator.clipboard.writeText)) return;
    navigator.clipboard.writeText(email).then(() => {
      emailCopy.classList.add('is-copied');
      emailCopy.dataset.lock = '1';
      if (emailCopy._tooltipType) emailCopy._tooltipType('Copied!');
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        emailCopy.classList.remove('is-copied');
        delete emailCopy.dataset.lock;
        if (emailCopy.matches(':hover') && emailCopy._tooltipType) {
          emailCopy._tooltipType(emailCopy.getAttribute('data-tooltip') || '');
        } else if (emailCopy._tooltipHide) {
          emailCopy._tooltipHide();
        }
      }, 2500);
    }).catch(() => {});
  });
}
}

// Prescouter preview: have it trail the cursor while hovering the link.
// Hover-only — the CSS already hides the preview on touch.
if (supportsHover) {
  document.querySelectorAll('.prescouter-link').forEach((link) => {
    const preview = link.querySelector('.prescouter-preview');
    if (!preview) return;
    preview.classList.add('is-cursor-follow');

    const OFFSET_X = 22;
    const OFFSET_Y = 26;
    const EASE = 0.22;

    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;
    let rafId = null;
    let hovering = false;

    const tick = () => {
      curX += (targetX - curX) * EASE;
      curY += (targetY - curY) * EASE;
      preview.style.setProperty('--cx', curX + 'px');
      preview.style.setProperty('--cy', curY + 'px');
      const dx = targetX - curX;
      const dy = targetY - curY;
      if (hovering || dx * dx + dy * dy > 0.25) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = null;
      }
    };

    const updateTarget = (e) => {
      const rect = link.getBoundingClientRect();
      targetX = e.clientX - rect.left + OFFSET_X;
      targetY = e.clientY - rect.top + OFFSET_Y;
    };

    link.addEventListener('mouseenter', (e) => {
      hovering = true;
      updateTarget(e);
      // Snap to cursor on entry so the card appears next to the pointer,
      // then subsequent moves produce the trailing float.
      curX = targetX;
      curY = targetY;
      preview.style.setProperty('--cx', curX + 'px');
      preview.style.setProperty('--cy', curY + 'px');
      if (!rafId) rafId = requestAnimationFrame(tick);
    });

    link.addEventListener('mousemove', (e) => {
      updateTarget(e);
      if (!rafId) rafId = requestAnimationFrame(tick);
    });

    link.addEventListener('mouseleave', () => {
      hovering = false;
    });
  });
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

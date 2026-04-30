/**
 * Raging Detail — script.js
 * Vanilla JS only. No jQuery. defer attribute on script tag.
 */

/* ============================================================
   1. STICKY NAV — scroll-triggered shadow + bg
   ============================================================ */
const header = document.getElementById('site-header');

function handleScroll() {
  if (window.scrollY > 60) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll(); // run on load

/* ============================================================
   2. MOBILE HAMBURGER MENU
   ============================================================ */
const hamburger   = document.querySelector('.hamburger');
const mobileMenu  = document.getElementById('mobile-menu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen.toString());
    mobileMenu.setAttribute('aria-hidden', (!isOpen).toString());
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on mobile nav link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target) && mobileMenu.classList.contains('open')) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  });
}

/* ============================================================
   3. SCROLL-TRIGGERED FADE-IN (IntersectionObserver)
   ============================================================ */
const fadeEls = document.querySelectorAll('.fade-in');

if ('IntersectionObserver' in window) {
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -48px 0px'
  });

  fadeEls.forEach(el => fadeObserver.observe(el));
} else {
  // Fallback — just show everything
  fadeEls.forEach(el => el.classList.add('visible'));
}

/* ============================================================
   4. SMOOTH SCROLL for anchor links
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const headerHeight = header.offsetHeight;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  });
});

/* ============================================================
   5. CONTACT FORM VALIDATION
   ============================================================ */
const form        = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    // Clear previous errors
    form.querySelectorAll('.form-error').forEach(el => el.textContent = '');
    form.querySelectorAll('input, textarea').forEach(el => el.classList.remove('error'));

    // Name validation
    const nameField = document.getElementById('name');
    if (nameField && nameField.value.trim().length < 2) {
      showError(nameField, 'Please enter your name.');
      valid = false;
    }

    // Message validation
    const msgField = document.getElementById('message');
    if (msgField && msgField.value.trim().length < 10) {
      showError(msgField, 'Please tell us what service you\'re interested in.');
      valid = false;
    }

    if (valid) {
      // Simulate send — replace with real form submission (e.g. Formspree, EmailJS)
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;

      setTimeout(() => {
        form.reset();
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
        if (formSuccess) {
          formSuccess.hidden = false;
          formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          setTimeout(() => { formSuccess.hidden = true; }, 6000);
        }
      }, 900);
    }
  });
}

function showError(field, message) {
  field.classList.add('error');
  const errorEl = field.parentElement.querySelector('.form-error');
  if (errorEl) errorEl.textContent = message;
  if (!document.querySelector('.error:focus')) field.focus();
}

/* ============================================================
   6. FLEET FORM VALIDATION
   ============================================================ */
const fleetForm        = document.getElementById('fleet-contact-form');
const fleetFormSuccess = document.getElementById('fleet-form-success');

if (fleetForm) {
  fleetForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    fleetForm.querySelectorAll('.form-error').forEach(el => el.textContent = '');
    fleetForm.querySelectorAll('input, textarea, select').forEach(el => el.classList.remove('error'));

    const fleetName = document.getElementById('fleet-name');
    if (fleetName && fleetName.value.trim().length < 2) {
      showError(fleetName, 'Please enter your name.');
      valid = false;
    }

    const fleetCompany = document.getElementById('fleet-company');
    if (fleetCompany && fleetCompany.value.trim().length < 2) {
      showError(fleetCompany, 'Please enter your company name.');
      valid = false;
    }

    const fleetVehicles = document.getElementById('fleet-vehicles');
    if (fleetVehicles && !fleetVehicles.value) {
      showError(fleetVehicles, 'Please select your vehicle count.');
      valid = false;
    }

    if (valid) {
      const submitBtn = document.getElementById('fleet-submit');
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;

      setTimeout(() => {
        fleetForm.reset();
        submitBtn.textContent = 'Request Fleet Quote';
        submitBtn.disabled = false;
        if (fleetFormSuccess) {
          fleetFormSuccess.hidden = false;
          fleetFormSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          setTimeout(() => { fleetFormSuccess.hidden = true; }, 6000);
        }
      }, 900);
    }
  });
}

/* ============================================================
   8. FOOTER YEAR
   ============================================================ */
const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ============================================================
   9. VIDEO GRID — click to play/pause, auto-pause others
   ============================================================ */
document.querySelectorAll('.video-cell').forEach(cell => {
  const video = cell.querySelector('video');
  const btn   = cell.querySelector('.video-play-btn');
  if (!video) return;

  // Seek to 0.5s once metadata loads — forces browser to render a real frame instead of black
  video.addEventListener('loadedmetadata', () => {
    video.currentTime = 0.5;
  });

  // Click anywhere on cell to toggle play/pause
  cell.addEventListener('click', () => {
    if (video.paused) {
      // Pause all other videos first
      document.querySelectorAll('.video-cell video').forEach(v => {
        if (v !== video) {
          v.pause();
          v.closest('.video-cell').classList.remove('playing');
        }
      });
      video.play().catch(() => {});
      cell.classList.add('playing');
    } else {
      video.pause();
      cell.classList.remove('playing');
    }
  });

  // When video ends, reset play button
  video.addEventListener('ended', () => {
    cell.classList.remove('playing');
  });
});

/* ============================================================
   8. STAGGERED ANIMATION for package cards
   ============================================================ */
const packageCards = document.querySelectorAll('.package-card');
packageCards.forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.07}s`;
});

/* ============================================================
   8. ACTIVE NAV LINK on scroll
   ============================================================ */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle(
          'active',
          link.getAttribute('href') === '#' + entry.target.id
        );
      });
    }
  });
}, {
  rootMargin: '-30% 0px -60% 0px'
});

sections.forEach(section => sectionObserver.observe(section));

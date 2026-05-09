/* ============================================================
   HEADER — shadow on scroll
============================================================ */
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  header?.classList.toggle('scrolled', window.scrollY > 8);
}, { passive: true });

/* ============================================================
   NAVIGATION — hamburger toggle + outside-click close
============================================================ */
const hamburger = document.getElementById('hamburger');
const nav       = document.getElementById('main-nav');

hamburger?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
});

// Close on nav link click
nav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeNav);
});

// Close when clicking outside
document.addEventListener('click', e => {
  if (nav?.classList.contains('open') &&
      !nav.contains(e.target) &&
      !hamburger?.contains(e.target)) {
    closeNav();
  }
});

function closeNav() {
  nav?.classList.remove('open');
  hamburger?.classList.remove('open');
  hamburger?.setAttribute('aria-expanded', 'false');
}

/* ============================================================
   SCROLL-REVEAL — fade/slide elements in on intersection
============================================================ */
const revealTargets = document.querySelectorAll(
  '.benefit-card, .feature-item, .testimonial-card, .step, .trust-item'
);

revealTargets.forEach(el => el.classList.add('reveal'));

if ('IntersectionObserver' in window) {
  let index = 0;
  const io = new IntersectionObserver(
    entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      // Stagger within the same parent row
      const siblings = [...entry.target.parentElement.children];
      const i = siblings.indexOf(entry.target);
      const delay = (i % 4) * 80;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      io.unobserve(entry.target);
    }),
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  revealTargets.forEach(el => io.observe(el));
}

/* ============================================================
   MOBILE CTA BAR — hide when contact section is in view
============================================================ */
const mobileBar    = document.querySelector('.mobile-cta-bar');
const contactSection = document.getElementById('contact');

if (mobileBar && contactSection && 'IntersectionObserver' in window) {
  const barObserver = new IntersectionObserver(
    ([entry]) => {
      mobileBar.style.opacity    = entry.isIntersecting ? '0' : '1';
      mobileBar.style.pointerEvents = entry.isIntersecting ? 'none' : '';
    },
    { threshold: 0.15 }
  );
  barObserver.observe(contactSection);
}

/* ============================================================
   SMOOTH SCROLL for mobile CTA "Request Demo" link
============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY;
    const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 68;
    window.scrollTo({ top: top - headerH - 12, behavior: 'smooth' });
  });
});

/* ============================================================
   FALLBACK CONTACT FORM
   Active only until HubSpot embed replaces #contact-form.
============================================================ */
const form        = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();

    // Honeypot check
    if (form.querySelector('[name="b_phone"]')?.value) return;

    // Basic validation
    const required = form.querySelectorAll('[required]');
    let valid = true;
    required.forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = '#ef4444';
        valid = false;
      } else {
        field.style.borderColor = '';
      }
    });
    if (!valid) {
      showMsg('error', 'Please fill in all required fields.');
      return;
    }

    const btn          = document.getElementById('form-submit');
    const originalHTML = btn.innerHTML;
    btn.disabled       = true;
    btn.innerHTML      = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending…';

    const data = Object.fromEntries(new FormData(form).entries());
    delete data.b_phone;

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        showMsg('success', "Thanks! We'll be in touch within one business day. Or call us at 604-800-5781.");
        form.reset();
      } else {
        const body = await res.json().catch(() => ({}));
        showMsg('error', body.message || 'Something went wrong. Please try again or call 604-800-5781.');
      }
    } catch {
      showMsg('error', 'Network error. Please check your connection or call us at 604-800-5781.');
    } finally {
      btn.disabled   = false;
      btn.innerHTML  = originalHTML;
    }
  });

  // Clear red borders on input
  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => { field.style.borderColor = ''; });
  });
}

function showMsg(type, text) {
  if (!formMessage) return;
  formMessage.textContent = text;
  formMessage.className   = `form-message ${type}`;
  formMessage.style.display = 'block';
  formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

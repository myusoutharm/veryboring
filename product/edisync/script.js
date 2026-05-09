/* ── Mobile navigation ───────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const mainNav   = document.getElementById('main-nav');

hamburger.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
});

/* Close mobile nav when a link is clicked */
mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

/* Close mobile nav when clicking outside */
document.addEventListener('click', e => {
  if (!mainNav.contains(e.target) && !hamburger.contains(e.target)) {
    mainNav.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }
});

/* ── Contact form submission ─────────────────────────────────────── */
const form        = document.getElementById('contact-form');
const submitBtn   = document.getElementById('form-submit');
const formMessage = document.getElementById('form-message');

form.addEventListener('submit', async e => {
  e.preventDefault();

  /* Honeypot check */
  if (form.elements['b_phone'] && form.elements['b_phone'].value) {
    return;
  }

  if (!validateForm()) return;

  setLoading(true);
  hideMessage();

  const payload = {
    company: form.elements['company'].value.trim(),
    firstname: form.elements['contact'].value.trim(),
    email: form.elements['email'].value.trim(),
    phone: form.elements['phone'].value.trim(),
    message: form.elements['message'].value.trim(),
  };

  const workerUrl = form.dataset.worker || '/api/contact';

  try {
    const res = await fetch(workerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      showMessage('success', "Thanks! We'll be in touch within one business day. You can also reach us directly at 604-800-5781.");
      form.reset();
    } else {
      const data = await res.json().catch(() => ({}));
      showMessage('error', data.message || 'Something went wrong. Please try again or call us at 604-800-5781.');
    }
  } catch {
    showMessage('error', 'Unable to send — please call us directly at 604-800-5781.');
  } finally {
    setLoading(false);
  }
});

function validateForm() {
  const required = ['company', 'contact', 'email'];
  let valid = true;

  required.forEach(name => {
    const el = form.elements[name];
    if (!el.value.trim()) {
      el.style.borderColor = 'var(--red)';
      el.focus();
      valid = false;
    } else {
      el.style.borderColor = '';
    }
  });

  const email = form.elements['email'];
  if (email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    email.style.borderColor = 'var(--red)';
    valid = false;
  }

  if (!valid) {
    showMessage('error', 'Please fill in all required fields.');
  }

  return valid;
}

function setLoading(on) {
  submitBtn.disabled = on;
  submitBtn.classList.toggle('loading', on);
}

function showMessage(type, text) {
  formMessage.textContent = text;
  formMessage.className = `form-message ${type}`;
  formMessage.style.display = 'block';
  if (type === 'success') {
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function hideMessage() {
  formMessage.style.display = 'none';
  formMessage.className = 'form-message';
}

/* Clear field error state on input */
form.querySelectorAll('input, textarea').forEach(el => {
  el.addEventListener('input', () => { el.style.borderColor = ''; });
});

/* ── Sticky header shadow on scroll ─────────────────────────────── */
const header = document.querySelector('.site-header');
const onScroll = () => {
  header.style.boxShadow = window.scrollY > 10
    ? '0 2px 16px rgba(0,0,0,.10)'
    : '';
};
window.addEventListener('scroll', onScroll, { passive: true });

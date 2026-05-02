const contentFiles = {
  navigation: 'content/navigation.json',
  hero: 'content/hero.json',
  services: 'content/services.json',
  process: 'content/process.json',
  'launch-partner': 'content/launch-partner.json',
  pricing: 'content/pricing.json',
  metrics: 'content/metrics.json',
  testimonials: 'content/testimonials.json',
  contact: 'content/contact.json',
  footer: 'content/footer.json'
};

async function loadContent() {
  try {
    const entries = Object.entries(contentFiles);
    const responses = await Promise.all(entries.map(([, file]) => fetch(file)));
    const jsons = await Promise.all(responses.map(r => r.json()));
    const content = Object.fromEntries(entries.map(([key], i) => [key, jsons[i]]));

    renderNavigation(content.navigation);
    renderHero(content.hero);
    renderServices(content.services);
    renderProcess(content.process);
    renderLaunchPartner(content['launch-partner']);
    renderPricing(content.pricing);
    renderMetrics(content.metrics);
    renderTestimonials(content.testimonials);
    renderContact(content.contact);
    renderFooter(content.footer);

    handleAnchorLinks();
    initScrollAnimations();
  } catch (err) {
    console.error('Error loading content:', err);
  }
}

// ── Shared SVG icons ──────────────────────────────────────────────────────────

const ICONS = {
  cpu: `<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6v6H9z"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M20 9h3M1 15h3M20 15h3"/></svg>`,
  globe: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  mic: `<svg viewBox="0 0 24 24"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/></svg>`,
  message: `<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  'bar-chart': `<svg viewBox="0 0 24 24"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>`,
  'trending-up': `<svg viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
  code: `<svg viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  search: `<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>`,
  map: `<svg viewBox="0 0 24 24"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>`,
  rocket: `<svg viewBox="0 0 24 24"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>`,
  users: `<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  target: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
  briefcase: `<svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
  check: `<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>`,
  gift: `<svg viewBox="0 0 24 24"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><path d="M12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>`,
  star: `<svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  server: `<svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>`,
  phone: `<svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.73a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 3h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  mail: `<svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`,
  mappin: `<svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  shield: `<svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`
};

function icon(name, extraClass = '') {
  return `<svg class="${extraClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${(ICONS[name] || '').replace(/<svg[^>]*>/, '').replace('</svg>', '')
    }</svg>`;
}

// ── Navigation ────────────────────────────────────────────────────────────────

function renderNavigation(data) {
  const topBar = document.getElementById('top-bar');
  if (topBar) {
    topBar.innerHTML = `
      <div class="container">
        <div class="top-bar-content">
          ${data.branches.map(b => `
            <a href="${b.href}" class="${b.active ? 'active' : ''}">${b.name}</a>
          `).join('')}
        </div>
      </div>`;
  }

  const nav = document.getElementById('nav-content');
  nav.innerHTML = `
    <a href="${data.home_href}" class="logo">
      ${data.logo}
    </a>
    <ul class="nav-links" id="nav-links">
      ${data.links.map(link => `
        <li>
          <a href="${link.href}" class="${link.highlight ? 'nav-highlight' : ''}">${link.text}</a>
        </li>
      `).join('')}
      <li class="nav-mobile-cta">
        <a href="${data.cta.href}" class="btn btn-primary">${data.cta.text}</a>
      </li>
    </ul>
    <div class="nav-right">
      <a href="${data.cta.href}" class="btn btn-primary nav-cta-desktop">${data.cta.text}</a>
      <button class="hamburger" id="hamburger" aria-label="Toggle menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  `;

  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

// ── Hero ──────────────────────────────────────────────────────────────────────

function renderHero(data) {
  const section = document.getElementById('hero');
  section.innerHTML = `
    <div class="hero-bg">
      <img src="public/hero-bg.jpg" alt="">
    </div>
    <div class="hero-orb"></div>
    <div class="hero-content container">
      <p class="hero-eyebrow">${data.eyebrow}</p>
      <h1>
        <span>${data.headline_plain}</span>
        <span class="text-gradient">${data.headline_gradient}</span>
      </h1>
      <p>${data.subheadline}</p>
      <div class="hero-cta">
        ${data.ctas.map(cta => `
          <a href="${cta.href}" class="btn btn-${cta.variant} btn-lg">${cta.text}</a>
        `).join('')}
      </div>
    </div>
    <div class="scroll-indicator"><span></span></div>
  `;
}

// ── Services ──────────────────────────────────────────────────────────────────

function renderServices(data) {
  const section = document.getElementById('services');
  section.innerHTML = `
    <div class="container">
      <div class="section-header">
        <span class="eyebrow">${data.eyebrow}</span>
        <h2>${data.section_title}</h2>
        <p>${data.section_description}</p>
      </div>
      <div class="services-grid">
        ${data.items.map(item => `
          <div class="card-glass service-card">
            <div class="icon-box ${item.color}">${icon(item.icon)}</div>
            <h3>${item.title}</h3>
            <p>${item.description}</p>
          </div>
        `).join('')}
      </div>
      <div class="it-services-callout">
        ${data.it_services_callout.text}
        <a href="${data.it_services_callout.link_href}">${data.it_services_callout.link_text}</a>
      </div>
    </div>
  `;
}

// ── Process ───────────────────────────────────────────────────────────────────

function renderProcess(data) {
  const section = document.getElementById('process');
  section.innerHTML = `
    <div class="container">
      <div class="section-header">
        <span class="eyebrow">${data.eyebrow}</span>
        <h2>${data.section_title}</h2>
        <p>${data.section_description}</p>
      </div>
      <div class="process-grid">
        ${data.steps.map(step => `
          <div class="card-glass process-card">
            <div class="process-number">${step.number}</div>
            <div class="icon-box ${step.color}">${icon(step.icon)}</div>
            <h3>${step.title}</h3>
            <p>${step.description}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ── Launch Partner ────────────────────────────────────────────────────────────

function renderLaunchPartner(data) {
  const section = document.getElementById('launch-partner');
  const checkIcon = icon('check', 'lp-check');
  const userIcon = icon('users', 'lp-icon');
  const targetIcon = icon('target', 'lp-icon');
  const rocketIcon = icon('rocket', 'lp-icon');
  const reqIcons = [userIcon, targetIcon, rocketIcon];

  section.innerHTML = `
    <div class="container">
      <div class="section-header">
        <div class="badge-pill">
          ${icon('gift')} ${data.badge}
        </div>
        <h2>${data.section_title}</h2>
        <p style="font-size:1.2rem; color:var(--text); margin-top:12px;">
          ${data.headline.replace('FREE', '<span style="color:var(--green);font-weight:800">FREE</span>')}
        </p>
      </div>

      <div class="lp-grid">
        <div class="card-glass lp-card">
          <div class="lp-card-header">
            <div class="icon-box green">${icon('star')}</div>
            <h3>${data.what_you_get.title}</h3>
          </div>
          <ul class="lp-list">
            ${data.what_you_get.items.map(item => `
              <li>${checkIcon}<span>${item}</span></li>
            `).join('')}
          </ul>
        </div>
        <div class="card-glass lp-card">
          <div class="lp-card-header">
            <div class="icon-box purple">${icon('briefcase')}</div>
            <h3>${data.what_we_need.title}</h3>
          </div>
          <ul class="lp-list">
            ${data.what_we_need.items.map((item, i) => `
              <li>${reqIcons[i] || checkIcon}<span>${item}</span></li>
            `).join('')}
          </ul>
        </div>
      </div>

      <h3 style="text-align:center;margin-bottom:24px;">${data.looking_for.title}</h3>
      <div class="lp-criteria-grid">
        ${data.looking_for.items.map(item => `
          <div class="card-glass lp-criterion">
            <div class="lp-criterion-icon">${icon('check')}</div>
            <p>${item}</p>
          </div>
        `).join('')}
      </div>

      <div class="section-cta">
        <p>${data.cta_headline}</p>
        <div class="hero-cta">
          ${data.ctas.map(cta => `
            <a href="${cta.href}" class="btn btn-${cta.variant} btn-lg">${cta.text}</a>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

// ── Pricing ───────────────────────────────────────────────────────────────────

function renderPricing(data) {
  const section = document.getElementById('pricing');
  const it = data.it_services;
  const ai = data.automation;
  const checkIcon = icon('check');

  section.innerHTML = `
    <div class="container">
      <div class="section-header">
        <span class="eyebrow">${data.eyebrow}</span>
        <h2>${data.section_title}</h2>
        <p>${data.section_description}</p>
      </div>

      <div class="pricing-grid" style="grid-template-columns: 1fr;">
        <!-- AI & Automation -->
        <div class="card-glass pricing-card">
          <div class="icon-box pink" style="margin-bottom:20px">${icon('cpu')}</div>
          <h3>${ai.title}</h3>
          <p style="margin-bottom:24px;font-size:0.9rem;">${ai.subtitle}</p>
          <div style="overflow-x:auto">
            <table class="pricing-table">
              <thead>
                <tr>
                  <th>${ai.columns[0]}</th>
                  <th class="col-launch">${ai.columns[1]}</th>
                  <th class="col-standard">${ai.columns[2]}</th>
                </tr>
              </thead>
              <tbody>
                ${ai.rows.map(row => `
                  <tr>
                    <td>${row.feature}</td>
                    <td class="val-launch">${row.launch === true ? checkIcon : row.launch}</td>
                    <td class="val-standard">${row.standard === true ? checkIcon : row.standard}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="it-services-callout">
        ${it.description}
        <a href="${it.link_href}">${it.link_text}</a>
      </div>

      <div class="section-cta">
        <p>${data.cta_headline}</p>
        <div class="hero-cta">
          ${data.ctas.map(cta => `
            <a href="${cta.href}" class="btn btn-${cta.variant} btn-lg">${cta.text}</a>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

// ── Metrics ───────────────────────────────────────────────────────────────────

function renderMetrics(data) {
  const section = document.getElementById('metrics');
  section.innerHTML = `
    <div class="container">
      <div class="metrics-grid">
        ${data.items.map(item => `
          <div class="metric-item">
            <div class="metric-value text-gradient">${item.value}</div>
            <p class="metric-label">${item.label}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ── Testimonials ──────────────────────────────────────────────────────────────

function renderTestimonials(data) {
  const section = document.getElementById('testimonials');
  section.innerHTML = `
    <div class="container">
      <div class="section-header">
        <span class="eyebrow">${data.eyebrow}</span>
        <h2>${data.section_title}</h2>
      </div>
      <div class="testimonials-grid">
        ${data.items.map(item => `
          <div class="card-glass testimonial-card">
            <div class="testimonial-quote-mark">&ldquo;</div>
            <p class="testimonial-text">${item.quote}</p>
            <div class="testimonial-author">
              <div class="testimonial-avatar">${item.initials}</div>
              <div>
                <p class="testimonial-name">${item.author}</p>
                <p class="testimonial-title">${item.title}</p>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ── Contact ───────────────────────────────────────────────────────────────────

function renderContact(data) {
  const section = document.getElementById('contact');
  const hs = data.hubspot || {};

  const fieldsHTML = data.form.fields.map(field => {
    if (field.type === 'textarea') {
      return `
        <div class="form-group">
          <label for="${field.name}">${field.label}</label>
          <textarea id="${field.name}" name="${field.name}"
            data-hs="${field.hubspot_name || field.name}"
            placeholder="${field.placeholder}" rows="${field.rows}"></textarea>
        </div>`;
    }
    return `
      <div class="form-group">
        <label for="${field.name}">${field.label}</label>
        <input type="${field.type}" id="${field.name}" name="${field.name}"
          data-hs="${field.hubspot_name || field.name}"
          placeholder="${field.placeholder}" ${field.required ? 'required' : ''}>
      </div>`;
  }).join('');

  section.innerHTML = `
    <div class="container">
      <div class="contact-inner">
        <span class="eyebrow">${data.eyebrow}</span>
        <h2>${data.section_title.replace('BORING?', '<span class="text-gradient">BORING?</span>')}</h2>
        <p>${data.section_description}</p>

        <div class="contact-quick-links">
          <a href="tel:${data.phone.replace(/\D/g, '').replace(/^/, '+')}" class="btn btn-primary">
            ${icon('phone')} ${data.phone}
          </a>
          <a href="mailto:${data.email}" class="btn btn-primary">
            ${icon('mail')} ${data.email}
          </a>
        </div>

        <div class="contact-form-card">
          <h3>${data.form.title}</h3>
          <div id="form-message" class="form-message" style="display:none"></div>
          <form id="contact-form" data-worker="${data.worker_url || ''}">
            <!-- Honeypot for spam prevention -->
            <div style="display:none !important" aria-hidden="true">
              <input type="text" name="b_phone" tabindex="-1" value="" autocomplete="off">
            </div>
            ${fieldsHTML}
            <!-- reCAPTCHA widget -->
            <div class="g-recaptcha" data-sitekey="6LcOWfEqAAAAAMBlevn_BldjtPx9QGPg6pXWKIQI" style="margin-bottom: 20px;"></div>
            <button type="submit" id="form-submit" class="btn btn-primary btn-lg" style="width:100%;margin-top:8px">
              ${data.form.submit_button}
            </button>
          </form>
        </div>

        <div class="trust-badges">
          ${data.trust_badges.map((b, i) => `
            <span>${b}</span>
            ${i < data.trust_badges.length - 1 ? '<div class="trust-dot"></div>' : ''}
          `).join('')}
        </div>
      </div>
    </div>
  `;

  document.getElementById('contact-form').addEventListener('submit', handleContactSubmit);
}

async function handleContactSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const btn = document.getElementById('form-submit');
  const msgBox = document.getElementById('form-message');

  // 1. Honeypot check
  const honeypot = form.querySelector('input[name="b_phone"]');
  if (honeypot && honeypot.value) {
    console.warn('Spam detected via honeypot.');
    showFormMessage(msgBox, 'success', "Thanks — we'll be in touch shortly!");
    form.reset();
    return;
  }

  // 2. reCAPTCHA check
  const token = grecaptcha.getResponse();
  if (!token) {
    showFormMessage(msgBox, 'error', 'Please complete the reCAPTCHA.');
    return;
  }

  const workerUrl = form.dataset.worker;
  if (!workerUrl || workerUrl.includes('your-worker-name')) {
    showFormMessage(msgBox, 'success', 'Message received — thank you! (Worker URL not yet configured.)');
    form.reset();
    grecaptcha.reset();
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Sending…';
  msgBox.style.display = 'none';

  const fields = Array.from(form.querySelectorAll('[data-hs]'))
    .filter(el => el.value.trim())
    .map(el => ({ name: el.dataset.hs, value: el.value.trim() }));

  const hutk = document.cookie.match(/(^|;)\s*hubspotutk=([^;]+)/)?.[2] || undefined;

  try {
    const res = await fetch(workerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
        fields,
        context: { hutk, pageUri: window.location.href, pageName: document.title }
      })
    });

    if (res.ok) {
      showFormMessage(msgBox, 'success', "Thanks — we'll be in touch shortly!");
      form.reset();
      grecaptcha.reset();
    } else {
      const err = await res.json().catch(() => ({}));
      showFormMessage(msgBox, 'error', err.message || 'Something went wrong. Please call us directly.');
      grecaptcha.reset();
    }
  } catch {
    showFormMessage(msgBox, 'error', `Network error. Please try calling 604-800-5781 directly.`);
    grecaptcha.reset();
  } finally {
    btn.disabled = false;
    btn.textContent = 'Send Message';
  }
}

function showFormMessage(el, type, text) {
  el.className = `form-message form-message--${type}`;
  el.textContent = text;
  el.style.display = 'block';
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ── Footer ────────────────────────────────────────────────────────────────────

function renderFooter(data) {
  const footer = document.getElementById('footer');
  footer.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="index.html" class="logo">
            <img src="public/logo.png" alt="Logo" style="width:32px;height:32px;border-radius:7px" onerror="this.style.display='none'">
            ${data.brand.name}
          </a>
          <p>${data.brand.tagline}</p>
          <div class="footer-social">
            <a href="${data.brand.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">
              ${icon('linkedin')}
            </a>
          </div>
        </div>
        ${data.sections.map(sec => `
          <div class="footer-section">
            <h4>${sec.title}</h4>
            <ul>
              ${sec.links.map(link => `
                <li>${link.href
      ? `<a href="${link.href}">${link.text}</a>`
      : link.text}
                </li>
              `).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
      <div class="footer-bottom">
        <p>${data.copyright}</p>
        <div class="footer-legal">
          ${data.legal_links.map(l => `<a href="${l.href}">${l.text}</a>`).join('')}
        </div>
      </div>
    </div>
    <div class="footer-signal"></div>
  `;
}

// ── Scroll animations ─────────────────────────────────────────────────────────

function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll(
    '.card-glass, .metric-item, .section-header, .it-services-callout, .contact-form-card'
  ).forEach((el, i) => {
    el.style.transitionDelay = `${(i % 8) * 55}ms`;
    el.classList.add('fade-in');
    observer.observe(el);
  });
}

// ── Nav scroll shadow ─────────────────────────────────────────────────────────

function handleAnchorLinks() {
  if (window.location.hash) {
    const el = document.getElementById(window.location.hash.slice(1));
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
  }
}

window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

document.addEventListener('DOMContentLoaded', loadContent);

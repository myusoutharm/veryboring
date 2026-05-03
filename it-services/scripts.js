let currentHeroSlide = 0;
let heroTimer;

const contentFiles = {
  navigation: 'content/navigation.json',
  hero: 'content/hero.json',
  services: 'content/services.json',
  'why-us': 'content/why-us.json',
  pricing: 'content/pricing.json',
  testimonials: 'content/testimonials.json',
  contact: 'content/contact.json',
  footer: 'content/footer.json'
};

const { createRecaptchaManager, loadAndRenderPage, normalizeRecaptchaConfig, submitContactForm } = window.VBTUtils;
const recaptchaManager = createRecaptchaManager();

async function loadContent() {
  try {
    await loadAndRenderPage({
      contentFiles,
      renderers: {
        navigation: renderNavigation,
        hero: renderHero,
        services: renderServices,
        'why-us': renderWhyUs,
        pricing: renderPricing,
        testimonials: renderTestimonials,
        contact: renderContact,
        footer: renderFooter
      },
      onAfterRender: () => {
        handleAnchorLinks();
        initHeroRotation();
        initScrollAnimations();
      }
    });
  } catch (error) {
    console.error('Error loading content:', error);
  }
}

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
      </div>
    `;
  }

  const nav = document.getElementById('nav-content');
  nav.innerHTML = `
    <a href="${data.home_href}" class="logo">${data.logo}</a>
    <ul class="nav-links" id="nav-links">
      ${data.links.map(link => `<li><a href="${link.href}">${link.text}</a></li>`).join('')}
      <li class="nav-mobile-cta"><a href="${data.cta.href}" class="btn btn-primary">${data.cta.text}</a></li>
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

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

// ── Hero Visuals ─────────────────────────────────────────────────────────────

function getHeroVisual(id) {
  const visuals = {
    security: `
      <div class="hero-dashboard">
        <div class="dash-titlebar">
          <span class="trafficlight red"></span>
          <span class="trafficlight yellow"></span>
          <span class="trafficlight green"></span>
          <span class="dash-label">Security Status</span>
        </div>
        <div class="dash-body">
          <div class="dash-row">
            <span class="dash-icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </span>
            <span class="dash-name">Firewall</span>
            <span class="badge ok">Protected</span>
          </div>
          <div class="dash-row">
            <span class="dash-icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </span>
            <span class="dash-name">Zero-Trust</span>
            <span class="badge ok">Active</span>
          </div>
          <div class="dash-row">
            <span class="dash-icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
            </span>
            <span class="dash-name">Monitoring</span>
            <span class="badge ok">24 / 7</span>
          </div>
          <div class="dash-row">
            <span class="dash-icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
            </span>
            <span class="dash-name">Endpoints</span>
            <span class="badge ok">12 / 12</span>
          </div>
        </div>
        <div class="dash-footer">
          <span class="pulse-dot"></span>All systems nominal
        </div>
      </div>`,

    management: `
      <div class="hero-terminal">
        <div class="dash-titlebar">
          <span class="trafficlight red"></span>
          <span class="trafficlight yellow"></span>
          <span class="trafficlight green"></span>
          <span class="dash-label">Terminal</span>
        </div>
        <div class="term-body">
          <div class="term-line dim">$ vbt status --all</div>
          <div class="term-line ok"><span class="term-check">✓</span> Endpoints <span class="term-val">12 / 12 online</span></div>
          <div class="term-line ok"><span class="term-check">✓</span> Backups <span class="term-val">ran 2 h ago</span></div>
          <div class="term-line ok"><span class="term-check">✓</span> Patches <span class="term-val">up to date</span></div>
          <div class="term-line ok"><span class="term-check">✓</span> Network <span class="term-val">latency 2 ms</span></div>
          <div class="term-line dim">$ <span class="cursor">_</span></div>
        </div>
      </div>`
  };
  return visuals[id] || '';
}

function renderHero(data) {
  const hero = document.getElementById('hero');
  const slidesHTML = data.slides.map((slide, i) => `
    <div class="hero-slide ${i === 0 ? 'active' : ''}">
      <div class="container">
        <div class="hero-slide-content">
          <div class="hero-text">
            <h1>${slide.headline}</h1>
            <p>${slide.subheadline}</p>
            <div class="hero-cta">
              ${slide.ctas.map(cta => `
                <a href="${cta.href}" class="btn btn-${cta.variant} btn-lg">${cta.text}</a>
              `).join('')}
            </div>
          </div>
          <div class="hero-visual">${getHeroVisual(slide.visual_id)}</div>
        </div>
      </div>
    </div>
  `).join('');

  const navHTML = `
    <div class="hero-nav">
      ${data.slides.map((_, i) => `
        <span class="hero-dot ${i === 0 ? 'active' : ''}" onclick="goToHeroSlide(${i})"></span>
      `).join('')}
    </div>
  `;

  hero.innerHTML = `<div class="hero-track">${slidesHTML}</div>${navHTML}`;
}

function renderServices(data) {
  const services = document.getElementById('services');
  services.innerHTML = `
    <div class="container">
      <div class="section-header">
        <h2>${data.section_title}</h2>
        <p>${data.section_description}</p>
      </div>
      <div class="grid">
        ${data.items.map(item => `
          <div class="card">
            <div class="card-icon">${item.icon}</div>
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <a href="${item.link}" class="read-more">Read More →</a>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderWhyUs(data) {
  const whyUs = document.getElementById('why-us');
  whyUs.innerHTML = `
    <div class="container">
      <div class="section-header">
        <h2>${data.section_title}</h2>
        <p>${data.section_description}</p>
      </div>
      <div class="grid grid-2">
        ${data.items.map(item => `
          <div class="card">
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <a href="${item.link}" class="read-more">Read More →</a>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderPricing(data) {
  const pricing = document.getElementById('pricing');
  pricing.innerHTML = `
    <div class="container">
      <div class="section-header">
        <h2>${data.section_title}</h2>
        <p>${data.section_description}</p>
      </div>
      <table class="pricing-table">
        <tr>
          <td><strong>${data.column_labels.type}</strong></td>
          <td><strong>${data.column_labels.rate}</strong></td>
        </tr>
        ${data.tiers.map(tier => `
          <tr>
            <td>${tier.name}</td>
            <td>${tier.price}</td>
          </tr>
        `).join('')}
      </table>
      <p class="pricing-reminder">${data.footnote}</p>
      <div class="pricing-cta">
        <a href="pricing.html" class="read-more">See Full Pricing Details →</a>
      </div>
    </div>
  `;
}

function renderTestimonials(data) {
  const testimonials = document.getElementById('testimonials');
  testimonials.innerHTML = `
    <div class="container">
      <div class="section-header">
        <h2>${data.section_title}</h2>
      </div>
      <div class="grid grid-2">
        ${data.items.map(item => `
          <div class="testimonial">
            <p class="testimonial-text">"${item.quote}"</p>
            <div class="testimonial-author">${item.author}</div>
            <div class="testimonial-title">${item.title}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderContact(data) {
  const contact = document.getElementById('contact');
  const hs = data.hubspot || {};
  const recaptchaConfig = normalizeRecaptchaConfig(data.recaptcha);

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

  contact.innerHTML = `
    <div class="container">
      <div class="contact-wrap">
        <div class="cta-section">
          <h2>${data.section_title}</h2>
          <p>${data.section_description}</p>
          <div class="hero-cta">
            ${data.ctas.map(cta => `
              <a href="${cta.href}" class="btn btn-${cta.variant} btn-lg">${cta.text}</a>
            `).join('')}
          </div>
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
            <button type="submit" id="form-submit" class="btn btn-primary btn-lg" style="width:100%">
              ${data.form.submit_button}
            </button>
          </form>
        </div>
      </div>
    </div>
  `;

  recaptchaManager.init(recaptchaConfig);

  document.getElementById('contact-form').addEventListener('submit', handleContactSubmit);
}

async function handleContactSubmit(event) {
  await submitContactForm(event, {
    getRecaptchaToken: () => recaptchaManager.getToken(),
    missingWorkerMode: 'error',
    missingWorkerMessage: 'Configuration error: Worker URL missing.'
  });
}

function renderFooter(data) {
  const footer = document.getElementById('footer');
  footer.innerHTML = `
    <div class="container">
      <div class="footer-links">
        <div class="footer-brand">
          <a href="index.html" class="logo">${data.brand.name}</a>
          <p>${data.brand.description}</p>
        </div>
        ${data.sections.map(section => `
          <div class="footer-section">
            <h4>${section.title}</h4>
            <ul>
              ${section.links.map(link => `
                <li>${link.href ? `<a href="${link.href}">${link.text}</a>` : link.text}</li>
              `).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
      <div class="footer-bottom">
        <p>${data.copyright} | ${data.legal_links.map(link => `<a href="${link.href}">${link.text}</a>`).join(' | ')}</p>
      </div>
    </div>
  `;
}

// ── Hero Carousel ─────────────────────────────────────────────────────────────

function goToHeroSlide(index) {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  if (!slides.length) return;
  slides.forEach(s => s.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));
  slides[index].classList.add('active');
  dots[index].classList.add('active');
  currentHeroSlide = index;
  clearInterval(heroTimer);
  initHeroRotation();
}

function initHeroRotation() {
  heroTimer = setInterval(() => {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length > 0) {
      currentHeroSlide = (currentHeroSlide + 1) % slides.length;
      goToHeroSlide(currentHeroSlide);
    }
  }, 8000);
}

// ── Scroll Animations ─────────────────────────────────────────────────────────

function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.card, .testimonial, .section-header, .pricing-table, .contact-wrap, .detailed-item').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 6) * 60}ms`;
    el.classList.add('fade-in');
    observer.observe(el);
  });
}

// ── Misc ──────────────────────────────────────────────────────────────────────

function handleAnchorLinks() {
  if (window.location.hash) {
    const targetId = window.location.hash.slice(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      setTimeout(() => targetElement.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }
}

window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  if (nav) {
    nav.style.boxShadow = window.scrollY > 10
      ? '0 10px 15px -3px rgb(0 0 0 / 0.1)'
      : 'none';
  }
});

document.addEventListener('DOMContentLoaded', loadContent);

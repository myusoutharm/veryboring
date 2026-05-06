import { createRecaptchaManager, escapeAttr, escapeHtml, loadAndRenderPage, normalizeRecaptchaConfig, submitContactForm } from '../shared/site-utils.js';
export { escapeAttr, escapeHtml } from '../shared/site-utils.js';

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

const recaptchaManager = createRecaptchaManager();
const IT_SERVICES_GA_ID = 'G-R4QKFE6RH4';

function initGoogleAnalytics(measurementId = IT_SERVICES_GA_ID) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (window.__itServicesGaInitialized) return;

  window.__itServicesGaInitialized = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };

  const gaSrc = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  if (!document.querySelector(`script[src="${gaSrc}"]`)) {
    const script = document.createElement('script');
    script.async = true;
    script.src = gaSrc;
    document.head.appendChild(script);
  }

  window.gtag('js', new Date());
  window.gtag('config', measurementId);
}

async function loadContent() {
  // Only run on the index page (which has a hero section)
  if (!document.getElementById('hero')) return;

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

export function renderNavigation(data) {
  const topBar = document.getElementById('top-bar');
  if (topBar) {
    topBar.innerHTML = `
      <div class="container">
        <div class="top-bar-content">
          ${data.branches.map(b => `
            <a href="${escapeAttr(b.href)}" class="${b.active ? 'active' : ''}">${escapeHtml(b.name)}</a>
          `).join('')}
        </div>
      </div>
    `;
  }

  const nav = document.getElementById('nav-content');
  nav.innerHTML = `
    <a href="${escapeAttr(data.home_href)}" class="logo">${escapeHtml(data.logo)}</a>
    <ul class="nav-links" id="nav-links">
      ${data.links.map(link => `<li><a href="${escapeAttr(link.href)}">${escapeHtml(link.text)}</a></li>`).join('')}
      <li class="nav-mobile-cta"><a href="${escapeAttr(data.cta.href)}" class="btn btn-primary">${escapeHtml(data.cta.text)}</a></li>
    </ul>
    <div class="nav-right">
      <a href="${escapeAttr(data.cta.href)}" class="btn btn-primary nav-cta-desktop">${escapeHtml(data.cta.text)}</a>
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
          <div class="term-line ok"><span class="term-check">\u2713</span> Endpoints <span class="term-val">12 / 12 online</span></div>
          <div class="term-line ok"><span class="term-check">\u2713</span> Backups <span class="term-val">ran 2 h ago</span></div>
          <div class="term-line ok"><span class="term-check">\u2713</span> Patches <span class="term-val">up to date</span></div>
          <div class="term-line ok"><span class="term-check">\u2713</span> Network <span class="term-val">latency 2 ms</span></div>
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
            <h1>${escapeHtml(slide.headline)}</h1>
            <p>${escapeHtml(slide.subheadline)}</p>
            <div class="hero-cta">
              ${slide.ctas.map(cta => `
                <a href="${escapeAttr(cta.href)}" class="btn btn-${escapeAttr(cta.variant)} btn-lg">${escapeHtml(cta.text)}</a>
              `).join('')}
            </div>
          </div>
          <div class="hero-visual">${getHeroVisual(String(slide.visual_id || ''))}</div>
        </div>
      </div>
    </div>
  `).join('');

  const navHTML = `
    <div class="hero-nav">
      ${data.slides.map((_, i) => `
        <button type="button" class="hero-dot ${i === 0 ? 'active' : ''}" data-slide="${i}" aria-label="Show slide ${i + 1}" aria-current="${i === 0 ? 'true' : 'false'}"></button>
      `).join('')}
    </div>
  `;

  hero.innerHTML = `<div class="hero-track">${slidesHTML}</div>${navHTML}`;

  // Attach slide dot click handlers (no inline event attributes)
  hero.querySelectorAll('.hero-dot').forEach((dot) => {
    dot.addEventListener('click', () => goToHeroSlide(Number(dot.dataset.slide)));
  });
}

function renderServices(data) {
  const services = document.getElementById('services');
  services.innerHTML = `
    <div class="container">
      <div class="section-header">
        <h2>${escapeHtml(data.section_title)}</h2>
        <p>${escapeHtml(data.section_description)}</p>
      </div>
      <div class="grid">
        ${data.items.map(item => `
          <div class="card">
            <div class="card-icon">${escapeHtml(item.icon)}</div>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.description)}</p>
            <a href="${escapeAttr(item.link)}" class="read-more">Read More \u2192</a>
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
        <h2>${escapeHtml(data.section_title)}</h2>
        <p>${escapeHtml(data.section_description)}</p>
      </div>
      <div class="grid grid-2">
        ${data.items.map(item => `
          <div class="card">
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.description)}</p>
            <a href="${escapeAttr(item.link)}" class="read-more">Read More \u2192</a>
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
        <h2>${escapeHtml(data.section_title)}</h2>
        <p>${escapeHtml(data.section_description)}</p>
      </div>
      <table class="pricing-table">
        <thead>
          <tr>
            <th>${escapeHtml(data.column_labels.type)}</th>
            <th>${escapeHtml(data.column_labels.rate)}</th>
          </tr>
        </thead>
        <tbody>
          ${data.tiers.map(tier => `
            <tr>
              <th scope="row" style="text-align: left;">${escapeHtml(tier.name)}</th>
              <td>${escapeHtml(tier.price)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <p class="pricing-reminder">${escapeHtml(data.footnote)}</p>
      <div class="pricing-cta">
        <a href="pricing.html" class="read-more">See Full Pricing Details \u2192</a>
      </div>
    </div>
  `;
}

function renderTestimonials(data) {
  const testimonials = document.getElementById('testimonials');
  testimonials.innerHTML = `
    <div class="container">
      <div class="section-header">
        <h2>${escapeHtml(data.section_title)}</h2>
      </div>
      <div class="grid grid-2">
        ${data.items.map(item => `
          <div class="testimonial">
            <p class="testimonial-text">"${escapeHtml(item.quote)}"</p>
            <div class="testimonial-author">${escapeHtml(item.author)}</div>
            <div class="testimonial-title">${escapeHtml(item.title)}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function renderContact(data) {
  const contact = document.getElementById('contact');
  const recaptchaConfig = normalizeRecaptchaConfig(data.recaptcha);

  const fieldsHTML = data.form.fields.map(field => {
    if (field.type === 'textarea') {
      return `
        <div class="form-group">
          <label for="${escapeAttr(field.name)}">${escapeHtml(field.label)}</label>
          <textarea id="${escapeAttr(field.name)}" name="${escapeAttr(field.name)}"
            data-hs="${escapeAttr(field.hubspot_name || field.name)}"
            placeholder="${escapeAttr(field.placeholder)}" rows="${escapeAttr(field.rows)}"></textarea>
        </div>`;
    }
    return `
      <div class="form-group">
        <label for="${escapeAttr(field.name)}">${escapeHtml(field.label)}</label>
        <input type="${escapeAttr(field.type)}" id="${escapeAttr(field.name)}" name="${escapeAttr(field.name)}"
          data-hs="${escapeAttr(field.hubspot_name || field.name)}"
          placeholder="${escapeAttr(field.placeholder)}" ${field.required ? 'required' : ''}>
      </div>`;
  }).join('');

  contact.innerHTML = `
    <div class="container">
      <div class="contact-wrap">
        <div class="cta-section">
          <h2>${escapeHtml(data.section_title)}</h2>
          <p>${escapeHtml(data.section_description)}</p>
          <div class="hero-cta">
            ${data.ctas.map(cta => `
              <a href="${escapeAttr(cta.href)}" class="btn btn-${escapeAttr(cta.variant)} btn-lg">${escapeHtml(cta.text)}</a>
            `).join('')}
          </div>
        </div>
        <div class="contact-form-card">
          <h3>${escapeHtml(data.form.title)}</h3>
          <div id="form-message" class="form-message" style="display:none"></div>
          <form id="contact-form" data-worker="${escapeAttr(data.worker_url || '')}">
            <!-- Honeypot for spam prevention -->
            <div style="display:none !important" aria-hidden="true">
              <input type="text" name="b_phone" tabindex="-1" value="" autocomplete="off">
            </div>
            ${fieldsHTML}
            <button type="submit" id="form-submit" class="btn btn-primary btn-lg" style="width:100%">
              ${escapeHtml(data.form.submit_button)}
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

export function renderFooter(data) {
  const footer = document.getElementById('footer');
  footer.innerHTML = `
    <div class="container">
      <div class="footer-links">
        <div class="footer-brand">
          <a href="index.html" class="logo">${escapeHtml(data.brand.name)}</a>
          <p>${escapeHtml(data.brand.description)}</p>
        </div>
        ${data.sections.map(section => `
          <div class="footer-section">
            <h4>${escapeHtml(section.title)}</h4>
            <ul>
              ${section.links.map(link => `
                <li>${link.href ? `<a href="${escapeAttr(link.href)}">${escapeHtml(link.text)}</a>` : escapeHtml(link.text)}</li>
              `).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
      <div class="footer-bottom">
        <p>${escapeHtml(data.copyright)} | ${data.legal_links.map(link => `<a href="${escapeAttr(link.href)}">${escapeHtml(link.text)}</a>`).join(' | ')}</p>
        <div class="footer-badges">
          <a class="footer-badge-link" href="https://sonarcloud.io/summary/new_code?id=myusoutharm_veryboring" target="_blank" rel="noopener noreferrer">
            <img src="https://sonarcloud.io/api/project_badges/measure?project=myusoutharm_veryboring&metric=alert_status" alt="SonarCloud Quality Gate">
          </a>
          <a class="footer-badge-link" href="https://codecov.io/gh/myusoutharm/veryboring" target="_blank" rel="noopener noreferrer">
            <img src="https://codecov.io/gh/myusoutharm/veryboring/graph/badge.svg?token=2XI5UAL2ZY" alt="Codecov">
          </a>
          <a class="footer-badge-link footer-badge-cloudflare" href="https://www.cloudflare.com/" target="_blank" rel="noopener noreferrer">
            <img src="../shared/BDES-5287_ProtectedByCloudflareBadge_web_badges_5.png" alt="Protected by Cloudflare">
          </a>
        </div>
      </div>
    </div>
  `;
}

// ── Hero Carousel ─────────────────────────────────────────────────────────────

export function goToHeroSlide(index) {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  if (!slides.length || index < 0 || index >= slides.length) return;
  slides.forEach(s => s.classList.remove('active'));
  dots.forEach(d => {
    d.classList.remove('active');
    d.setAttribute('aria-current', 'false');
  });
  slides[index].classList.add('active');
  if (dots[index]) {
    dots[index].classList.add('active');
    dots[index].setAttribute('aria-current', 'true');
  }
  currentHeroSlide = index;
  clearInterval(heroTimer);
  initHeroRotation();
}

export function initHeroRotation() {
  if (heroTimer) {
    clearInterval(heroTimer);
  }

  heroTimer = setInterval(() => {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length > 0) {
      currentHeroSlide = (currentHeroSlide + 1) % slides.length;
      goToHeroSlide(currentHeroSlide);
    }
  }, 8000);
}

// ── Scroll Animations ─────────────────────────────────────────────────────────

export function initScrollAnimations() {
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

export function handleAnchorLinks() {
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

initGoogleAnalytics();
document.addEventListener('DOMContentLoaded', loadContent);

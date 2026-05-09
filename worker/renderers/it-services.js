import { escAttr, escHtml } from "../escape.js";

export function buildItServicesPage(file, content) {
  const nav = renderItNavigation(content.navigation || {});
  const footer = renderItFooter(content.footer || {});

  if (file === "home.html" || file === "") {
    return {
      htmlById: {
        "top-bar": nav.topBar,
        "nav-content": nav.nav,
        hero: renderItHero(content.hero || {}),
        services: renderItServices(content.services || {}),
        "why-us": renderItWhyUs(content["why-us"] || {}),
        pricing: renderItPricing(content.pricing || {}),
        testimonials: renderItTestimonials(content.testimonials || {}),
        contact: renderItContact(content.contact || {}),
        footer,
      },
    };
  }

  if (file === "services.html") {
    const page = content.services_detailed || {};
    return {
      htmlById: {
        "top-bar": nav.topBar,
        "nav-content": nav.nav,
        "services-detailed": renderItServicesDetailed(page),
        contact: renderItContact(content.contact || {}),
        footer,
      },
      textById: {
        "page-title": page.page_title || "Our Managed IT Services",
        "page-intro": page.intro || "",
      },
    };
  }

  if (file === "pricing.html") {
    const page = content.pricing_detailed || {};
    return {
      htmlById: {
        "top-bar": nav.topBar,
        "nav-content": nav.nav,
        "pricing-plans": renderItPricingPlans(page),
        "common-features": renderItCommonFeatures(page),
        footer,
      },
      textById: {
        "page-title": page.page_title || "Transparent Pricing Plans",
        "page-intro": page.intro || "",
        "pricing-footnote": page.footnote || "",
      },
    };
  }

  if (file === "why-us.html") {
    const page = content.why_us_detailed || {};
    return {
      htmlById: {
        "top-bar": nav.topBar,
        "nav-content": nav.nav,
        "why-us-detailed": renderItWhyUsDetailed(page),
        footer,
      },
      textById: {
        "page-title": page.page_title || "Why Choose Very Boring IT?",
        "page-intro": page.intro || "",
      },
    };
  }

  return null;
}

function renderItNavigation(data) {
  const topBar = `<div class="container"><div class="top-bar-content">${(data.branches || []).map((b) => `<a href="${escAttr(b.href || "#")}" class="${b.active ? "active" : ""}">${escHtml(b.name || "")}</a>`).join("")}</div></div>`;
  const nav = `
    <a href="${escAttr(data.home_href || "index.html")}" class="logo">
      ${escHtml(data.logo || "")}
      <svg class="logo-tetris" viewBox="0 0 30 30" width="30" height="30" aria-hidden="true" focusable="false">
        <!-- Grid Background -->
        <circle cx="6" cy="4" r="2.2" class="tet-bg" />
        <circle cx="15" cy="4" r="2.2" class="tet-bg" />
        <circle cx="24" cy="4" r="2.2" class="tet-bg" />
        
        <circle cx="6" cy="9.5" r="2.2" class="tet-bg" />
        <circle cx="15" cy="9.5" r="2.2" class="tet-bg" />
        <circle cx="24" cy="9.5" r="2.2" class="tet-bg" />
        
        <circle cx="6" cy="15" r="2.2" class="tet-bg" />
        <circle cx="15" cy="15" r="2.2" class="tet-bg" />
        <circle cx="24" cy="15" r="2.2" class="tet-bg" />
        
        <circle cx="6" cy="20.5" r="2.2" class="tet-bg" />
        <circle cx="15" cy="20.5" r="2.2" class="tet-bg" />
        <circle cx="24" cy="20.5" r="2.2" class="tet-bg" />
        
        <circle cx="6" cy="26" r="2.2" class="tet-bg" />
        <circle cx="15" cy="26" r="2.2" class="tet-bg" />
        <circle cx="24" cy="26" r="2.2" class="tet-bg" />

        <!-- Row 5 (Bottom) -->
        <circle cx="6" cy="26" r="2.2" fill="#7dd3fc" class="tet-r5-l" />
        <circle cx="24" cy="26" r="2.2" fill="#6ee7b7" class="tet-r5-r" />
        <circle cx="15" cy="26" r="2.2" fill="#ffd166" class="tet-r5-m" />

        <!-- Row 4 -->
        <circle cx="6" cy="20.5" r="2.2" fill="#c084fc" class="tet-r4-l" />
        <circle cx="24" cy="20.5" r="2.2" fill="#f87171" class="tet-r4-r" />
        <circle cx="15" cy="20.5" r="2.2" fill="#7dd3fc" class="tet-r4-m" />

        <!-- Row 3 -->
        <circle cx="6" cy="15" r="2.2" fill="#6ee7b7" class="tet-r3-l" />
        <circle cx="24" cy="15" r="2.2" fill="#ffd166" class="tet-r3-r" />
        <circle cx="15" cy="15" r="2.2" fill="#c084fc" class="tet-r3-m" />

        <!-- Row 2 -->
        <circle cx="6" cy="9.5" r="2.2" fill="#f87171" class="tet-r2-l" />
        <circle cx="24" cy="9.5" r="2.2" fill="#7dd3fc" class="tet-r2-r" />
        <circle cx="15" cy="9.5" r="2.2" fill="#6ee7b7" class="tet-r2-m" />

        <!-- Row 1 (Top) -->
        <circle cx="6" cy="4" r="2.2" fill="#ffd166" class="tet-r1-l" />
        <circle cx="24" cy="4" r="2.2" fill="#c084fc" class="tet-r1-r" />
        <circle cx="15" cy="4" r="2.2" fill="#f87171" class="tet-r1-m" />
      </svg>
    </a>
    <ul class="nav-links" id="nav-links">
      ${(data.links || []).map((l) => `<li><a href="${escAttr(l.href || "#")}">${escHtml(l.text || "")}</a></li>`).join("")}
      <li class="nav-mobile-cta"><a href="${escAttr(data?.cta?.href || "#")}" class="btn btn-primary">${escHtml(data?.cta?.text || "Contact Us")}</a></li>
    </ul>
    <div class="nav-right">
      <a href="${escAttr(data?.cta?.href || "#")}" class="btn btn-primary nav-cta-desktop">${escHtml(data?.cta?.text || "Contact Us")}</a>
      <button class="hamburger" id="hamburger" aria-label="Toggle menu" aria-expanded="false"><span></span><span></span><span></span></button>
    </div>`;
  return { topBar, nav };
}

function renderItHero(data) {
  const slides = (data.slides || []).map((slide, i) => `
    <div class="hero-slide ${i === 0 ? "active" : ""}">
      <div class="container">
        <div class="hero-slide-content">
          <div class="hero-text">
            <h1>${escHtml(slide.headline || "")}</h1>
            <p>${escHtml(slide.subheadline || "")}</p>
            <div class="hero-cta">${(slide.ctas || []).map((cta) => `<a href="${escAttr(cta.href || "#")}" class="btn btn-${escAttr(cta.variant || "primary")} btn-lg">${escHtml(cta.text || "")}</a>`).join("")}</div>
          </div>
        </div>
      </div>
    </div>`);
  return `<div class="hero-track">${slides.join("")}</div>`;
}

function renderItServices(data) {
  return `
    <div class="container">
      <div class="section-header"><h2>${escHtml(data.section_title || "")}</h2><p>${escHtml(data.section_description || "")}</p></div>
      <div class="grid">${(data.items || []).map((item) => `<article class="card"><h3>${escHtml(item.title || "")}</h3><p>${escHtml(item.description || "")}</p><a href="${escAttr(item.link || "#")}" class="read-more">Read More</a></article>`).join("")}</div>
    </div>`;
}

function renderItWhyUs(data) {
  return `
    <div class="container">
      <div class="section-header"><h2>${escHtml(data.section_title || "")}</h2><p>${escHtml(data.section_description || "")}</p></div>
      <div class="grid grid-2">${(data.items || []).map((item) => `<article class="card"><h3>${escHtml(item.title || "")}</h3><p>${escHtml(item.description || "")}</p><a href="${escAttr(item.link || "#")}" class="read-more">Read More</a></article>`).join("")}</div>
    </div>`;
}

function renderItPricing(data) {
  return `
    <div class="container">
      <div class="section-header"><h2>${escHtml(data.section_title || "")}</h2><p>${escHtml(data.section_description || "")}</p></div>
      <table class="pricing-table">
        <thead>
          <tr>
            <th>${escHtml(data?.column_labels?.type || "")}</th>
            <th>${escHtml(data?.column_labels?.rate || "")}</th>
          </tr>
        </thead>
        <tbody>
          ${(data.tiers || []).map((tier) => `<tr><th scope="row" style="text-align: left;">${escHtml(tier.name || "")}</th><td>${escHtml(tier.price || "")}</td></tr>`).join("")}
        </tbody>
      </table>
      <p class="pricing-reminder">${escHtml(data.footnote || "")}</p>
      <div class="pricing-cta"><a href="pricing.html" class="read-more">See Full Pricing Details</a></div>
    </div>`;
}

function renderItTestimonials(data) {
  return `
    <div class="container">
      <div class="section-header"><h2>${escHtml(data.section_title || "")}</h2></div>
      <div class="grid grid-2">${(data.items || []).map((item) => `<article class="testimonial"><p class="testimonial-text">"${escHtml(item.quote || "")}"</p><div class="testimonial-author">${escHtml(item.author || "")}</div><div class="testimonial-title">${escHtml(item.title || "")}</div></article>`).join("")}</div>
    </div>`;
}

function renderItContact(data) {
  const fields = data?.form?.fields || [];
  const ctas = data.ctas || [];
  return `
    <div class="container">
      <div class="contact-wrap">
        <div class="cta-section">
          <h2>${escHtml(data.section_title || "")}</h2>
          <p>${escHtml(data.section_description || "")}</p>
          <div class="hero-cta">${ctas.map((cta) => `<a href="${escAttr(cta.href || "#")}" class="btn btn-${escAttr(cta.variant || "outline-white")} btn-lg">${escHtml(cta.text || "")}</a>`).join("")}</div>
        </div>
        <div class="contact-form-card">
          <h3>${escHtml(data?.form?.title || "Get in Touch")}</h3>
          <form>
            ${fields.map((field) => `<div class="form-group"><label>${escHtml(field.label || "")}</label><p>${escHtml(field.placeholder || "")}</p></div>`).join("")}
          </form>
        </div>
      </div>
    </div>`;
}

function renderItFooter(data) {
  return `
    <div class="container">
      <div class="footer-links">
        <div class="footer-brand"><a href="home.html" class="logo">${escHtml(data?.brand?.name || "")}</a><p>${escHtml(data?.brand?.description || "")}</p></div>
        ${(data.sections || []).map((section) => `<div class="footer-section"><h4>${escHtml(section.title || "")}</h4><ul>${(section.links || []).map((link) => `<li>${link.href ? `<a href="${escAttr(link.href)}">${escHtml(link.text || "")}</a>` : escHtml(link.text || "")}</li>`).join("")}</ul></div>`).join("")}
      </div>
      <div class="footer-bottom"><p>${escHtml(data.copyright || "")}</p><div class="footer-badges"><a href="https://sonarcloud.io/summary/new_code?id=myusoutharm_veryboring" target="_blank" rel="noopener noreferrer"><img src="https://sonarcloud.io/api/project_badges/measure?project=myusoutharm_veryboring&metric=alert_status" alt="Quality Gate Status"></a><a href="https://codecov.io/gh/myusoutharm/veryboring" target="_blank" rel="noopener noreferrer"><img src="https://codecov.io/gh/myusoutharm/veryboring/graph/badge.svg?token=2XI5UAL2ZY" alt="codecov"></a></div></div>
    </div>`;
}

function renderItServicesDetailed(data) {
  return (data.services || []).map((service) => `
    <section id="${escAttr(service.id || "")}" class="detailed-item section-white">
      <div class="detailed-grid">
        <div class="detailed-info">
          <h2>${escHtml(service.title || "")}</h2>
          <p>${escHtml(service.full_description || "")}</p>
          <ul class="feature-list">${(service.features || []).map((f) => `<li>${escHtml(f || "")}</li>`).join("")}</ul>
        </div>
      </div>
    </section>`).join("");
}

function renderItPricingPlans(data) {
  return (data.plans || []).map((plan) => `
    <article class="pricing-card-detailed card">
      <h3>${escHtml(plan.name || "")}</h3>
      <div class="price-box"><span class="amount">${escHtml(plan.price || "")}</span> <span class="term">${escHtml(plan.term || "")}</span></div>
      <p class="plan-desc">${escHtml(plan.description || "")}</p>
      <ul class="feature-list" style="grid-template-columns: 1fr; margin-bottom: 24px;">${(plan.features || []).map((f) => `<li>${escHtml(f || "")}</li>`).join("")}</ul>
      <div class="plan-best-for"><strong>Best for:</strong> ${escHtml(plan.best_for || "")}</div>
    </article>`).join("");
}

function renderItCommonFeatures(data) {
  return (data.common_features || []).map((item) => `<article class="card" style="text-align: center;"><h4>${escHtml(item.title || "")}</h4><p>${escHtml(item.desc || "")}</p></article>`).join("");
}

function renderItWhyUsDetailed(data) {
  return (data.differentiators || []).map((diff) => `
    <section id="${escAttr(diff.id || "")}" class="detailed-item section-white">
      <div class="detailed-info">
        <h2>${escHtml(diff.title || "")}</h2>
        <p>${escHtml(diff.full_description || "")}</p>
        <div class="benefits-grid">${(diff.benefits || []).map((b) => `<div class="benefit-tag">${escHtml(b || "")}</div>`).join("")}</div>
      </div>
    </section>`).join("");
}

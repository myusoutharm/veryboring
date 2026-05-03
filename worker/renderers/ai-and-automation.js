import { escAttr, escHtml } from "../escape.js";

export function buildAiAndAutomationPage(file, content) {
  const nav = renderAiNavigation(content.navigation || {});
  const footer = renderAiFooter(content.footer || {});
  const contact = renderAiContact(content.contact || {});

  if (file === "pricing.html") {
    return {
      htmlById: {
        "top-bar": nav.topBar,
        "nav-content": nav.nav,
        "pricing-comparison": renderAiDetailedPricing(content.pricing_detailed || {}),
        "pricing-faq": renderAiFaqs(content.pricing_detailed?.faqs || []),
        contact: contact,
        footer: footer,
      },
      textById: {
        "page-title": content.pricing_detailed?.page_title || "Pricing & Options",
        "page-intro": content.pricing_detailed?.intro || "",
      },
    };
  }

  if (file === "services.html") {
    return {
      htmlById: {
        "top-bar": nav.topBar,
        "nav-content": nav.nav,
        "services-detailed": renderAiDetailedServices(content.services_detailed || {}),
        contact: contact,
        footer: footer,
      },
      textById: {
        "page-title": content.services_detailed?.page_title || "AI Services",
        "page-intro": content.services_detailed?.intro || "",
      },
    };
  }

  return {
    htmlById: {
      "top-bar": nav.topBar,
      "nav-content": nav.nav,
      hero: renderAiHero(content.hero || {}),
      services: renderAiServices(content.services || {}),
      process: renderAiProcess(content.process || {}),
      "launch-partner": renderAiLaunchPartner(content["launch-partner"] || {}),
      pricing: renderAiPricing(content.pricing || {}),
      metrics: renderAiMetrics(content.metrics || {}),
      testimonials: renderAiTestimonials(content.testimonials || {}),
      contact: contact,
      footer: footer,
    },
  };
}

function renderAiNavigation(data) {
  const topBar = `<div class="container"><div class="top-bar-content">${(data.branches || []).map((b) => `<a href="${escAttr(b.href || "#")}" class="${b.active ? "active" : ""}">${escHtml(b.name || "")}</a>`).join("")}</div></div>`;
  const nav = `
    <a href="${escAttr(data.home_href || "index.html")}" class="logo">${escHtml(data.logo || "")}</a>
    <ul class="nav-links" id="nav-links">
      ${(data.links || []).map((l) => `<li><a href="${escAttr(l.href || "#")}" class="${l.highlight ? "nav-highlight" : ""}">${escHtml(l.text || "")}</a></li>`).join("")}
      <li class="nav-mobile-cta"><a href="${escAttr(data?.cta?.href || "#")}" class="btn btn-primary">${escHtml(data?.cta?.text || "Get Started")}</a></li>
    </ul>
    <div class="nav-right">
      <a href="${escAttr(data?.cta?.href || "#")}" class="btn btn-primary nav-cta-desktop">${escHtml(data?.cta?.text || "Get Started")}</a>
      <button class="hamburger" id="hamburger" aria-label="Toggle menu" aria-expanded="false"><span></span><span></span><span></span></button>
    </div>`;
  return { topBar, nav };
}

function renderAiHero(data) {
  return `
    <div class="hero-content container">
      <p class="hero-eyebrow">${escHtml(data.eyebrow || "")}</p>
      <h1><span>${escHtml(data.headline_plain || "")}</span> <span class="text-gradient">${escHtml(data.headline_gradient || "")}</span></h1>
      <p>${escHtml(data.subheadline || "")}</p>
      <div class="hero-cta">${(data.ctas || []).map((cta) => `<a href="${escAttr(cta.href || "#")}" class="btn btn-${escAttr(cta.variant || "primary")} btn-lg">${escHtml(cta.text || "")}</a>`).join("")}</div>
    </div>`;
}

function renderAiServices(data) {
  return `
    <div class="container">
      <div class="section-header"><span class="eyebrow">${escHtml(data.eyebrow || "")}</span><h2>${escHtml(data.section_title || "")}</h2><p>${escHtml(data.section_description || "")}</p></div>
      <div class="services-grid">${(data.items || []).map((item) => `<article class="card-glass service-card"><h3>${escHtml(item.title || "")}</h3><p>${escHtml(item.description || "")}</p></article>`).join("")}</div>
      <div class="it-services-callout">${escHtml(data?.it_services_callout?.text || "")} <a href="${escAttr(data?.it_services_callout?.link_href || "/it-services")}">${escHtml(data?.it_services_callout?.link_text || "See our IT Services")}</a></div>
    </div>`;
}

function renderAiProcess(data) {
  return `
    <div class="container">
      <div class="section-header"><span class="eyebrow">${escHtml(data.eyebrow || "")}</span><h2>${escHtml(data.section_title || "")}</h2><p>${escHtml(data.section_description || "")}</p></div>
      <div class="process-grid">${(data.steps || []).map((step) => `<article class="card-glass process-card"><div class="process-number">${escHtml(step.number || "")}</div><h3>${escHtml(step.title || "")}</h3><p>${escHtml(step.description || "")}</p></article>`).join("")}</div>
    </div>`;
}

function renderAiLaunchPartner(data) {
  return `
    <div class="container">
      <div class="section-header"><h2>${escHtml(data.section_title || "")}</h2><p>${escHtml(data.headline || "")}</p></div>
      <div class="lp-grid">
        <article class="card-glass lp-card"><h3>${escHtml(data?.what_you_get?.title || "")}</h3><ul class="lp-list">${(data?.what_you_get?.items || []).map((item) => `<li><span>${escHtml(item || "")}</span></li>`).join("")}</ul></article>
        <article class="card-glass lp-card"><h3>${escHtml(data?.what_we_need?.title || "")}</h3><ul class="lp-list">${(data?.what_we_need?.items || []).map((item) => `<li><span>${escHtml(item || "")}</span></li>`).join("")}</ul></article>
      </div>
      <div class="section-cta"><p>${escHtml(data.cta_headline || "")}</p></div>
    </div>`;
}

function renderAiPricing(data) {
  const rows = data?.automation?.rows || [];
  const cols = data?.automation?.columns || ["Feature", "Launch Partner", "Standard"];
  return `
    <div class="container">
      <div class="section-header"><span class="eyebrow">${escHtml(data.eyebrow || "")}</span><h2>${escHtml(data.section_title || "")}</h2><p>${escHtml(data.section_description || "")}</p></div>
      <table class="pricing-table"><thead><tr><th>${escHtml(cols[0] || "")}</th><th>${escHtml(cols[1] || "")}</th><th>${escHtml(cols[2] || "")}</th></tr></thead><tbody>
      ${rows.map((row) => `<tr><td>${escHtml(row.feature || "")}</td><td>${escHtml(formatPricingValue(row.launch))}</td><td>${escHtml(formatPricingValue(row.standard))}</td></tr>`).join("")}
      </tbody></table>
      <div class="it-services-callout">${escHtml(data?.it_services?.description || "")} <a href="${escAttr(data?.it_services?.link_href || "/it-services/pricing.html")}">${escHtml(data?.it_services?.link_text || "Full IT pricing details")}</a></div>
    </div>`;
}

function renderAiMetrics(data) {
  return `<div class="container"><div class="metrics-grid">${(data.items || []).map((item) => `<article class="metric-item"><div class="metric-value text-gradient">${escHtml(item.value || "")}</div><p class="metric-label">${escHtml(item.label || "")}</p></article>`).join("")}</div></div>`;
}

function renderAiTestimonials(data) {
  return `
    <div class="container">
      <div class="section-header"><span class="eyebrow">${escHtml(data.eyebrow || "")}</span><h2>${escHtml(data.section_title || "")}</h2></div>
      <div class="testimonials-grid">${(data.items || []).map((item) => `<article class="card-glass testimonial-card"><p class="testimonial-text">${escHtml(item.quote || "")}</p><p class="testimonial-name">${escHtml(item.author || "")}</p><p class="testimonial-title">${escHtml(item.title || "")}</p></article>`).join("")}</div>
    </div>`;
}

function renderAiContact(data) {
  const fields = data?.form?.fields || [];
  return `
    <div class="container">
      <div class="contact-inner">
        <span class="eyebrow">${escHtml(data.eyebrow || "")}</span>
        <h2>${escHtml(data.section_title || "")}</h2>
        <p>${escHtml(data.section_description || "")}</p>
        <div class="contact-form-card">
          <h3>${escHtml(data?.form?.title || "Get in Touch")}</h3>
          <form>
            ${fields.map((field) => `<div class="form-group"><label>${escHtml(field.label || "")}</label><p>${escHtml(field.placeholder || "")}</p></div>`).join("")}
          </form>
        </div>
      </div>
    </div>`;
}

function renderAiFooter(data) {
  return `
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand"><a href="index.html" class="logo">${escHtml(data?.brand?.name || "")}</a><p>${escHtml(data?.brand?.tagline || "")}</p></div>
        ${(data.sections || []).map((section) => `<div class="footer-section"><h4>${escHtml(section.title || "")}</h4><ul>${(section.links || []).map((link) => `<li>${link.href ? `<a href="${escAttr(link.href)}">${escHtml(link.text || "")}</a>` : escHtml(link.text || "")}</li>`).join("")}</ul></div>`).join("")}
      </div>
      <div class="footer-bottom"><p>${escHtml(data.copyright || "")}</p><a href="https://sonarcloud.io/summary/new_code?id=myusoutharm_veryboring" target="_blank" rel="noopener noreferrer"><img src="https://sonarcloud.io/api/project_badges/measure?project=myusoutharm_veryboring&metric=alert_status" alt="Quality Gate Status"></a></div>
    </div>`;
}

function renderAiDetailedPricing(data) {
  const comp = data.comparison || {};
  const rows = comp.rows || [];
  const cols = comp.columns || [];
  return `
    <h2 id="comparison-title">${escHtml(comp.title || "Comparison")}</h2>
    <div style="overflow-x: auto;">
      <table class="pricing-table">
        <thead><tr>${cols.map((c) => `<th>${escHtml(c)}</th>`).join("")}</tr></thead>
        <tbody>
          ${rows.map((r) => `<tr><td style="font-weight:600">${escHtml(r.feature)}</td><td style="color:var(--purple);font-weight:700">${escHtml(r.launch)}</td><td>${escHtml(r.standard)}</td></tr>`).join("")}
        </tbody>
      </table>
    </div>
    <p id="table-footnote">${escHtml(comp.footnote || "")}</p>`;
}

function renderAiFaqs(faqs) {
  return `
    <div class="section-header"><h2>Frequently Asked Questions</h2></div>
    <div id="faq-list" style="max-width:800px;margin:0 auto;display:grid;gap:30px">
      ${faqs.map((f) => `<div class="card-glass" style="padding:24px"><h3>${escHtml(f.question)}</h3><p>${escHtml(f.answer)}</p></div>`).join("")}
    </div>`;
}

function renderAiDetailedServices(data) {
  return (data.services || [])
    .map(
      (s) => `
    <section id="${escAttr(s.id)}" class="detailed-item">
      <h2>${escHtml(s.title)}</h2>
      <p>${escHtml(s.full_description)}</p>
      <ul>${(s.features || []).map((f) => `<li>${escHtml(f)}</li>`).join("")}</ul>
    </section>`
    )
    .join("");
}

function formatPricingValue(value) {
  if (value === true) return "Included";
  if (value === false) return "Not included";
  return String(value || "");
}

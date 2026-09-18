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

  if (file === "products.html" || file === "product.html") {
    return {
      htmlById: {
        "top-bar": nav.topBar,
        "nav-content": nav.nav,
        "products-list": renderAiProducts(content.products || {}),
        contact: contact,
        footer: footer,
      },
      textById: {
        "page-title": content.products?.page_title || "Products",
        "page-intro": content.products?.intro || "",
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
    <a href="${escAttr(data.home_href || "index.html")}" class="logo">${escHtml(data.logo || "")}<svg class="logo-pacman" viewBox="0 0 100 100" width="30" height="30" aria-hidden="true" focusable="false"><defs><radialGradient id="navChompGrad" cx="35%" cy="35%" r="75%"><stop offset="0%" stop-color="#fff1b8"/><stop offset="55%" stop-color="#ffd166"/><stop offset="100%" stop-color="#e8a93a"/></radialGradient></defs><path class="jaw-top" d="M50,50 L50,4 A46,46 0 0,1 96,50 Z" fill="url(#navChompGrad)"/><path class="jaw-bot" d="M50,50 L96,50 A46,46 0 0,1 50,96 Z" fill="url(#navChompGrad)"/><path d="M50,4 A46,46 0 0,0 50,96 L50,50 Z" fill="url(#navChompGrad)"/></svg></a>
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
      <p class="hero-eyebrow">${escHtml(data.eyebrow || "").replace(/boring/gi, '<span class="boring-vanish">$&</span>')}</p>
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
      <table class="pricing-table"><thead><tr>${cols.map((c) => `<th>${escHtml(c)}</th>`).join("")}</tr></thead><tbody>
      ${rows.map((row) => `<tr><th scope="row">${escHtml(row.feature || "")}</th><td>${escHtml(formatPricingValue(row.launch))}</td><td>${escHtml(formatPricingValue(row.saas))}</td><td>${escHtml(formatPricingValue(row.standard))}</td></tr>`).join("")}
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
        <div class="footer-brand"><a href="home.html" class="logo">${escHtml(data?.brand?.name || "")}</a><p>${escHtml(data?.brand?.tagline || "")}</p></div>
        ${(data.sections || []).map((section) => `<div class="footer-section"><h4>${escHtml(section.title || "")}</h4><ul>${(section.links || []).map((link) => `<li>${link.href ? `<a href="${escAttr(link.href)}">${escHtml(link.text || "")}</a>` : escHtml(link.text || "")}</li>`).join("")}</ul></div>`).join("")}
      </div>
      <div class="footer-bottom"><p>${escHtml(data.copyright || "")}</p><div class="footer-badges"><a href="https://sonarcloud.io/summary/new_code?id=myusoutharm_veryboring" target="_blank" rel="noopener noreferrer"><img src="https://sonarcloud.io/api/project_badges/measure?project=myusoutharm_veryboring&metric=alert_status" alt="Quality Gate Status"></a><a href="https://codecov.io/gh/myusoutharm/veryboring" target="_blank" rel="noopener noreferrer"><img src="https://codecov.io/gh/myusoutharm/veryboring/graph/badge.svg?token=2XI5UAL2ZY" alt="codecov"></a></div></div>
    </div>`;
}

function renderAiDetailedPricing(data) {
  const comp = data.comparison || {};
  const rows = comp.rows || [];
  const cols = comp.columns || [];

  const dataKeys = rows.length > 0
    ? Object.keys(rows[0]).filter(k => k !== "feature")
    : [];

  return `
    <h2 id="comparison-title">${escHtml(comp.title || "Comparison")}</h2>
    <div style="overflow-x: auto;">
      <table class="pricing-table">
        <thead><tr>${cols.map((c) => `<th>${escHtml(c)}</th>`).join("")}</tr></thead>
        <tbody>
          ${rows.map((r) => `
            <tr>
              <th scope="row" style="text-align:left; font-weight:600">${escHtml(r.feature)}</th>
              ${dataKeys.map((k, i) => `
                <td style="${i === 0 ? "color:var(--purple);font-weight:700" : ""}">${escHtml(r[k])}</td>
              `).join("")}
            </tr>`).join("")}
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

function renderAiProducts(data) {
  const products = data.products || [];
  return products.map((p) => `
    <article class="product-row-card" data-url="${escAttr(p.url || "#")}" tabindex="0" role="link" aria-label="${escAttr(p.name || "")} - ${escAttr(p.tagline || "")}">
      <div class="product-row-grid">
        <div class="product-row-info">
          <div class="product-badge-row">
            <span class="product-badge badge-${escAttr(p.badge_color || "purple")}">${escHtml(p.badge || "")}</span>
          </div>
          <h2 class="product-title">
            <a href="${escAttr(p.url || "#")}" class="product-title-link">${escHtml(p.name || "")}</a>
          </h2>
          <p class="product-tagline">${escHtml(p.tagline || "")}</p>
          <div class="product-narrative">
            <div class="narrative-block">
              <span class="narrative-label">Operational Problem:</span>
              <p>${escHtml(p.problem || "")}</p>
            </div>
            <div class="narrative-block">
              <span class="narrative-label">Frontline Solution:</span>
              <p>${escHtml(p.solution || "")}</p>
            </div>
          </div>
          <ul class="product-features">
            ${(p.features || []).map((f) => `<li><span class="feature-check" aria-hidden="true">✔</span><span>${escHtml(f)}</span></li>`).join("")}
          </ul>
          <div class="product-metrics-strip">
            ${(p.metrics || []).map((m) => `
              <div class="product-metric-item">
                <span class="metric-val">${escHtml(m.value || "")}</span>
                <span class="metric-lbl">${escHtml(m.label || "")}</span>
              </div>
            `).join("")}
          </div>
          <div class="product-actions">
            <a href="${escAttr(p.url || "#")}" class="btn btn-primary btn-product">
              ${escHtml(p.cta_text || "Explore Product")} <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
        <div class="product-row-visual">
          ${renderAiProductVisual(p)}
        </div>
      </div>
    </article>
  `).join("");
}

function renderAiProductVisual(p) {
  if (p.visual_type === "mockup_easysignout") {
    return `
      <div class="mockup-window">
        <div class="mockup-window-header"><span class="mock-dot red"></span><span class="mock-dot yellow"></span><span class="mock-dot green"></span><span class="mockup-window-title">tab.easysignout.com • Live Kiosk</span></div>
        <div class="mockup-window-body">
          <div class="mockup-row mockup-head"><span>Device</span><span>Status</span><span>Staff / Holder</span><span>Time</span></div>
          <div class="mockup-row"><span class="device-name"><span class="icon-dot out"></span> iPad Pro #12</span><span class="badge-status out">Checked Out</span><span>J. Martinez</span><span class="time-muted">9:14 AM</span></div>
          <div class="mockup-row"><span class="device-name"><span class="icon-dot in"></span> iPad Air #03</span><span class="badge-status in">Available</span><span class="time-muted">Dock 2</span><span class="time-muted">—</span></div>
          <div class="mockup-row"><span class="device-name"><span class="icon-dot out"></span> iPad Mini #07</span><span class="badge-status out">Checked Out</span><span>T. Nguyen</span><span class="time-muted">8:52 AM</span></div>
          <div class="mockup-row"><span class="device-name"><span class="icon-dot in"></span> iPad Pro #09</span><span class="badge-status in">Available</span><span class="time-muted">Dock 5</span><span class="time-muted">—</span></div>
        </div>
        <div class="mockup-window-footer"><span><strong>12</strong> Total Fleet</span><span class="stat-ok"><strong>8</strong> Available</span><span class="stat-alert"><strong>4</strong> Out</span><span class="mockup-live"><span class="live-pulse"></span> Live Kiosk</span></div>
      </div>`;
  }
  if (p.visual_type === "mockup_edisync") {
    return `
      <div class="mockup-window">
        <div class="mockup-window-header"><span class="mock-dot red"></span><span class="mock-dot yellow"></span><span class="mock-dot green"></span><span class="mockup-window-title">EDISync • Overnight EDI 810 Audit</span></div>
        <div class="mockup-window-body">
          <div class="mockup-stats-strip">
            <div class="stat-cell"><span class="stat-num">12</span><span class="stat-lbl">Invoices</span></div>
            <div class="stat-cell alert"><span class="stat-num">3</span><span class="stat-lbl">Price Alerts</span></div>
            <div class="stat-cell"><span class="stat-num">100%</span><span class="stat-lbl">Audited</span></div>
          </div>
          <div class="mockup-row mockup-head"><span>Item Description</span><span>Contract</span><span>Invoiced</span><span>Status</span></div>
          <div class="mockup-row"><span>Chicken Breast 40lb</span><span>$3.15/lb</span><span>$3.15/lb</span><span class="badge-status in">✓ Match</span></div>
          <div class="mockup-row alert-highlight"><span>Salmon Fillet 10lb</span><span>$12.80/lb</span><span class="price-mismatch">$14.20/lb</span><span class="badge-status out">⚠ Overcharge</span></div>
          <div class="mockup-row"><span>Roma Tomatoes 25lb</span><span>$18.50/cs</span><span>$18.50/cs</span><span class="badge-status in">✓ Match</span></div>
          <div class="mockup-row alert-highlight"><span>Olive Oil 4x1gal</span><span>$62.00/cs</span><span class="price-mismatch">$68.50/cs</span><span class="badge-status out">⚠ Overcharge</span></div>
        </div>
        <div class="mockup-window-footer"><span>Automated SFTP Audit</span><span class="stat-alert">Overcharge Prevented: $384.50</span></div>
      </div>`;
  }
  if (p.visual_type === "mockup_voiceagent") {
    return `
      <div class="mockup-window">
        <div class="mockup-window-header"><span class="mock-dot red"></span><span class="mock-dot yellow"></span><span class="mock-dot green"></span><span class="mockup-window-title">VoiceAgent • Telephony Session</span></div>
        <div class="mockup-window-body voice-body">
          <div class="voice-status-bar"><span class="call-active-badge"><span class="live-pulse"></span> Active Call (01:24)</span><span class="caller-id">+1 (604) 555-0192</span></div>
          <div class="voice-transcript">
            <div class="voice-bubble caller"><span class="speaker-tag">Caller</span><p>"Hi, do you have a table for 4 tonight around 7:30?"</p></div>
            <div class="voice-bubble agent"><span class="speaker-tag">VoiceAgent</span><p>"We have 7:15 or 7:45 available in the main dining room. Would either work for you?"</p></div>
          </div>
          <div class="voice-integrations"><span class="int-label">Integrations:</span><span class="tag-pill">Twilio SIP</span><span class="tag-pill">Yeastar PBX</span><span class="tag-pill">HubSpot CRM</span></div>
        </div>
        <div class="mockup-window-footer"><span>Zero Wait Time</span><span class="stat-ok">Instant SMS confirmation sent</span></div>
      </div>`;
  }
  return `<div class="product-image-container"><img src="${escAttr(p.image || "")}" alt="${escAttr(p.image_alt || p.name || "")}" loading="lazy" class="product-preview-img" /></div>`;
}

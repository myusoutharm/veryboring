import { escapeAttr, escapeHtml, renderNavigation, renderContact, renderFooter, handleAnchorLinks, initScrollAnimations } from './scripts.js?v=20260503b';

async function getContent(key, file) {
  if (window.__CONTENT__ && window.__CONTENT__[key]) return window.__CONTENT__[key];
  const res = await fetch(file);
  return res.json();
}

function accentOf(product) {
  return escapeAttr(product.badge_color || 'purple');
}

export function renderProductRow(product, index = 0) {
  const num = String(index + 1).padStart(2, '0');
  return `
    <article class="product-row-card accent-${accentOf(product)}" id="product-${escapeAttr(product.id || '')}" data-url="${escapeAttr(product.url)}" tabindex="0" role="link" aria-label="${escapeAttr(product.name)} - ${escapeAttr(product.tagline)}">
      <div class="product-card-head">
        <div class="product-badge-row">
          <span class="product-num" aria-hidden="true">${num}</span>
          <span class="product-badge badge-${accentOf(product)}">${escapeHtml(product.badge)}</span>
        </div>
        <h2 class="product-title">
          <a href="${escapeAttr(product.url)}" class="product-title-link">${escapeHtml(product.name)}</a>
        </h2>
        <p class="product-tagline">${escapeHtml(product.tagline)}</p>
      </div>

      <div class="product-row-grid">
        <div class="product-row-info">
          <div class="product-narrative">
            <div class="narrative-block narrative-problem">
              <span class="narrative-label">The problem</span>
              <p>${escapeHtml(product.problem)}</p>
            </div>
            <div class="narrative-block narrative-solution">
              <span class="narrative-label">The fix</span>
              <p>${escapeHtml(product.solution)}</p>
            </div>
          </div>

          <ul class="product-features">
            ${(product.features || []).map(feat => `
              <li>
                <span class="feature-check" aria-hidden="true">✔</span>
                <span>${escapeHtml(feat)}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <div class="product-row-visual">
          ${renderProductVisual(product)}
        </div>
      </div>

      <div class="product-card-foot">
        <div class="product-metrics-strip">
          ${(product.metrics || []).map(m => `
            <div class="product-metric-item">
              <span class="metric-val">${escapeHtml(m.value)}</span>
              <span class="metric-lbl">${escapeHtml(m.label)}</span>
            </div>
          `).join('')}
        </div>
        <div class="product-actions">
          <a href="${escapeAttr(product.url)}" class="btn btn-primary btn-product">
            ${escapeHtml(product.cta_text || 'Explore Product')} <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </article>
  `;
}

export function renderProductIndex(products) {
  return (products || []).map(p => `
    <a class="products-index-link accent-${accentOf(p)}" href="#product-${escapeAttr(p.id || '')}">
      <span class="products-index-dot" aria-hidden="true"></span>${escapeHtml(p.name)}
    </a>
  `).join('');
}

export function renderProductsCta(closing) {
  if (!closing || !closing.title) return '';
  return `
    <div class="container">
      <div class="products-cta-card">
        <div class="products-cta-copy">
          <h2>${escapeHtml(closing.title)}</h2>
          <p>${escapeHtml(closing.text || '')}</p>
        </div>
        <div class="products-cta-actions">
          <a href="${escapeAttr(closing.cta_url || '#contact')}" class="btn btn-primary">${escapeHtml(closing.cta_text || 'Talk to us')}</a>
          ${closing.secondary_text ? `<a href="${escapeAttr(closing.secondary_url || 'pricing.html')}" class="btn btn-outline">${escapeHtml(closing.secondary_text)}</a>` : ''}
        </div>
      </div>
    </div>
  `;
}

export function renderProductVisual(product) {
  if (product.visual_type === 'mockup_easysignout') {
    return `
      <div class="mockup-window">
        <div class="mockup-window-header">
          <span class="mock-dot red"></span>
          <span class="mock-dot yellow"></span>
          <span class="mock-dot green"></span>
          <span class="mockup-window-title">tab.easysignout.com • Live Kiosk</span>
        </div>
        <div class="mockup-window-body">
          <div class="mockup-row mockup-head">
            <span>Device</span><span>Status</span><span>Staff / Holder</span><span>Time</span>
          </div>
          <div class="mockup-row">
            <span class="device-name"><span class="icon-dot out"></span> iPad Pro #12</span>
            <span class="badge-status out">Checked Out</span>
            <span>J. Martinez</span>
            <span class="time-muted">9:14 AM</span>
          </div>
          <div class="mockup-row">
            <span class="device-name"><span class="icon-dot in"></span> iPad Air #03</span>
            <span class="badge-status in">Available</span>
            <span class="time-muted">Dock 2</span>
            <span class="time-muted">—</span>
          </div>
          <div class="mockup-row">
            <span class="device-name"><span class="icon-dot out"></span> iPad Mini #07</span>
            <span class="badge-status out">Checked Out</span>
            <span>T. Nguyen</span>
            <span class="time-muted">8:52 AM</span>
          </div>
          <div class="mockup-row">
            <span class="device-name"><span class="icon-dot in"></span> iPad Pro #09</span>
            <span class="badge-status in">Available</span>
            <span class="time-muted">Dock 5</span>
            <span class="time-muted">—</span>
          </div>
        </div>
        <div class="mockup-window-footer">
          <span><strong>12</strong> Total Fleet</span>
          <span class="stat-ok"><strong>8</strong> Available</span>
          <span class="stat-alert"><strong>4</strong> Out</span>
          <span class="mockup-live"><span class="live-pulse"></span> Live Kiosk</span>
        </div>
      </div>
    `;
  }

  if (product.visual_type === 'mockup_edisync') {
    return `
      <div class="mockup-window">
        <div class="mockup-window-header">
          <span class="mock-dot red"></span>
          <span class="mock-dot yellow"></span>
          <span class="mock-dot green"></span>
          <span class="mockup-window-title">EDISync • Overnight EDI 810 Audit</span>
        </div>
        <div class="mockup-window-body">
          <div class="mockup-stats-strip">
            <div class="stat-cell"><span class="stat-num">12</span><span class="stat-lbl">Invoices</span></div>
            <div class="stat-cell alert"><span class="stat-num">3</span><span class="stat-lbl">Price Alerts</span></div>
            <div class="stat-cell"><span class="stat-num">100%</span><span class="stat-lbl">Audited</span></div>
          </div>
          <div class="mockup-row mockup-head">
            <span>Item Description</span><span>Contract</span><span>Invoiced</span><span>Status</span>
          </div>
          <div class="mockup-row">
            <span>Chicken Breast 40lb</span><span>$3.15/lb</span><span>$3.15/lb</span><span class="badge-status in">✓ Match</span>
          </div>
          <div class="mockup-row alert-highlight">
            <span>Salmon Fillet 10lb</span><span>$12.80/lb</span><span class="price-mismatch">$14.20/lb</span><span class="badge-status out">⚠ Overcharge</span>
          </div>
          <div class="mockup-row">
            <span>Roma Tomatoes 25lb</span><span>$18.50/cs</span><span>$18.50/cs</span><span class="badge-status in">✓ Match</span>
          </div>
          <div class="mockup-row alert-highlight">
            <span>Olive Oil 4x1gal</span><span>$62.00/cs</span><span class="price-mismatch">$68.50/cs</span><span class="badge-status out">⚠ Overcharge</span>
          </div>
        </div>
        <div class="mockup-window-footer">
          <span>Automated SFTP Audit</span>
          <span class="stat-alert">Overcharge Prevented: $384.50</span>
        </div>
      </div>
    `;
  }

  if (product.visual_type === 'mockup_voiceagent') {
    return `
      <div class="mockup-window">
        <div class="mockup-window-header">
          <span class="mock-dot red"></span>
          <span class="mock-dot yellow"></span>
          <span class="mock-dot green"></span>
          <span class="mockup-window-title">VoiceAgent • Telephony Session</span>
        </div>
        <div class="mockup-window-body voice-body">
          <div class="voice-status-bar">
            <span class="call-active-badge"><span class="live-pulse"></span> Active Call (01:24)</span>
            <span class="caller-id">+1 (604) 555-0192</span>
          </div>
          <div class="voice-transcript">
            <div class="voice-bubble caller">
              <span class="speaker-tag">Caller</span>
              <p>"Hi, do you have a table for 4 tonight around 7:30?"</p>
            </div>
            <div class="voice-bubble agent">
              <span class="speaker-tag">VoiceAgent</span>
              <p>"We have 7:15 or 7:45 available in the main dining room. Would either work for you?"</p>
            </div>
          </div>
          <div class="voice-integrations">
            <span class="int-label">Integrations:</span>
            <span class="tag-pill">Twilio SIP</span>
            <span class="tag-pill">Yeastar PBX</span>
            <span class="tag-pill">HubSpot CRM</span>
          </div>
        </div>
        <div class="mockup-window-footer">
          <span>Zero Wait Time</span>
          <span class="stat-ok">Instant SMS confirmation sent</span>
        </div>
      </div>
    `;
  }

  // Default: screenshot image
  const img = `<img src="${escapeAttr(product.image)}" alt="${escapeAttr(product.image_alt || product.name)}" loading="lazy" class="product-preview-img" />`;
  if (product.image_frame === 'plain') {
    return `<div class="product-image-container product-image-plain">${img}</div>`;
  }
  return `
    <div class="product-image-container">
      <div class="product-image-chrome" aria-hidden="true">
        <span class="mock-dot red"></span><span class="mock-dot yellow"></span><span class="mock-dot green"></span>
      </div>
      ${img}
    </div>
  `;
}

export async function loadProductsPage() {
  try {
    const navData = await getContent('navigation', 'content/navigation.json');
    renderNavigation(navData);

    const data = await getContent('products', 'content/products.json');

    const titleEl = document.getElementById('page-title');
    if (titleEl) titleEl.textContent = data.page_title || 'Products';

    const introEl = document.getElementById('page-intro');
    if (introEl) introEl.textContent = data.intro || '';

    const eyebrowEl = document.getElementById('page-eyebrow');
    if (eyebrowEl) eyebrowEl.textContent = data.eyebrow || '';

    const indexEl = document.getElementById('products-index');
    if (indexEl) indexEl.innerHTML = renderProductIndex(data.products);

    const ctaEl = document.getElementById('products-cta');
    if (ctaEl) ctaEl.innerHTML = renderProductsCta(data.closing);

    const container = document.getElementById('products-list');
    if (container) {
      container.innerHTML = (data.products || []).map((p, i) => renderProductRow(p, i)).join('');

      // Wire row clickability: clicking anywhere on a row card navigates to the product page
      container.querySelectorAll('.product-row-card').forEach(card => {
        card.addEventListener('click', (e) => {
          if (e.target.closest('a')) return; // Allow native link click
          const url = card.getAttribute('data-url');
          if (url) window.location.href = url;
        });

        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            if (e.target.closest('a')) return;
            e.preventDefault();
            const url = card.getAttribute('data-url');
            if (url) window.location.href = url;
          }
        });
      });
    }

    const footerData = await getContent('footer', 'content/footer.json');
    renderFooter(footerData);

    const contactData = await getContent('contact', 'content/contact.json');
    renderContact(contactData);

    handleAnchorLinks();
    if (typeof window !== 'undefined' && typeof window.IntersectionObserver !== 'undefined') {
      initScrollAnimations();
    }
  } catch (error) {
    console.error('Error loading products page:', error);
  }
}

if (typeof document !== 'undefined' && !import.meta.env?.VITEST) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadProductsPage);
  } else {
    loadProductsPage();
  }
}

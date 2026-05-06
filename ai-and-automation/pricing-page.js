import { escapeHtml, renderNavigation, renderContact, renderFooter, handleAnchorLinks, initScrollAnimations } from './scripts.js?v=20260503b';

async function getContent(key, file) {
  if (window.__CONTENT__ && window.__CONTENT__[key]) return window.__CONTENT__[key];
  const res = await fetch(file);
  return res.json();
}

async function loadPricingPage() {
  try {
    const navData = await getContent('navigation', 'content/navigation.json');
    renderNavigation(navData);

    const data = await getContent('pricing_detailed', 'content/pricing_detailed.json');

    document.getElementById('page-title').textContent = data.page_title;
    document.getElementById('page-intro').textContent = data.intro;

    const comp = data.comparison;
    document.getElementById('comparison-title').textContent = comp.title;
    document.getElementById('table-headers').innerHTML = comp.columns.map(c => `<th>${escapeHtml(c)}</th>`).join('');

    const columnKeyOverrides = {
      'Launch Partner': 'launch',
      'SaaS User': 'saas'
    };
    const dataKeys = comp.columns.slice(1).map((column) => (
      columnKeyOverrides[column] || column.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
    ));

    document.getElementById('table-body').innerHTML = comp.rows.map(row => `
      <tr>
        <th scope="row" style="text-align: left;">${escapeHtml(row.feature)}</th>
        ${dataKeys.map((key, i) => `
          <td style="${i === 0 ? 'color: var(--purple); font-weight: 700;' : ''}">${escapeHtml(row[key])}</td>
        `).join('')}
      </tr>
    `).join('');
    document.getElementById('table-footnote').textContent = comp.footnote;

    document.getElementById('faq-list').innerHTML = data.faqs.map(faq => `
      <div class="card-glass" style="padding: 24px;">
        <h3 style="font-size: 1.15rem; margin-bottom: 12px; color: var(--purple);">${escapeHtml(faq.question)}</h3>
        <p style="margin: 0; font-size: 1rem; line-height: 1.6;">${escapeHtml(faq.answer)}</p>
      </div>
    `).join('');

    const footerData = await getContent('footer', 'content/footer.json');
    renderFooter(footerData);

    const contactData = await getContent('contact', 'content/contact.json');
    renderContact(contactData);

    handleAnchorLinks();
    initScrollAnimations();
  } catch (error) {
    console.error('Error loading pricing page:', error);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadPricingPage);
} else {
  loadPricingPage();
}

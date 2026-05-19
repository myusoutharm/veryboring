import { escapeAttr, escapeHtml, renderNavigation, renderContact, renderFooter, handleAnchorLinks, initScrollAnimations, icon } from './scripts.js?v=20260503b';

async function getContent(key, file) {
  if (window.__CONTENT__ && window.__CONTENT__[key]) return window.__CONTENT__[key];
  const res = await fetch(file);
  return res.json();
}

async function loadSupport() {
  try {
    const navData = await getContent('navigation', 'content/navigation.json');
    renderNavigation(navData);

    const data = await getContent('support', 'content/support.json');

    document.getElementById('page-title').textContent = data.page_title;
    document.getElementById('page-intro').textContent = data.intro;

    const container = document.getElementById('support-content');
    container.innerHTML = `
      <div class="support-methods" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px; margin-bottom: 40px;">
        ${data.contact_methods.map(method => `
          <div class="card" style="padding: 24px; border-radius: 12px;">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
              <div class="icon-box purple" style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 10px;">
                ${icon(method.icon)}
              </div>
              <h3 style="margin: 0;">${escapeHtml(method.label)}</h3>
            </div>
            ${method.href
              ? `<a href="${escapeAttr(method.href)}" style="font-size: 1.05rem;">${escapeHtml(method.value)}</a>`
              : `<p style="margin: 0; font-size: 1.05rem;">${escapeHtml(method.value)}</p>`
            }
          </div>
        `).join('')}
      </div>
      <p style="color: var(--text-secondary, #666); font-size: 0.95rem;">${escapeHtml(data.response_note)}</p>
    `;

    const contactData = await getContent('contact', 'content/contact.json');
    renderContact(contactData);

    const footerData = await getContent('footer', 'content/footer.json');
    renderFooter(footerData);

    handleAnchorLinks();
    initScrollAnimations();
  } catch (error) {
    console.error('Error loading support page:', error);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadSupport);
} else {
  loadSupport();
}

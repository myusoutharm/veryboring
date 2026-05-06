import { escapeAttr, escapeHtml, renderNavigation, renderContact, renderFooter, handleAnchorLinks, initScrollAnimations, icon } from './scripts.js?v=20260503b';

async function getContent(key, file) {
  if (window.__CONTENT__ && window.__CONTENT__[key]) return window.__CONTENT__[key];
  const res = await fetch(file);
  return res.json();
}

async function loadDetailedServices() {
  try {
    const navData = await getContent('navigation', 'content/navigation.json');
    renderNavigation(navData);

    const data = await getContent('services_detailed', 'content/services_detailed.json');

    document.getElementById('page-title').textContent = data.page_title;
    document.getElementById('page-intro').textContent = data.intro;

    const container = document.getElementById('services-detailed');
    container.innerHTML = data.services.map((service, index) => `
      <section id="${escapeAttr(service.id)}" class="detailed-item ${index % 2 === 0 ? 'section-white' : 'section-subtle'}" style="margin-bottom: 40px; padding: 40px; border-radius: 20px;">
        <div class="detailed-grid">
          <div class="detailed-info">
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
              <div class="icon-box purple" style="width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; border-radius: 12px;">
                ${icon(service.icon)}
              </div>
              <h2 style="margin: 0;">${escapeHtml(service.title)}</h2>
            </div>
            <p style="font-size: 1.1rem; margin-bottom: 24px;">${escapeHtml(service.full_description)}</p>
            <ul class="feature-list" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; list-style: none; padding: 0;">
              ${service.features.map(f => `
                <li style="display: flex; align-items: center; gap: 10px;">
                  <span style="color: var(--green);">\u2714</span>
                  <span>${escapeHtml(f)}</span>
                </li>
              `).join('')}
            </ul>
          </div>
        </div>
      </section>
    `).join('');

    const footerData = await getContent('footer', 'content/footer.json');
    renderFooter(footerData);

    const contactData = await getContent('contact', 'content/contact.json');
    renderContact(contactData);

    handleAnchorLinks();
    initScrollAnimations();
  } catch (error) {
    console.error('Error loading detailed services:', error);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadDetailedServices);
} else {
  loadDetailedServices();
}

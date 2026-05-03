(() => {
  const DEFAULT_RECAPTCHA_SITE_KEY = '6LcOWfEqAAAAAMBlevn_BldjtPx9QGPg6pXWKIQI';

  function normalizeRecaptchaConfig(cfg = {}) {
    return {
      siteKey: String(cfg.site_key || DEFAULT_RECAPTCHA_SITE_KEY).trim(),
      mode: String(cfg.mode || 'v3').toLowerCase()
    };
  }

  function isRecaptchaReady() {
    return Boolean(window.grecaptcha && typeof window.grecaptcha.execute === 'function');
  }

  function loadRecaptchaApi(siteKey) {
    if (!siteKey) {
      return Promise.reject(new Error('reCAPTCHA site key missing.'));
    }

    if (isRecaptchaReady()) {
      return Promise.resolve();
    }

    const scriptId = 'recaptcha-api-script';
    const targetSrc = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    let script = document.getElementById(scriptId);

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    if (script.src !== targetSrc) {
      script.src = targetSrc;
    }

    return new Promise((resolve, reject) => {
      const start = Date.now();
      const timeoutMs = 10000;
      const interval = setInterval(() => {
        if (isRecaptchaReady()) {
          clearInterval(interval);
          resolve();
          return;
        }

        if (Date.now() - start > timeoutMs) {
          clearInterval(interval);
          reject(new Error('Timed out loading reCAPTCHA API.'));
        }
      }, 100);
    });
  }

  function createRecaptchaManager() {
    const state = {
      siteKey: DEFAULT_RECAPTCHA_SITE_KEY,
      mode: 'v3',
      initError: ''
    };

    async function init(config = {}) {
      state.siteKey = config.siteKey || DEFAULT_RECAPTCHA_SITE_KEY;
      state.mode = config.mode || 'v3';
      state.initError = '';

      try {
        await loadRecaptchaApi(state.siteKey);
      } catch (err) {
        state.initError = err && err.message ? err.message : 'reCAPTCHA initialization failed.';
        console.warn('reCAPTCHA init error:', err);
      }
    }

    async function getToken(action = 'contact_submit') {
      if (state.mode !== 'v3') {
        throw new Error(`Unsupported reCAPTCHA mode: ${state.mode}`);
      }

      if (state.initError) {
        throw new Error(state.initError);
      }

      if (!isRecaptchaReady()) {
        await loadRecaptchaApi(state.siteKey);
      }

      return window.grecaptcha.execute(state.siteKey, { action });
    }

    return {
      init,
      getToken,
      getState: () => ({ ...state })
    };
  }

  async function loadPageContent(contentFiles) {
    if (window.__CONTENT__ && Object.keys(window.__CONTENT__).length > 0) {
      return window.__CONTENT__;
    }

    const entries = Object.entries(contentFiles);
    const responses = await Promise.all(entries.map(([, file]) => fetch(file)));
    const jsons = await Promise.all(responses.map((r) => {
      if (!r.ok) {
        throw new Error(`Failed to load ${r.url}: ${r.status}`);
      }
      return r.json();
    }));

    return Object.fromEntries(entries.map(([key], i) => [key, jsons[i]]));
  }

  async function loadAndRenderPage({ contentFiles, renderers, onAfterRender }) {
    const content = await loadPageContent(contentFiles);

    Object.entries(renderers).forEach(([key, renderFn]) => {
      if (typeof renderFn === 'function') {
        renderFn(content[key]);
      }
    });

    if (typeof onAfterRender === 'function') {
      onAfterRender(content);
    }

    return content;
  }

  function showFormMessage(el, type, text) {
    if (!el) {
      return;
    }
    el.className = `form-message form-message--${type}`;
    el.textContent = text;
    el.style.display = 'block';
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function getHubspotCookie() {
    return document.cookie.match(/(^|;)\s*hubspotutk=([^;]+)/)?.[2] || undefined;
  }

  function getHubspotFields(form) {
    return Array.from(form.querySelectorAll('[data-hs]'))
      .filter((el) => el.value.trim())
      .map((el) => ({ name: el.dataset.hs, value: el.value.trim() }));
  }

  async function submitContactForm(event, options = {}) {
    event.preventDefault();

    const form = event.target;
    const btn = document.getElementById(options.submitButtonId || 'form-submit');
    const msgBox = document.getElementById(options.messageElementId || 'form-message');
    const submitButtonText = options.submitButtonText || 'Send Message';
    const sendingText = options.sendingText || 'Sending…';
    const successMessage = options.successMessage || "Thanks — we'll be in touch shortly!";
    const serverErrorMessage = options.serverErrorMessage || 'Something went wrong. Please call us directly.';
    const networkErrorMessage = options.networkErrorMessage || 'Network error. Please try calling 604-800-5781 directly.';
    const securityUnavailablePrefix = options.securityUnavailablePrefix || 'Security check unavailable';
    const securityFailedMessage = options.securityFailedMessage || 'Security verification failed. Please try again.';
    const workerPlaceholderToken = options.workerPlaceholderToken || 'your-worker-name';
    const treatPlaceholderAsMissing = options.treatPlaceholderAsMissing !== false;
    const missingWorkerMode = options.missingWorkerMode || 'error';
    const missingWorkerMessage = options.missingWorkerMessage || 'Configuration error: Worker URL missing.';
    const getRecaptchaToken = options.getRecaptchaToken;

    const honeypot = form.querySelector('input[name="b_phone"]');
    if (honeypot && honeypot.value) {
      console.warn('Spam detected via honeypot.');
      showFormMessage(msgBox, 'success', successMessage);
      form.reset();
      return;
    }

    if (typeof getRecaptchaToken !== 'function') {
      showFormMessage(msgBox, 'error', 'Configuration error: reCAPTCHA token provider missing.');
      return;
    }

    let token = '';
    try {
      token = await getRecaptchaToken();
    } catch (err) {
      const detail = err && err.message ? ` (${err.message})` : '';
      showFormMessage(msgBox, 'error', `${securityUnavailablePrefix}${detail}. Please refresh and try again.`);
      return;
    }

    if (!token) {
      showFormMessage(msgBox, 'error', securityFailedMessage);
      return;
    }

    const workerUrl = form.dataset.worker || '';
    const workerIsPlaceholder = treatPlaceholderAsMissing && workerUrl.includes(workerPlaceholderToken);
    if (!workerUrl || workerIsPlaceholder) {
      showFormMessage(msgBox, missingWorkerMode, missingWorkerMessage);
      if (missingWorkerMode === 'success') {
        form.reset();
      }
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.textContent = sendingText;
    }
    if (msgBox) {
      msgBox.style.display = 'none';
    }

    try {
      const res = await fetch(workerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          fields: getHubspotFields(form),
          context: {
            hutk: getHubspotCookie(),
            pageUri: window.location.href,
            pageName: document.title
          }
        })
      });

      if (res.ok) {
        showFormMessage(msgBox, 'success', successMessage);
        form.reset();
      } else {
        const err = await res.json().catch(() => ({}));
        showFormMessage(msgBox, 'error', err.message || serverErrorMessage);
      }
    } catch {
      showFormMessage(msgBox, 'error', networkErrorMessage);
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = submitButtonText;
      }
    }
  }

  window.VBTUtils = {
    ...(window.VBTUtils || {}),
    normalizeRecaptchaConfig,
    createRecaptchaManager,
    loadPageContent,
    loadAndRenderPage,
    showFormMessage,
    submitContactForm
  };
})();

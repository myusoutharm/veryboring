import { createRecaptchaManager, submitContactForm } from './site-utils.js';

export function createContactFormController({
  doc = document,
  recaptchaManager = createRecaptchaManager(),
  submitForm = submitContactForm,
  submitOptions,
  createSubmitOptions,
  formId = 'contact-form',
} = {}) {
  async function handleContactSubmit(event) {
    const options = typeof createSubmitOptions === 'function'
      ? createSubmitOptions(recaptchaManager)
      : submitOptions;

    await submitForm(event, options);
  }

  function init() {
    const form = doc.getElementById(formId);
    if (!form) {
      return;
    }

    form.addEventListener('submit', handleContactSubmit);
    recaptchaManager.init();
  }

  return {
    init,
    handleContactSubmit,
  };
}

export function exposeWindowHandlers(handlers, win = window) {
  Object.entries(handlers).forEach(([name, handler]) => {
    win[name] = handler;
  });
}

export function bootstrapOnDomReady(init, doc = document) {
  doc.addEventListener('DOMContentLoaded', init);
}

// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createContactFormController,
  exposeWindowHandlers,
  bootstrapOnDomReady,
} from './page-controller.js';

describe('page-controller helpers', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <form id="contact-form"></form>
      <button id="form-submit">Send Message</button>
      <div id="form-message"></div>
    `;
  });

  it('creates a contact form controller that wires submit and recaptcha init', async () => {
    const recaptchaManager = { init: vi.fn() };
    const submitForm = vi.fn().mockResolvedValue(undefined);
    const controller = createContactFormController({
      doc: document,
      recaptchaManager,
      submitForm,
      submitOptions: { submitButtonId: 'form-submit' },
    });

    controller.init();
    document.getElementById('contact-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await Promise.resolve();

    expect(recaptchaManager.init).toHaveBeenCalledTimes(1);
    expect(submitForm).toHaveBeenCalledTimes(1);
    expect(submitForm.mock.calls[0][1]).toEqual({ submitButtonId: 'form-submit' });
  });

  it('exposes handlers on window', () => {
    const clickMock = vi.fn();
    exposeWindowHandlers({ testHandler: clickMock }, window);

    expect(window.testHandler).toBe(clickMock);
  });

  it('registers init on DOMContentLoaded', () => {
    const init = vi.fn();
    bootstrapOnDomReady(init, document);

    document.dispatchEvent(new Event('DOMContentLoaded'));
    expect(init).toHaveBeenCalledTimes(1);
  });
});

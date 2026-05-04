// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createDiscountCardController } from './script.js';

describe('discountcard script controller', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <form id="contact-form"></form>
      <button id="form-submit">Send Message</button>
      <div id="form-message"></div>
    `;
  });

  it('initializes and delegates submit with expected options', async () => {
    const recaptchaManager = { init: vi.fn(), getToken: vi.fn().mockResolvedValue('token') };
    const submitForm = vi.fn().mockResolvedValue(undefined);
    const controller = createDiscountCardController({ recaptchaManager, submitForm, doc: document });

    controller.init();
    document.getElementById('contact-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await Promise.resolve();

    expect(recaptchaManager.init).toHaveBeenCalledTimes(1);
    expect(submitForm).toHaveBeenCalledTimes(1);
    const [, options] = submitForm.mock.calls[0];
    expect(options.submitButtonId).toBe('form-submit');
    expect(options.messageElementId).toBe('form-message');
  });
});

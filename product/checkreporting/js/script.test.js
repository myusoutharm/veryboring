// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createCheckReportingController } from './script.js';

describe('checkreporting script controller', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <form id="contact-form"></form>
      <button id="form-submit">Send Message</button>
      <div id="form-message"></div>
      <div id="imageModal"><div id="modalImage"></div></div>
      <div id="wrapper"><svg><rect width="10" height="10"></rect></svg></div>
    `;
  });

  it('initializes form wiring and delegates submit to shared submitter', async () => {
    const recaptchaManager = { init: vi.fn(), getToken: vi.fn().mockResolvedValue('token') };
    const submitForm = vi.fn().mockResolvedValue(undefined);
    const controller = createCheckReportingController({ recaptchaManager, submitForm, doc: document, win: window });

    controller.init();
    const form = document.getElementById('contact-form');
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await Promise.resolve();

    expect(recaptchaManager.init).toHaveBeenCalledTimes(1);
    expect(submitForm).toHaveBeenCalledTimes(1);
    expect(typeof window.openModalWithSVG).toBe('function');
    expect(typeof window.closeModal).toBe('function');
  });

  it('opens and closes SVG modal', () => {
    const controller = createCheckReportingController({
      recaptchaManager: { init: vi.fn(), getToken: vi.fn() },
      submitForm: vi.fn(),
      doc: document,
      win: window,
    });

    const wrapper = document.getElementById('wrapper');
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');

    controller.openModalWithSVG(wrapper);
    expect(modal.classList.contains('active')).toBe(true);
    expect(modalImage.innerHTML).toContain('<svg');

    controller.closeModal();
    expect(modal.classList.contains('active')).toBe(false);
  });
});

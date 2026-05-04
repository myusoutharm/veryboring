// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createDcrController } from './script.js';

describe('dcr script controller', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <form id="contact-form"></form>
      <button id="form-submit">Send Message</button>
      <div id="form-message"></div>
      <div id="imageModal"><img id="modalImage" alt="modal"></div>
      <div id="has-img"><img src="https://example.com/demo.png" alt="demo"></div>
      <div id="no-img"></div>
    `;
  });

  it('wires form submit and recaptcha init', async () => {
    const recaptchaManager = { init: vi.fn(), getToken: vi.fn().mockResolvedValue('token') };
    const submitForm = vi.fn().mockResolvedValue(undefined);
    const controller = createDcrController({ recaptchaManager, submitForm, doc: document, win: window });

    controller.init();
    document.getElementById('contact-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await Promise.resolve();

    expect(recaptchaManager.init).toHaveBeenCalledTimes(1);
    expect(submitForm).toHaveBeenCalledTimes(1);
    expect(typeof window.openModal).toBe('function');
    expect(typeof window.closeModal).toBe('function');
  });

  it('opens modal from image or placeholder and closes on Escape', () => {
    const controller = createDcrController({
      recaptchaManager: { init: vi.fn(), getToken: vi.fn() },
      submitForm: vi.fn(),
      doc: document,
      win: window,
    });

    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');

    controller.openModal(document.getElementById('has-img'));
    expect(modal.classList.contains('active')).toBe(true);
    expect(modalImage.getAttribute('src')).toContain('https://example.com/demo.png');

    controller.closeModal();
    controller.openModal(document.getElementById('no-img'));
    expect(modalImage.getAttribute('src')).toBe(controller.PLACEHOLDER_IMAGE);

    modal.classList.add('active');
    controller.handleKeyDown({ key: 'Escape' });
    expect(modal.classList.contains('active')).toBe(false);
  });
});

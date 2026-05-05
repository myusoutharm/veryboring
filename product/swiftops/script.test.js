// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createResitController } from './script.js';

describe('resit script controller', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <form id="contact-form">
        <input name="email" value="test@example.com">
      </form>
      <button id="form-submit">Request Your Demo</button>
      <div id="form-message" style="display:none"></div>
      <div class="benefit-card"></div>
      <div class="feature-item"></div>
      <div class="step"></div>
    `;
  });

  it('handles successful form submission state', async () => {
    const logger = { log: vi.fn(), error: vi.fn() };
    const controller = createResitController({
      doc: document,
      wait: vi.fn().mockResolvedValue(undefined),
      logger,
    });

    controller.initFormHandler();
    document.getElementById('contact-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await Promise.resolve();

    expect(logger.log).toHaveBeenCalledTimes(1);
    expect(document.getElementById('form-message').textContent).toContain("Thank you!");
    expect(document.getElementById('form-submit').textContent).toBe('Request Your Demo');
    expect(document.getElementById('form-submit').disabled).toBe(false);
  });

  it('configures reveal elements and observes them', () => {
    const observed = [];
    const unobserved = [];
    const createObserver = (callback) => ({
      observe: (el) => observed.push(el),
      unobserve: (el) => unobserved.push(el),
      trigger: (entries) => callback(entries),
    });

    const controller = createResitController({ doc: document, createObserver });
    const observer = controller.initScrollEffects();

    expect(observed).toHaveLength(3);
    observed.forEach((el) => {
      expect(el.style.opacity).toBe('0');
      expect(el.style.transform).toBe('translateY(20px)');
    });

    observer.trigger([{ isIntersecting: true, target: observed[0] }]);
    expect(observed[0].style.opacity).toBe('1');
    expect(observed[0].style.transform).toBe('translateY(0)');
    expect(unobserved).toContain(observed[0]);
  });
});

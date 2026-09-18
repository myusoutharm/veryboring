// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    composeLeadMessage,
    createHoststandController,
    feeEstimate,
    formatDollars,
} from './script.js';

function leadFormHtml() {
    return `
      <form id="contact-form" data-worker="/api/contact">
        <input name="b_phone" value="">
        <input name="firstname" data-hs="firstname" value="Ana">
        <input name="company" data-hs="company" value="Harbour &amp; Pine">
        <input name="email" data-hs="email" value="ana@example.com">
        <input name="city" data-lead="City" value="  Richmond ">
        <select name="locations" data-lead="Locations"><option value="2-3" selected>2 to 3</option></select>
        <select name="current_system" data-lead="Reservations today"><option value="" selected>Choose one</option></select>
        <select name="pos" data-lead="POS"><option selected>Squirrel</option></select>
        <textarea name="notes" data-lead="Notes">Friday phones never stop</textarea>
        <textarea name="message" data-hs="message" hidden></textarea>
        <button type="submit" id="form-submit">Send</button>
      </form>
      <div id="form-message" style="display:none"></div>`;
}

describe('feeEstimate', () => {
    it('multiplies covers by the fee, monthly and yearly', () => {
        expect(feeEstimate(600, 1)).toEqual({ monthly: 600, yearly: 7200 });
        expect(feeEstimate('250', '1.50')).toEqual({ monthly: 375, yearly: 4500 });
    });

    it('rejects negative or non-numeric input', () => {
        expect(feeEstimate(-1, 1)).toBeNull();
        expect(feeEstimate(100, -0.5)).toBeNull();
        expect(feeEstimate('abc', 1)).toBeNull();
    });

    it('formats whole dollars with thousands separators', () => {
        expect(formatDollars(7200)).toBe('$7,200');
        expect(formatDollars(374.6)).toBe('$375');
    });
});

describe('composeLeadMessage', () => {
    beforeEach(() => {
        document.body.innerHTML = leadFormHtml();
    });

    it('folds answered qualifiers into the hidden message field and skips blanks', () => {
        const form = document.getElementById('contact-form');
        const message = composeLeadMessage(form);

        expect(message).toBe([
            'Hoststand early access request',
            'City: Richmond',
            'Locations: 2-3',
            'POS: Squirrel',
            'Notes: Friday phones never stop',
        ].join('\n'));
        expect(form.querySelector('[data-hs="message"]').value).toBe(message);
        expect(message).not.toContain('Reservations today');
    });
});

describe('fee calculator', () => {
    beforeEach(() => {
        document.body.innerHTML = `
          <form id="fee-calculator">
            <input id="fee-covers" value="600">
            <input id="fee-rate" value="1.00">
          </form>
          <strong id="fee-monthly"></strong>
          <strong id="fee-yearly"></strong>`;
    });

    it('renders the starting estimate and updates on input', () => {
        const controller = createHoststandController({ doc: document });
        controller.initFeeCalculator();
        expect(document.getElementById('fee-yearly').textContent).toBe('$7,200');

        const covers = document.getElementById('fee-covers');
        covers.value = '1000';
        covers.dispatchEvent(new Event('input', { bubbles: true }));
        expect(document.getElementById('fee-monthly').textContent).toBe('$1,000');
        expect(document.getElementById('fee-yearly').textContent).toBe('$12,000');
    });

    it('shows a dash instead of a number for invalid input', () => {
        const controller = createHoststandController({ doc: document });
        controller.initFeeCalculator();

        const rate = document.getElementById('fee-rate');
        rate.value = '-2';
        rate.dispatchEvent(new Event('input', { bubbles: true }));
        expect(document.getElementById('fee-monthly').textContent).toBe('—');
    });
});

describe('lead form', () => {
    beforeEach(() => {
        document.body.innerHTML = leadFormHtml();
    });

    function fakeUtils() {
        const recaptcha = { init: vi.fn(), getToken: vi.fn().mockResolvedValue('token-1') };
        return {
            recaptcha,
            createRecaptchaManager: vi.fn(() => recaptcha),
            normalizeRecaptchaConfig: vi.fn(() => ({ siteKey: 'k', mode: 'v3' })),
            submitContactForm: vi.fn().mockResolvedValue(undefined),
        };
    }

    it('composes the message, then hands off to the shared submitter with a reCAPTCHA token', async () => {
        const utils = fakeUtils();
        const controller = createHoststandController({
            doc: document,
            loadSiteUtils: () => Promise.resolve(utils),
        });
        controller.initLeadForm();

        const form = document.getElementById('contact-form');
        const event = new Event('submit', { cancelable: true });
        form.dispatchEvent(event);
        await vi.waitFor(() => expect(utils.submitContactForm).toHaveBeenCalledTimes(1));

        expect(event.defaultPrevented).toBe(true);
        expect(form.querySelector('[data-hs="message"]').value).toContain('POS: Squirrel');
        expect(utils.recaptcha.init).toHaveBeenCalledTimes(1);

        const [passedEvent, options] = utils.submitContactForm.mock.calls[0];
        expect(passedEvent).toBe(event);
        await expect(options.getRecaptchaToken()).resolves.toBe('token-1');
        expect(options.successMessage).toContain('604-800-5781');
    });

    it('shows a call-us message when the shared utilities cannot load', async () => {
        const controller = createHoststandController({
            doc: document,
            loadSiteUtils: () => Promise.reject(new Error('404')),
        });
        const form = document.getElementById('contact-form');
        const event = new Event('submit', { cancelable: true });
        Object.defineProperty(event, 'currentTarget', { value: form });

        await controller.handleLeadSubmit(event);

        const box = document.getElementById('form-message');
        expect(event.defaultPrevented).toBe(true);
        expect(box.style.display).toBe('block');
        expect(box.className).toContain('form-message--error');
        expect(box.textContent).toContain('604-800-5781');
    });
});

describe('mobile menu', () => {
    it('opens and closes, keeping aria-expanded in sync', () => {
        document.body.innerHTML = `
          <header class="header"></header>
          <button id="nav-toggle" aria-expanded="false"></button>
          <nav id="main-nav"><a href="#contact">Contact</a></nav>`;
        const controller = createHoststandController({ doc: document, win: window });
        controller.initHeader();

        const toggle = document.getElementById('nav-toggle');
        const nav = document.getElementById('main-nav');
        toggle.click();
        expect(nav.classList.contains('open')).toBe(true);
        expect(toggle.getAttribute('aria-expanded')).toBe('true');

        nav.querySelector('a').click();
        expect(nav.classList.contains('open')).toBe(false);
        expect(toggle.getAttribute('aria-expanded')).toBe('false');
    });
});

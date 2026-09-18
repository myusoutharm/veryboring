/**
 * Hoststand landing page: header and menu, per-cover fee calculator,
 * mobile call bar, and the lead form.
 *
 * The lead form goes through the shared site-utils submitter (reCAPTCHA v3,
 * honeypot, HubSpot via /api/contact). HubSpot only knows the standard
 * fields, so the qualifying answers (city, locations, current system, POS,
 * notes) are folded into the `message` field before submitting.
 *
 * site-utils is imported lazily so the page still works when previewed on
 * its own, outside the veryboring site where ../../shared/ exists.
 */

const SITE_UTILS_PATH = '../../shared/site-utils.js';
const CALL_NUMBER = '604-800-5781';

export function feeEstimate(covers, rate) {
    const c = Number(covers);
    const r = Number(rate);
    if (!Number.isFinite(c) || !Number.isFinite(r) || c < 0 || r < 0) {
        return null;
    }
    const monthly = c * r;
    return { monthly, yearly: monthly * 12 };
}

export function formatDollars(amount) {
    return `$${Math.round(amount).toLocaleString('en-US')}`;
}

/** Fold the qualifying answers into the hidden HubSpot `message` field. */
export function composeLeadMessage(form) {
    const lines = Array.from(form.querySelectorAll('[data-lead]'))
        .map((el) => [el.dataset.lead, el.value.trim()])
        .filter(([, value]) => value)
        .map(([label, value]) => `${label}: ${value}`);
    const message = ['Hoststand early access request', ...lines].join('\n');
    const target = form.querySelector('[data-hs="message"]');
    if (target) {
        target.value = message;
    }
    return message;
}

export function createHoststandController({
    doc = document,
    win = typeof window !== 'undefined' ? window : undefined,
    loadSiteUtils = () => import(SITE_UTILS_PATH),
    createObserver = (cb, opts) => new IntersectionObserver(cb, opts),
} = {}) {
    let utilsPromise;
    let recaptcha;

    function siteUtils() {
        if (!utilsPromise) {
            utilsPromise = loadSiteUtils().then((utils) => {
                recaptcha = utils.createRecaptchaManager();
                recaptcha.init(utils.normalizeRecaptchaConfig());
                return utils;
            });
            // Let a failed load be retried on the next submit.
            utilsPromise.catch(() => { utilsPromise = undefined; });
        }
        return utilsPromise;
    }

    function initHeader() {
        const header = doc.querySelector('.header');
        const toggle = doc.getElementById('nav-toggle');
        const nav = doc.getElementById('main-nav');

        if (header && win) {
            win.addEventListener('scroll', () => {
                header.classList.toggle('scrolled', win.scrollY > 8);
            }, { passive: true });
        }

        if (!toggle || !nav) return;
        const setOpen = (open) => {
            nav.classList.toggle('open', open);
            toggle.classList.toggle('open', open);
            toggle.setAttribute('aria-expanded', String(open));
            toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        };
        toggle.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
        nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setOpen(false)));
    }

    function initFeeCalculator() {
        const form = doc.getElementById('fee-calculator');
        const covers = doc.getElementById('fee-covers');
        const rate = doc.getElementById('fee-rate');
        const monthly = doc.getElementById('fee-monthly');
        const yearly = doc.getElementById('fee-yearly');
        if (!form || !covers || !rate || !monthly || !yearly) return;

        const update = () => {
            const estimate = feeEstimate(covers.value || 0, rate.value || 0);
            monthly.textContent = estimate ? formatDollars(estimate.monthly) : '—';
            yearly.textContent = estimate ? formatDollars(estimate.yearly) : '—';
        };
        form.addEventListener('input', update);
        form.addEventListener('submit', (event) => event.preventDefault());
        update();
    }

    async function handleLeadSubmit(event) {
        // Must happen before any await, or the browser submits the form itself.
        event.preventDefault();
        const form = event.currentTarget || event.target;
        composeLeadMessage(form);

        let utils;
        try {
            utils = await siteUtils();
        } catch {
            const box = doc.getElementById('form-message');
            if (box) {
                box.className = 'form-message form-message--error';
                box.textContent = `The form isn't available right now. Please call ${CALL_NUMBER}.`;
                box.style.display = 'block';
            }
            return;
        }

        await utils.submitContactForm(event, {
            getRecaptchaToken: () => recaptcha.getToken(),
            submitButtonText: 'Send',
            sendingText: 'Sending…',
            successMessage: `Thanks. We'll reply within one business day. If it's urgent, call ${CALL_NUMBER}.`,
            serverErrorMessage: `Something went wrong on our side. Please call ${CALL_NUMBER}.`,
            networkErrorMessage: `We couldn't send that. Check your connection or call ${CALL_NUMBER}.`,
        });
    }

    function initLeadForm() {
        const form = doc.getElementById('contact-form');
        if (!form) return;
        form.addEventListener('submit', handleLeadSubmit);
        // Start loading reCAPTCHA early so the token is ready by the time they hit Send.
        siteUtils().catch(() => {});
    }

    function initMobileBar() {
        const bar = doc.getElementById('mobile-bar');
        const contact = doc.getElementById('contact');
        if (!bar || !contact || typeof IntersectionObserver === 'undefined') return;
        const observer = createObserver(([entry]) => {
            bar.classList.toggle('hidden', entry.isIntersecting);
        }, { threshold: 0.1 });
        observer.observe(contact);
    }

    function init() {
        initHeader();
        initFeeCalculator();
        initLeadForm();
        initMobileBar();
    }

    return {
        init,
        initHeader,
        initFeeCalculator,
        initLeadForm,
        initMobileBar,
        handleLeadSubmit,
    };
}

export function bootstrapPage() {
    const controller = createHoststandController();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', controller.init);
    } else {
        controller.init();
    }
    return controller;
}

if (typeof document !== 'undefined') {
    bootstrapPage();
}

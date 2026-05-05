/**
 * SwiftOps Hub - Landing Page Script
 * Integrated with shared site-utils for HubSpot submission
 */

import { createRecaptchaManager, normalizeRecaptchaConfig, submitContactForm } from '../../shared/site-utils.js';
import { bootstrapOnDomReady } from '../../shared/page-controller.js';

const recaptchaManager = createRecaptchaManager();

export function createSwiftOpsController({
    doc = document,
    createObserver = (cb, opts) => new IntersectionObserver(cb, opts)
} = {}) {
    async function handleFormSubmit(event) {
        await submitContactForm(event, {
            getRecaptchaToken: () => recaptchaManager.getToken(),
            submitButtonText: 'Request Your Demo',
            sendingText: 'Sending...',
            successMessage: "Thank you! We'll be in touch within 24 hours.",
            missingWorkerMode: 'error'
        });
    }

    function initFormHandler() {
        const form = doc.getElementById('contact-form');
        if (form) {
            // Initialize reCAPTCHA (using default site key from site-utils)
            recaptchaManager.init(normalizeRecaptchaConfig());
            form.addEventListener('submit', handleFormSubmit);
        }
    }

    function initScrollEffects() {
        if (typeof IntersectionObserver === 'undefined' && createObserver === undefined) return;

        const observer = createObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        const revealElements = doc.querySelectorAll('.benefit-card, .feature-item, .step');
        revealElements.forEach((el) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            observer.observe(el);
        });
        return observer;
    }

    function init() {
        initFormHandler();
        initScrollEffects();
    }

    return {
        init,
        initFormHandler,
        initScrollEffects
    };
}

export function bootstrapPage() {
    const controller = createSwiftOpsController();
    bootstrapOnDomReady(controller.init, document);
    return controller;
}

if (typeof document !== 'undefined') {
    bootstrapPage();
}

/**
 * SwiftOps Hub - Landing Page Script
 * Following the SaaS Landing Page Design Guidelines
 */

import { bootstrapOnDomReady } from '../../shared/page-controller.js';

export function createResitController({
    doc = document,
    formDataCtor = FormData,
    wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
    logger = console,
    createObserver = (callback, options) => new IntersectionObserver(callback, options),
} = {}) {
    function bindFormSubmission(form, messageDiv, submitBtn) {
        if (!form || !messageDiv || !submitBtn) {
            return;
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            try {
                const formData = new formDataCtor(form);
                const data = Object.fromEntries(formData.entries());
                logger.log('Form submission:', data);

                await wait(1500);

                form.reset();
                messageDiv.textContent = 'Thank you! We\'ll be in touch within 24 hours.';
                messageDiv.style.display = 'block';
                messageDiv.style.color = '#10b981';
            } catch (error) {
                logger.error('Form error:', error);
                messageDiv.textContent = 'Something went wrong. Please try again.';
                messageDiv.style.display = 'block';
                messageDiv.style.color = '#ef4444';
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Request Your Demo';
            }
        });
    }

    function initFormHandler() {
        const form = doc.getElementById('contact-form');
        const messageDiv = doc.getElementById('form-message');
        const submitBtn = doc.getElementById('form-submit');
        bindFormSubmission(form, messageDiv, submitBtn);
    }

    function initScrollEffects() {
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
        initScrollEffects,
        bindFormSubmission,
    };
}

export function bootstrapResitPage() {
    const controller = createResitController();
    bootstrapOnDomReady(controller.init, document);
    return controller;
}

if (typeof document !== 'undefined') {
    bootstrapResitPage();
}

/**
 * VoiceAgent Landing Page Logic
 * Handles form submissions, reCAPTCHA, and UI interactions.
 */

import { submitContactForm, createRecaptchaManager } from '../../shared/site-utils.js';

// Initialize reCAPTCHA
const recaptchaManager = createRecaptchaManager();
// Site key would typically come from an environment variable or config
recaptchaManager.init({ mode: 'v3', site_key: '6Ld_placeholder_site_key' });

/**
 * Mobile Menu Toggle
 */
const setupMobileMenu = () => {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');

    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            toggle.classList.toggle('active');
        });
    }
};

/**
 * Form Submission Handling
 */
const setupContactForm = () => {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        // use the shared utility to handle the submission
        // this handles reCAPTCHA, honeypot, and HubSpot mapping
        await submitContactForm(e, { 
            getRecaptchaToken: () => recaptchaManager.getToken() 
        });
    });
};

/**
 * Scroll Animations
 * Uses Intersection Observer to fade in elements as they enter the viewport.
 */
const setupScrollAnimations = () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatableElements = document.querySelectorAll('.benefit-card, .feature-item, .step-card, .pricing-card, .automation-card');
    animatableElements.forEach(el => {
        el.classList.add('fade-in-up');
        observer.observe(el);
    });
};

// Initialize all features on DOM content load
document.addEventListener('DOMContentLoaded', () => {
    setupMobileMenu();
    setupContactForm();
    setupScrollAnimations();
});

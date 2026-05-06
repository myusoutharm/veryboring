import {
    createContactFormController,
    exposeWindowHandlers,
    bootstrapOnDomReady,
} from '../../../shared/page-controller.js';

export function createCheckReportingController({
    doc = document,
    win = window,
    recaptchaManager,
    submitForm,
} = {}) {
    const contactController = createContactFormController({
        doc,
        recaptchaManager,
        submitForm,
        createSubmitOptions: (manager) => ({
            getRecaptchaToken: () => manager.getToken(),
            submitButtonId: 'form-submit',
            messageElementId: 'form-message',
            submitButtonText: 'Send Message'
        })
    });

    const { handleContactSubmit } = contactController;

    function openModalWithSVG(wrapper) {
        const modal = doc.getElementById('imageModal');
        const modalImg = doc.getElementById('modalImage');
        if (!modal || !modalImg || !wrapper) {
            return;
        }

        const svg = wrapper.querySelector('svg');
        const img = wrapper.querySelector('img');
        if (svg) {
            modalImg.innerHTML = svg.outerHTML;
            modal.classList.add('active');
        } else if (img) {
            // Re-render the image styled elegantly inside the modal
            modalImg.innerHTML = `<img src="${img.getAttribute('src')}" alt="${img.getAttribute('alt') || 'Screenshot'}" class="modal-enlarged-image">`;
            modal.classList.add('active');
        }
    }

    function closeModal(e) {
        if (e) {
            e.preventDefault();
        }

        const modal = doc.getElementById('imageModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    function handleDocumentClick(event) {
        const modal = doc.getElementById('imageModal');
        if (modal && event.target === modal) {
            modal.classList.remove('active');
        }
    }

    function init() {
        contactController.init();

        doc.addEventListener('click', handleDocumentClick);

        // Bind interactive screenshots and SVGs to open modal
        const zoomables = doc.querySelectorAll('.step-image-wrapper, .hero-image');
        zoomables.forEach(wrapper => {
            wrapper.addEventListener('click', () => openModalWithSVG(wrapper));
        });

        // Bind close button for modal
        const closeBtn = doc.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        // Bind Hero CTA buttons for smooth scrolling
        const scheduleBtn = doc.querySelector('.hero-buttons .btn-primary');
        if (scheduleBtn) {
            scheduleBtn.addEventListener('click', () => {
                const contactSec = doc.getElementById('contact');
                if (contactSec) {
                    contactSec.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        const seeHowBtn = doc.querySelector('.hero-buttons .btn-secondary');
        if (seeHowBtn) {
            seeHowBtn.addEventListener('click', () => {
                const howItWorksSec = doc.getElementById('how-it-works');
                if (howItWorksSec) {
                    howItWorksSec.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        // Bind Nav CTA button for smooth scrolling
        const navCtaBtn = doc.querySelector('.nav-cta');
        if (navCtaBtn) {
            navCtaBtn.addEventListener('click', () => {
                const contactSec = doc.getElementById('contact');
                if (contactSec) {
                    contactSec.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        exposeWindowHandlers({ openModalWithSVG, closeModal }, win);
    }

    return {
        init,
        handleContactSubmit,
        handleDocumentClick,
        openModalWithSVG,
        closeModal,
    };
}

export function bootstrapCheckReportingPage() {
    const controller = createCheckReportingController();
    bootstrapOnDomReady(controller.init, document);
    return controller;
}

if (typeof document !== 'undefined' && typeof window !== 'undefined') {
    bootstrapCheckReportingPage();
}

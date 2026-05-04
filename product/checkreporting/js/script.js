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
        if (svg) {
            modalImg.innerHTML = svg.outerHTML;
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

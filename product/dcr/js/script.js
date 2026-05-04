import {
    createContactFormController,
    exposeWindowHandlers,
    bootstrapOnDomReady,
} from '../../../shared/page-controller.js';

const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg width="800" height="500" xmlns="http://www.w3.org/2000/svg"%3E%3Crect fill="%23e0e7ff" width="800" height="500"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="48" fill="%232d5a27" font-family="sans-serif"%3EStep Image Placeholder%3C/text%3E%3C/svg%3E';

export function createDcrController({
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

    function openModal(element) {
        const modal = doc.getElementById('imageModal');
        const modalImage = doc.getElementById('modalImage');
        if (!modal || !modalImage || !element) {
            return;
        }

        const imgElement = element.querySelector('img');
        modalImage.src = imgElement && imgElement.src ? imgElement.src : PLACEHOLDER_IMAGE;
        modal.classList.add('active');
    }

    function closeModal() {
        const modal = doc.getElementById('imageModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    function handleModalClick(event) {
        if (event.target === event.currentTarget) {
            closeModal();
        }
    }

    function handleKeyDown(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    }

    function init() {
        contactController.init();

        const modal = doc.getElementById('imageModal');
        if (modal) {
            modal.addEventListener('click', handleModalClick);
        }

        doc.addEventListener('keydown', handleKeyDown);

        exposeWindowHandlers({ openModal, closeModal }, win);
    }

    return {
        init,
        handleContactSubmit,
        handleModalClick,
        handleKeyDown,
        openModal,
        closeModal,
        PLACEHOLDER_IMAGE,
    };
}

export function bootstrapDcrPage() {
    const controller = createDcrController();
    bootstrapOnDomReady(controller.init, document);
    return controller;
}

if (typeof document !== 'undefined' && typeof window !== 'undefined') {
    bootstrapDcrPage();
}

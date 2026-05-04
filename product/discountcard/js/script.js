import {
    createContactFormController,
    bootstrapOnDomReady,
} from '../../../shared/page-controller.js';

export function createDiscountCardController({
    doc = document,
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

    const { init, handleContactSubmit } = contactController;

    return {
        init,
        handleContactSubmit,
    };
}

export function bootstrapDiscountCardPage() {
    const controller = createDiscountCardController();
    bootstrapOnDomReady(controller.init, document);
    return controller;
}

if (typeof document !== 'undefined') {
    bootstrapDiscountCardPage();
}

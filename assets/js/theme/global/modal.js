import foundation from './foundation';

const bodyActiveClass = 'has-activeModal';
const loadingOverlayClass = 'loadingOverlay';
const modalBodyClass = 'modal-body';
const modalContentClass = 'modal-content';

const SizeClasses = {
    small: 'modal--small',
    large: 'modal--large',
    normal: '',
};

export const ModalEvents = {
    close: 'close.fndtn.reveal',
    closed: 'closed.fndtn.reveal',
    open: 'open.fndtn.reveal',
    opened: 'opened.fndtn.reveal',
};

function getSizeFromModal($modal) {
    if ($modal.hasClass(SizeClasses.small)) {
        return 'small';
    }

    if ($modal.hasClass(SizeClasses.large)) {
        return 'large';
    }

    return 'normal';
}

function getViewportHeight(multipler = 1) {
    const viewportHeight = $(window).height();

    return viewportHeight * multipler;
}

function wrapModalBody(content) {
    const $modalBody = $('<div>');

    $modalBody
        .addClass(modalBodyClass)
        .html(content);

    return $modalBody;
}

function restrainContentHeight($content) {
    const $body = $(`.${modalBodyClass}`, $content);
    const bodyHeight = $body.outerHeight();
    const contentHeight = $content.outerHeight();
    const viewportHeight = getViewportHeight(0.9);
    const maxHeight = viewportHeight - (contentHeight - bodyHeight);

    $body.css('max-height', maxHeight);
}

function createModalContent($modal) {
    let $content = $(`.${modalContentClass}`, $modal);

    if ($content.length === 0) {
        const existingContent = $modal.children();

        $content = $('<div>')
            .addClass(modalContentClass)
            .append(existingContent)
            .appendTo($modal);
    }

    return $content;
}

function createLoadingOverlay($modal) {
    let $loadingOverlay = $(`.${loadingOverlayClass}`, $modal);

    if ($loadingOverlay.length === 0) {
        $loadingOverlay = $('<div>')
            .addClass(loadingOverlayClass)
            .appendTo($modal);
    }

    return $loadingOverlay;
}

/**
 * Require foundation.reveal
 * Decorate foundation.reveal with additional methods
 * @param {jQuery} $modal
 * @param {Object} [options]
 * @param {string} [options.size]
 */
export class Modal {
    constructor($modal, {
        size = null,
    } = {}) {
        this.$modal = $modal;
        this.$content = createModalContent(this.$modal);
        this.$overlay = createLoadingOverlay(this.$modal);
        this.defaultSize = size || getSizeFromModal($modal);
        this.size = this.defaultSize;
        this.pending = false;

        this.onModalOpen = this.onModalOpen.bind(this);
        this.onModalOpened = this.onModalOpened.bind(this);
        this.onModalClose = this.onModalClose.bind(this);
        this.onModalClosed = this.onModalClosed.bind(this);

        this.bindEvents();

        /* STRF-2471 - Multiple Wish Lists - prevents double-firing
         * of foundation.dropdown click.fndtn.dropdown event */
        this.$modal.on('click', '.dropdown-menu-button', e => {
            e.stopPropagation();
        });
    }

    get pending() {
        return this._pending;
    }

    set pending(pending) {
        this._pending = pending;

        if (pending) {
            this.$overlay.show();
        } else {
            this.$overlay.hide();
        }
    }

    get size() {
        return this._size;
    }

    set size(size) {
        this._size = size;

        this.$modal
            .removeClass(SizeClasses.small)
            .removeClass(SizeClasses.large)
            .addClass(SizeClasses[size] || '');
    }

    bindEvents() {
        this.$modal.on(ModalEvents.close, this.onModalClose);
        this.$modal.on(ModalEvents.closed, this.onModalClosed);
        this.$modal.on(ModalEvents.open, this.onModalOpen);
        this.$modal.on(ModalEvents.opened, this.onModalOpened);
    }

    unbindEvents() {
        this.$modal.off(ModalEvents.close, this.onModalClose);
        this.$modal.off(ModalEvents.closed, this.onModalClosed);
        this.$modal.off(ModalEvents.open, this.onModalOpen);
        this.$modal.off(ModalEvents.opened, this.onModalOpened);
    }

    open({
        size,
        pending = true,
        clearContent = true,
    } = {}) {
        this.pending = pending;

        if (size) {
            this.size = size;
        }

        if (clearContent) {
            this.clearContent();
        }

        this.$modal.foundation('reveal', 'open');
    }

    close() {
        this.$modal.foundation('reveal', 'close');
    }

    updateContent(content, { wrap = false } = {}) {
        let $content = $(content);

        if (wrap) {
            $content = wrapModalBody(content);
        }

        this.pending = false;
        this.$content.html($content);

        restrainContentHeight(this.$content);
        foundation(this.$content);
    }

    clearContent() {
        this.$content.html('');
    }

    onModalClose() {
        $('body').removeClass(bodyActiveClass);
    }

    onModalClosed() {
        this.size = this.defaultSize;
    }

    onModalOpen() {
        $('body').addClass(bodyActiveClass);
    }

    onModalOpened() {
        restrainContentHeight(this.$content);
    }
}

/**
 * Return an array of modals
 * @param {string} selector
 * @param {Object} [options]
 * @param {string} [options.size]
 * @returns {array}
 */
export default function modalFactory(selector = '[data-reveal]', options = {}) {
    const $modals = $(selector, options.$context);

    return $modals.map((index, element) => {
        const $modal = $(element);
        const instanceKey = 'modalInstance';
        const cachedModal = $modal.data(instanceKey);

        if (cachedModal instanceof Modal) {
            return cachedModal;
        }

        const modal = new Modal($modal, options);

        $modal.data(instanceKey, modal);

        return modal;
    }).toArray();
}

/*
 * Return the default page modal
 */
export function defaultModal() {
    return modalFactory('#modal')[0];
}

/*
 * Return the default alert modal
 */
export function alertModal() {
    return modalFactory('#alert-modal')[0];
}

/*
 * Display the given message in the default alert modal
 */
export function showAlertModal(message) {
    const modal = alertModal();
    modal.open();
    modal.updateContent(`<span>${message}</span>`);
}

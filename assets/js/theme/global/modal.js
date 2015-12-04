import $ from 'jquery';
import 'foundation/js/foundation/foundation';
import 'foundation/js/foundation/foundation.reveal';

const bodyActiveClass = 'has-activeModal';

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

function getViewportHeight(multipler) {
    const viewportHeight = $(window).height();

    return viewportHeight * multipler;
}

function wrapModalBody(content) {
    const $modalBody = $('<div>');

    $modalBody
        .addClass('modal-body')
        .html(content);

    return $modalBody;
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
        this.$content = $('.modal-content', this.$modal);
        this.$overlay = $('.loadingOverlay', this.$modal);
        this.defaultSize = size || getSizeFromModal($modal);
        this.size = this.defaultSize;

        this.onModalOpen = this.onModalOpen.bind(this);
        this.onModalClose = this.onModalClose.bind(this);
        this.onModalClosed = this.onModalClosed.bind(this);

        this.bindEvents();
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
    }

    unbindEvents() {
        this.$modal.off(ModalEvents.close, this.onModalClose);
        this.$modal.off(ModalEvents.closed, this.onModalClosed);
        this.$modal.off(ModalEvents.open, this.onModalOpen);
    }

    open({ size } = {}) {
        if (size) {
            this.size = size;
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
    }

    clearContent() {
        this.$content.html('');
    }

    onModalClose() {
        this.size = this.defaultSize;

        $('body').removeClass(bodyActiveClass);
    }

    onModalClosed() {
        this.clearContent();
    }

    onModalOpen() {
        this.pending = true;

        this.$content.css('max-height', getViewportHeight(0.9));

        $('body').addClass(bodyActiveClass);
    }
}

/**
 * Return an array of modals
 * @param {string} selector
 * @param {Object} [options]
 * @param {string} [options.size]
 * @returns {array}
 */
export default function modalFactory(selector = '[data-reveal]', options) {
    const $modals = $(selector);

    return $modals.map((index, element) => {
        const $modal = $(element);
        let modal = $modal.data('modal');

        if (modal instanceof Modal) {
            return modal;
        }

        modal = new Modal($modal, options);
        $modal.data('modal', modal);

        return modal;
    });
}

/*
 * Return the default page modal
 */
export function defaultModal() {
    const modal = modalFactory('#modal')[0];

    return modal;
}

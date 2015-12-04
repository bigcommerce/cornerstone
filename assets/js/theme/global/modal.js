import $ from 'jquery';
import 'foundation/js/foundation/foundation';
import 'foundation/js/foundation/foundation.reveal';

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
        this.$modal.on(ModalEvents.open, this.onModalOpen);
    }

    unbindEvents() {
        this.$modal.off(ModalEvents.close, this.onModalClose);
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

    updateContent(content) {
        this.pending = false;

        this.$content.html(content);
    }

    clearContent() {
        this.$content.html('');
    }

    onModalClose() {
        this.size = this.defaultSize;
    }

    onModalOpen() {
        this.clearContent();
        this.pending = true;
    }
}

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

export function defaultModal() {
    const modal = modalFactory('#modal')[0];

    return modal;
}

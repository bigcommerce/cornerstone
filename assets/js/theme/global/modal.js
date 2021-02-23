import 'jquery.tabbable';
import foundation from './foundation';

const bodyActiveClass = 'has-activeModal';
const loadingOverlayClass = 'loadingOverlay';
const modalBodyClass = 'modal-body';
const modalContentClass = 'modal-content';

const allTabbableElementsSelector = ':tabbable';
const tabKeyCode = 9;
const firstTabbableClass = 'first-tabbable';
const lastTabbableClass = 'last-tabbable';

const SizeClasses = {
    small: 'modal--small',
    large: 'modal--large',
    normal: '',
};

export const modalTypes = {
    QUICK_VIEW: 'forQuickView',
    PRODUCT_DETAILS: 'forProductDetails',
    CART_CHANGE_PRODUCT: 'forCartChangeProduct',
    WRITE_REVIEW: 'forWriteReview',
    SHOW_MORE_OPTIONS: 'forShowMore',
};

const findRootModalTabbableElements = () => (
    $('#modal.open')
        .find(allTabbableElementsSelector)
        .not('#modal-review-form *')
        .not('#previewModal *')
);

const focusableElements = {
    [modalTypes.QUICK_VIEW]: findRootModalTabbableElements,
    [modalTypes.PRODUCT_DETAILS]: () => (
        $('#previewModal.open').find(allTabbableElementsSelector)
    ),
    [modalTypes.CART_CHANGE_PRODUCT]: findRootModalTabbableElements,
    [modalTypes.WRITE_REVIEW]: () => (
        $('#modal-review-form.open').find(allTabbableElementsSelector)
    ),
    [modalTypes.SHOW_MORE_OPTIONS]: findRootModalTabbableElements,
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
    if ($content.length === 0) return;

    const $body = $(`.${modalBodyClass}`, $content);

    if ($body.length === 0) return;

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
        this.$preModalFocusedEl = null;

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

    setupFocusableElements(modalType) {
        this.$preModalFocusedEl = $(document.activeElement);
        const $modalTabbableCollection = focusableElements[modalType]();

        const elementToFocus = $modalTabbableCollection.get(0);
        if (elementToFocus) elementToFocus.focus();

        this.$modal.on('keydown', event => this.onTabbing(event, modalType));
    }

    onTabbing(event, modalType) {
        const isTab = event.which === tabKeyCode;

        if (!isTab) return;

        const $modalTabbableCollection = focusableElements[modalType]();
        const modalTabbableCollectionLength = $modalTabbableCollection.length;

        if (modalTabbableCollectionLength < 1) return;

        const lastCollectionIdx = modalTabbableCollectionLength - 1;
        const $firstTabbable = $modalTabbableCollection.get(0);
        const $lastTabbable = $modalTabbableCollection.get(lastCollectionIdx);

        $modalTabbableCollection.each((index, element) => {
            const $element = $(element);

            if (modalTabbableCollectionLength === 1) {
                $element.addClass(`${firstTabbableClass} ${lastTabbableClass}`);
                return false;
            }

            if ($element.is($firstTabbable)) {
                $element.addClass(firstTabbableClass).removeClass(lastTabbableClass);
            } else if ($element.is($lastTabbable)) {
                $element.addClass(lastTabbableClass).removeClass(firstTabbableClass);
            } else {
                $element.removeClass(firstTabbableClass).removeClass(lastTabbableClass);
            }
        });

        const direction = (isTab && event.shiftKey) ? 'backwards' : 'forwards';

        const $activeElement = $(document.activeElement);

        if (direction === 'forwards') {
            const isLastActive = $activeElement.hasClass(lastTabbableClass);
            if (isLastActive) {
                $firstTabbable.focus();
                event.preventDefault();
            }
        } else if (direction === 'backwards') {
            const isFirstActive = $activeElement.hasClass(firstTabbableClass);
            if (isFirstActive) {
                $lastTabbable.focus();
                event.preventDefault();
            }
        }
    }

    onModalClose() {
        $('body').removeClass(bodyActiveClass);
    }

    onModalClosed() {
        this.size = this.defaultSize;
        if (this.$preModalFocusedEl) this.$preModalFocusedEl.focus();
        this.$preModalFocusedEl = null;
        this.$modal.off('keydown');
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

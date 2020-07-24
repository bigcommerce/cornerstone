import foundation from './foundation';

const bodyActiveClass = 'has-activeModal';
const loadingOverlayClass = 'loadingOverlay';
const modalBodyClass = 'modal-body';
const modalContentClass = 'modal-content';
const focusableElementsSelector = 'button, [href], input, select, textarea, [tabindex]';
const uselessFocusableElementsSelector = '[tabindex="-1"], [type="hidden"]'

const tabKeyCode = 9;

const SizeClasses = {
    small: 'modal--small',
    large: 'modal--large',
    normal: '',
};

const focusableElements = {
    'forQuickView': () => $('#modal')
        .find(focusableElementsSelector)
            .not('#modal-review-form *')
            .not('#previewModal *')
            .not(uselessFocusableElementsSelector)
}

export const modalTypes = {
    QUICK_VIEW: 'forQuickView'
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

    setupFocusableElements(modalType) {
        this.$preModalFocusedEl = $(document.activeElement);
        
        const $collection = focusableElements[modalType]();

        this.findElementToFocus($collection);

        const onTabbingWithArgs = (event) => this.onTabbing(event, modalType, this.findElementToFocus.bind(this));

        $('#modal').on('keydown', onTabbingWithArgs);
    }

    findElementToFocus($candidatesCollection, $reserveCollection = null) {
        $candidatesCollection.each((index, element) => {
            const $focusCanditate = $(element);
            $focusCanditate.focus();
            if ($focusCanditate.is($(document.activeElement))) {
                return false;
            };
            // if no appropriate candidate - find appropriate in full collection
            if (index === $candidatesCollection.length - 1 && $reserveCollection) {
                this.findElementToFocus($reserveCollection);
            };
        });
    }

    onTabbing(event, modalType, findElementToFocus) {
        const isTAB = event.which === tabKeyCode;

        if (!isTAB) return;

        const $collection = focusableElements[modalType]();
        const collectionLastIdx = $collection.length - 1

        const $currentElement = $(document.activeElement);
        const currentElementIdx = $collection.index($currentElement);

        const direction = event.which === tabKeyCode && event.shiftKey ? 'backwards' : 'forwards';
        
        /* to jump to the first or last element (depends on direction)
        if focused element NOT in collection
        it is possible if user will focus for example element with tabindex=-1 using mouse */
        const isValidElementActive = currentElementIdx !== -1;

        let startingPoint;
        if (isValidElementActive) {
            startingPoint = currentElementIdx
        } else if (direction === 'forwards') {
            startingPoint = collectionLastIdx;
        } else if (direction === 'backwards') {
            startingPoint = 0;
        }

        let nextElementIdx;
        let $candidatesCollection;
        let $reserveCollection;
        if (direction === 'forwards') {
            nextElementIdx = startingPoint === collectionLastIdx
                ? 0
                : startingPoint + 1;
            $candidatesCollection = $collection.slice(nextElementIdx);
            $reserveCollection = $collection;
        } else if (direction === 'backwards') {
            nextElementIdx = startingPoint === 0
                ? collectionLastIdx
                : startingPoint - 1;
            $candidatesCollection = $($collection.slice(0, nextElementIdx + 1).get().reverse());
            $reserveCollection = $($collection.get().reverse());
        }

        findElementToFocus($candidatesCollection, $reserveCollection);
        event.preventDefault();   
    }

    onModalClose() {
        $('body').removeClass(bodyActiveClass);
    }

    onModalClosed() {
        this.size = this.defaultSize;
        this.$preModalFocusedEl.focus();
        $('#modal').off(ModalEvents.keyDown);
        this.unbindEvents();
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

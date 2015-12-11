import $ from 'jquery';

const revealCloseAttr = 'reveal-close';
const revealCloseSelector = `[data-${revealCloseAttr}]`;
const revealSelector = '[data-reveal]';

class RevealClose {
    constructor($button) {
        this.$button = $button;
        this.modalId = $button.data(revealCloseAttr);

        this.onClick = this.onClick.bind(this);

        this.bindEvents();
    }

    get modal() {
        let $modal;

        if (this.modalId) {
            $modal = $(`#${this.modalId}`);
        } else {
            $modal = this.$button.parents(revealSelector).eq(0);
        }

        return $modal.data('modal-instance');
    }

    bindEvents() {
        this.$button.on('click', this.onClick);
    }

    unbindEvents() {
        this.$button.off('click', this.onClick);
    }

    onClick(event) {
        const { modal } = this;

        if (modal) {
            event.preventDefault();

            modal.close();
        }
    }
}

/*
 * Extend foundation.reveal with the ability to close a modal by clicking on any of its child element
 * with data-reveal-close attribute.
 *
 * @example
 *
 * <div data-reveal id="helloModal">
 *   <button data-reveal-close>Continue</button>
 * </div>
 *
 * <div data-reveal id="helloModal"></div>
 * <button data-reveal-close="helloModal">Continue</button>
 */
export default function revealCloseFactory(selector = revealCloseSelector, options = {}) {
    const $buttons = $(selector, options.$context);

    return $buttons.map((index, element) => {
        const $button = $(element);
        const instanceKey = `${revealCloseAttr}-instance`;
        const cachedButton = $button.data(instanceKey);

        if (cachedButton instanceof RevealClose) {
            return cachedButton;
        }

        const button = new RevealClose($button);

        $button.data(instanceKey, button);

        return button;
    }).toArray();
}

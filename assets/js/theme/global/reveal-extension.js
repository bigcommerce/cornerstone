import _ from 'lodash';
import $ from 'jquery';

const revealCloseAttr = 'reveal-close';
const revealResetAttr = 'reveal-onload-reset';
const revealAttr = 'reveal';
const revealCloseSelector = `[data-${revealCloseAttr}]`;
const revealResetSelector = `[data-${revealResetAttr}]`;
const revealSelector = `[data-${revealAttr}]`;

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
export function revealClose() {
    function onClick(event) {
        const $target = $(event.currentTarget);
        const modalId = $target.data(_.camelCase(revealCloseAttr));

        let $modal;

        if (modalId) {
            $modal = $(`#${modalId}`);
        } else {
            $modal = $target.parents(revealSelector).eq(0);
        }

        event.preventDefault();

        $modal.foundation('reveal', 'close');
    }

    $(document).on('click', revealCloseSelector, onClick);
}

/*
 * Extend foundation.reveal with the ability to reset a modal's content when it opens
 *
 * @example
 *
 * <div data-reveal data-reveal-onload-reset id="helloModal">
 *   <div class="modal-content"></div>
 *   <div class="loadingOverlay"></div>
 * </div>
 */
export function revealReset() {
    function onOpen(event) {
        const $modal = $(event.currentTarget);

        if (!$modal.is(revealResetSelector)) {
            return;
        }

        const $modalContent = $('.modal-content', $modal);
        const $modalOverlay = $('.loadingOverlay', $modal);

        $modalOverlay.show();
        $modalContent.html('');
    }

    // Perform clean-up when a modal is about to open
    $(document).on('open.fndtn.reveal', revealSelector, onOpen);
}

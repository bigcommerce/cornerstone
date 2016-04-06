import 'foundation-sites/js/foundation/foundation';
import 'foundation-sites/js/foundation/foundation.dropdown';
import 'foundation-sites/js/foundation/foundation.reveal';
import 'foundation-sites/js/foundation/foundation.tab';
import modalFactory from './modal';
import revealCloseFactory from './reveal-close';

export default function ($element) {
    $element.foundation({
        dropdown: {
            // specify the class used for active dropdowns
            active_class: 'is-open',
        },
        reveal: {
            bg_class: 'modal-background',
            dismiss_modal_class: 'modal-close',
            close_on_background_click: true,
        },
        tab: {
            active_class: 'is-active',
        },
    });

    modalFactory('[data-reveal]', { $context: $element });
    revealCloseFactory('[data-reveal-close]', { $context: $element });
}

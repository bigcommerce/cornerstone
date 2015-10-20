import $ from 'jquery';
import 'foundation/js/foundation/foundation';
import 'foundation/js/foundation/foundation.dropdown';
import 'foundation/js/foundation/foundation.reveal';
import 'foundation/js/foundation/foundation.tab';


export default function($element) {
    const $body = $('body');

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
    }).on('open.fndtn.reveal', '[data-reveal]', () => {
        $body.addClass('has-activeModal');
    }).on('close.fndtn.reveal', '[data-reveal]', () => {
        $body.removeClass('has-activeModal');
    });
}

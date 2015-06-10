import $ from 'jquery';
import 'foundation/js/foundation/foundation';
import 'foundation/js/foundation/foundation.dropdown';
import 'foundation/js/foundation/foundation.reveal';

export default function() {
    $(document).foundation({
        dropdown: {
            // specify the class used for active dropdowns
            active_class: 'is-open'
        },
        reveal: {
            bg_class: 'modal-background',
            dismiss_modal_class: 'modal-close'
        }
    });
}

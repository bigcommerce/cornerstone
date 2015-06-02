import 'jquery';
import 'foundation/js/foundation/foundation';
import 'foundation/js/foundation/foundation.dropdown';

export default function() {
    $(document).foundation({
        dropdown: {
            // specify the class used for active dropdowns
            active_class: 'is-open'
        }
    });
}

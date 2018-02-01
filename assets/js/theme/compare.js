import PageManager from './page-manager';
import $ from 'jquery';
import swal from 'sweetalert2';

export default class Compare extends PageManager {
    loaded() {
        const message = this.context.compareRemoveMessage;

        $('body').on('click', '[data-comparison-remove]', event => {
            if (this.context.comparisons.length <= 2) {
                swal({
                    text: message,
                    type: 'error',
                });
                event.preventDefault();
            }
        });
    }
}

import PageManager from './page-manager';
import { showAlertModal } from './global/modal';
import compareProducts from './global/compare-products';

export default class Compare extends PageManager {
    onReady() {
        compareProducts(this.context.urls);

        const message = this.context.compareRemoveMessage;

        $('body').on('click', '[data-comparison-remove]', event => {
            if (this.context.comparisons.length <= 2) {
                showAlertModal(message);
                event.preventDefault();
            }
        });
    }
}

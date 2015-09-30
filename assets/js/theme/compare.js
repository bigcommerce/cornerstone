import PageManager from '../page-manager';

export default class Compare extends PageManager {
    constructor() {
        super();
    }

    loaded() {
        const message = this.context.compareRemoveMessage;

        $('body').on('click', '[data-comparison-remove]', (event) => {
            if (this.context.comparisons.length <= 2) {
                alert(message);
                event.preventDefault();
            }
        });
    }
}

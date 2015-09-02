import PageManager from '../page-manager';

export default class Compare extends PageManager {
    constructor() {
        super();
    }

    loaded() {
        $('body').on('click', '[data-comparison-remove]', (event) => {
            if (this.context.comparisons.length <= 2) {
                alert('You can only compare a minimum of two products');
                event.preventDefault();
            }
        });
    }
}

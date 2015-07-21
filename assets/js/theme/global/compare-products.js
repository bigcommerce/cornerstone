import $ from 'jquery';

export default function () {
    $('body').on('submit', '[data-product-compare]', (event) => {
        let $this = $(event.currentTarget),
            productsToCompare = $this.find('input[name="products\[\]"]:checked');

        if (productsToCompare.length <= 1) {
            alert('You must select at least two products to compare');
            event.preventDefault();
        }
    });
}

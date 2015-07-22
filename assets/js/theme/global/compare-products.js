import $ from 'jquery';
import _ from 'lodash';

function decrementCounter(counter, item) {
    let index = counter.indexOf(item);

    if (index > -1) {
        return counter.splice(index, 1);
    }
}

function incrementCounter(counter, item) {
    return counter.push(item);
}

function updateCounterNav(counter, $link) {
    if (counter.length !== 0) {
        if (!$link.is('visible')) {
            $link.addClass('show');
        }
        $link.attr('href', `/compare/${counter.join('/')}`);
        $('span.compare-count').html(counter.length);
    } else {
        $link.removeClass('show');
    }
}

export default function () {

    let $productsToCompare = $('body').find('input[name="products\[\]"]:checked'),
        products;

    if ($productsToCompare.length !== 0) {
        products = _.map($productsToCompare, (element) => {
            return element.value;
        });

        let $compareLink = $('a[data-compare-nav]');
        updateCounterNav(products, $compareLink);
    }

    let compareCounter = products || [];

    $('body').on('click', '[data-compare-id]', (event) => {
        let product = event.currentTarget.value,
            $compareLink = $('a[data-compare-nav]');

        event.currentTarget.checked ? incrementCounter(compareCounter, product) : decrementCounter(compareCounter, product);
        updateCounterNav(compareCounter, $compareLink);
    });

    $('body').on('submit', '[data-product-compare]', (event) => {
        let $this = $(event.currentTarget),
            productsToCompare = $this.find('input[name="products\[\]"]:checked');

        if (productsToCompare.length <= 1) {
            alert('You must select at least two products to compare');
            event.preventDefault();
        }
    });

    $('body').on('click', 'a[data-compare-nav]', (event) => {
        let $this = $('body').find('input[name="products\[\]"]:checked');

        if ($this.length <= 1) {
            alert('You must select at least two products to compare');
            return false;
        }
    })
}

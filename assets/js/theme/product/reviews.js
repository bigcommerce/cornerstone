import nod from '../common/nod';
import {CollapsibleEvents} from '../common/collapsible';

export default class {
    constructor($reviewForm) {
        this.validator = nod({
            submit: $reviewForm.find('input[type="submit"]')
        });

        this.$reviewsContent = $('#product-reviews');

        this.injectPaginationLink();
        this.collapseReviews();
    }

    collapseReviews() {
        // We're in paginating state, do not collapse
        if (window.location.hash && window.location.hash.indexOf('#product-reviews') == 0) {
            return;
        }

        // force collapse on page load
        $('[data-collapsible]', this.$reviewsContent).trigger(CollapsibleEvents.click);
    }

    /**
     * Inject ID into the pagination link
     */
    injectPaginationLink() {
        const $nextLink = $('.pagination-item--next .pagination-link', this.$reviewsContent),
              $prevLink = $('.pagination-item--previous .pagination-link', this.$reviewsContent);

        if ($nextLink.length) {
            $nextLink.attr('href', $nextLink.attr('href') + '#product-reviews');
        }

        if ($prevLink.length) {
            $prevLink.attr('href', $prevLink.attr('href') + '#product-reviews');
        }
    }

    registerValidation() {
        this.validator.add([{
            selector: '[name="revrating"]',
            validate: 'presence',
            errorMessage: 'The Rating field cannot be blank'
        }, {
            selector: '[name="revtitle"]',
            validate: 'min-length:2',
            errorMessage: 'The Review Subject field cannot be blank'
        }, {
            selector: '[name="revtext"]',
            validate: 'min-length:2',
            errorMessage: 'The Comments field cannot be blank'
        }, {
            selector: '[name="email"]',
            validate: 'min-length:2',
            errorMessage: 'The Email field cannot be blank'
        }]);

        return this.validator;
    }

    validate() {
        return this.validator.performCheck();
    }
}

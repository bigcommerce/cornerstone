import nod from '../common/nod';
import collapsibleFactory, { CollapsibleEvents } from '../common/collapsible';
import forms from '../common/models/forms';
import { safeString } from '../common/utils/safe-string';
import { announceInputErrorMessage } from '../common/utils/form-utils';

export default class {
    constructor({ $reviewForm, $context }) {
        if ($reviewForm && $reviewForm.length) {
            this.validator = nod({
                submit: $reviewForm.find('input[type="submit"]'),
                tap: announceInputErrorMessage,
            });
        }

        this.$context = $context;
        this.$reviewTabLink = $('.productView-reviewTabLink', this.$context);
        this.$reviewsContent = $('#product-reviews', this.$context);
        this.$reviewsContentList = $('#productReviews-content', this.$reviewsContent);
        this.$collapsible = $('[data-collapsible]', this.$reviewsContent);

        if (this.$context) {
            collapsibleFactory('[data-collapsible]', { $context });
        } else {
            this.initLinkBind();
        }

        this.injectPaginationLink();
        this.setupReviews();
    }

    /**
     * On initial page load, the user clicks on "(12 Reviews)" link
     * The browser jumps to the review page and should expand the reviews section
     */
    initLinkBind() {
        const $productReviewLink = $('#productReview_link');
        $productReviewLink
            .attr('href', `${$productReviewLink.attr('href')}${window.location.search}#product-reviews`)
            .on('click', () => this.expandReviews());
    }

    setupReviews() {
        // We're in paginating state, reviews should be visible
        if (
            window.location.hash
            && window.location.hash.indexOf('#product-reviews') === 0
            && this.$reviewsContent.parents('.quickView').length === 0
        ) {
            this.expandReviews();
            return;
        }

        // force collapse on page load
        this.$collapsible.trigger(CollapsibleEvents.click);
    }

    expandReviews() {
        this.$reviewTabLink.trigger('click');

        if (!this.$reviewsContentList.hasClass('is-open')) {
            this.$collapsible.trigger(CollapsibleEvents.click);
        }
    }

    /**
     * Inject ID into the pagination link
     */
    injectPaginationLink() {
        const $nextLink = $('.pagination-item--next .pagination-link', this.$reviewsContent);
        const $prevLink = $('.pagination-item--previous .pagination-link', this.$reviewsContent);

        if ($nextLink.length) {
            $nextLink.attr('href', `${$nextLink.attr('href')} #product-reviews`);
        }

        if ($prevLink.length) {
            $prevLink.attr('href', `${$prevLink.attr('href')} #product-reviews`);
        }
    }

    registerValidation(context) {
        this.context = context;
        this.validator.add([{
            selector: '[name="revrating"]',
            validate: 'presence',
            errorMessage: safeString(this.context.reviewRating),
        }, {
            selector: '[name="revtitle"]',
            validate: 'presence',
            errorMessage: safeString(this.context.reviewSubject),
        }, {
            selector: '[name="revtext"]',
            validate: 'presence',
            errorMessage: safeString(this.context.reviewComment),
        }, {
            selector: '.writeReview-form [name="email"]',
            validate: (cb, val) => {
                const result = forms.email(val);
                cb(result);
            },
            errorMessage: this.context.reviewEmail,
        }]);

        return this.validator;
    }

    validate() {
        return this.validator.performCheck();
    }
}

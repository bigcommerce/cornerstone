/*
 Import all product specific js
 */
import $ from 'jquery';
import PageManager from '../page-manager';
import Review from './product/reviews';
import collapsible from './common/collapsible';
import ProductDetails from './common/product-details';
import videoGallery from './product/video-gallery';
import {classifyForm} from './common/form-utils';

export default class Product extends PageManager {
    constructor() {
        super();
    }

    loaded(next) {
        // Init collapsible
        collapsible();

        this.productDetails = new ProductDetails($('.productView'), this.context);

        videoGallery();

        let $reviewForm = classifyForm('.writeReview-form'),
            validator;

        $('body').on('click', '[data-reveal-id="modal-review-form"]', () => {
            validator = new Review($reviewForm).registerValidation();
        });

        $reviewForm.on('submit', () => {
            if (validator) {
                validator.performCheck();
                return validator.areAll('valid');
            }

            return false;
        });

        next();
    }
}

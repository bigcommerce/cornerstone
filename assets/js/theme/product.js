/*
 Import all product specific js
 */
import PageManager from './page-manager';
import Review from './product/reviews';
import collapsibleFactory from './common/collapsible';
//import ProductDetails from './common/product-details'; This file is not needed by CravenSpeed
import videoGallery from './product/video-gallery';
import { classifyForm } from './common/utils/form-utils';
import modalFactory from './global/modal';

export default class Product extends PageManager {
    constructor(context) {
        super(context);
        this.url = window.location.href;
        this.$reviewLink = $('[data-reveal-id="modal-review-form"]');
        this.$bulkPricingLink = $('[data-reveal-id="modal-bulk-pricing"]');
        this.reviewModal = modalFactory('#modal-review-form')[0];
    }

    onReady() {
        // Listen for foundation modal close events to sanitize URL after review.
        $(document).on('close.fndtn.reveal', () => {
            if (this.url.indexOf('#write_review') !== -1 && typeof window.history.replaceState === 'function') {
                window.history.replaceState(null, document.title, window.location.pathname);
            }
        });

        let validator;

        // Init collapsible
        collapsibleFactory();

        $('body').on('click', '[data-reveal-id="modal-images"]', (event) => {
            var startIndex = $(event.target).index();
            console.log('startIndex: ' + startIndex);

            this.initModalGallery(startIndex);
        });

        $('#modal-images').on('close.fndtn.reveal', () => {
            $('.slick-carousel-modal').slick('unslick');
        })

        // CravenSpeed Theme does not use ProductDetails 
        //this.productDetails = new ProductDetails($('.productView'), this.context, window.BCData.product_attributes); 
        //this.productDetails.setProductVariant();

        videoGallery();

        this.bulkPricingHandler();

        const $reviewForm = classifyForm('.writeReview-form');

        if ($reviewForm.length === 0) return;

        const review = new Review({ $reviewForm });

        $('body').on('click', '[data-reveal-id="modal-review-form"]', () => {
            validator = review.registerValidation(this.context);
            this.ariaDescribeReviewInputs($reviewForm);
        });
        
        $reviewForm.on('submit', () => {
            if (validator) {
                validator.performCheck();
                return validator.areAll('valid');
            }
            
            return false;
        });
        
        this.productReviewHandler();
    }
    

    initModalGallery(startIndex) {
        console.log('init modal gallery');

        $('#modal-images .modal-content').append('<button class="modal-close" type="button" title="Close"> <span class="aria-description--hidden">Close</span> <span aria-hidden="true">&#215;</span> </button>');
        $('#modal-images .modal-content').append('<div class="modal-slides"><div class="slick-carousel-modal"></div></div>');

        $('.slick-track .slick-slide').each(function() {
            let background = $(this).css('background');
            let urlRegex = /url\("([^"]+)"/;
            let url = background.match(urlRegex)[1];
            let modalSlide = $('<div class="modal-slide"></div>');
            let img = $('<img>').attr('src', url);
            modalSlide.append(img);
            $('.slick-carousel-modal').append(modalSlide);
            console.log('slide added');
        });
        
        // Initialize the modal carousel
        $('.slick-carousel-modal').slick({
            initialSlide: startIndex,
            arrows: true,
            infinite: false
        });

        $('.slick-carousel-modal').slick('refresh');
    }

    ariaDescribeReviewInputs($form) {
        $form.find('[data-input]').each((_, input) => {
            const $input = $(input);
            const msgSpanId = `${$input.attr('name')}-msg`;

            $input.siblings('span').attr('id', msgSpanId);
            $input.attr('aria-describedby', msgSpanId);
        });
    } 

    productReviewHandler() {
        if (this.url.indexOf('#write_review') !== -1) {
            this.$reviewLink.trigger('click');
        }
    }

    bulkPricingHandler() {
        if (this.url.indexOf('#bulk_pricing') !== -1) {
            this.$bulkPricingLink.trigger('click');
        }
    }
}

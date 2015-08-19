import $ from 'jquery';
import 'foundation/js/foundation/foundation';
import 'foundation/js/foundation/foundation.reveal';
import nod from './common/nod';
import PageManager from '../page-manager';

export default class WishList extends PageManager {
    constructor() {
        super();

        this.options = {
            template: 'account/add-wishlist'
        };
    }

    /**
     * Creates a confirm box before deleting all wish lists
     */
    wishlistDeleteConfirm() {
        $('body').on('click', '[data-wishlist-delete]', (event) => {
            let confirmed = confirm(this.context.wishlistDelete);
            if (confirmed) {
                return true;
            }

            event.preventDefault()
        });
    }

    registerAddWishListValidation($addWishlistForm) {
        this.addWishlistValidator = nod({
            submit: '.wishlist-form input[type="submit"]'
        });

        this.addWishlistValidator.add([
            {
                selector: '.wishlist-form input[name="wishlistname"]',
                validate: (cb, val) => {
                    let result = val.length > 0;
                    cb(result);
                },
                errorMessage: "You must enter a wishlist name"
            }
        ]);

        $addWishlistForm.submit((event) => {
            this.addWishlistValidator.performCheck();

            if (this.addWishlistValidator.areAll('valid')) {
                return;
            }

            event.preventDefault();
        });
    }

    wishListHandler() {
        $('body').on('click', '[data-wishlist]', (event) => {
            let $wishListUrl = event.currentTarget.href;

            event.preventDefault();

            this.getPageModal($wishListUrl, this.options, (err, data) => {
                if (err) {
                    data.modal.$content.text(err);
                }

                let $wishListForm = $('.wishlist-form', data.modal.$content);

                this.registerAddWishListValidation($wishListForm);
            });
        });
    }

    loaded(next) {

        let $addWishListForm = $('.wishlist-form');

        if ($addWishListForm.length) {
            this.registerAddWishListValidation($addWishListForm);
        }

        this.wishlistDeleteConfirm();
        this.wishListHandler();

        next();
    }
}

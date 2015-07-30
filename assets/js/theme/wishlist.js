import $ from 'jquery';
import 'foundation/js/foundation/foundation';
import 'foundation/js/foundation/foundation.reveal';
import nod from './common/nod';
import PageManager from '../page-manager';

export default class WishList extends PageManager {
    constructor() {
        super();

        let $addWishlistForm = $('.wishlist-form');

        this.wishlistDeleteConfirm();

        if ($addWishlistForm.length) {
            this.registerAddWishlistValidation($addWishlistForm);
        }
    }

    /**
     * Creates a confirm box before deleting all wishlists
     */
    wishlistDeleteConfirm() {
        $('#wishlist-delete').on('click',(event) => {
            let confirmed = confirm('This will delete all your wishlists');
            if (confirmed) {
                return;
            }
            return false
        });
    }

    registerAddWishlistValidation($addWishlistForm) {
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


}

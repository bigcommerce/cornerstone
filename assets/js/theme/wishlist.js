import 'foundation-sites/js/foundation/foundation';
import 'foundation-sites/js/foundation/foundation.reveal';
import nod from './common/nod';
import PageManager from './page-manager';
import swal from './global/sweet-alert';

export default class WishList extends PageManager {
    constructor(context) {
        super(context);

        this.options = {
            template: 'account/add-wishlist',
        };

        return this;
    }

    /**
     * Creates a confirm box before deleting all wish lists
     */
    wishlistDeleteConfirm() {
        // Keep track of swal popup answer
        let isConfirmed = false;

        $('[data-wishlist-delete]').on('submit', event => {
            // If answered "ok" previously continue submitting the form.
            if (isConfirmed) {
                return true;
            }

            const message = this.context.wishlistDelete;

            // Confirm is not ok yet so prevent the form from submitting and show the message.
            event.preventDefault();

            swal.fire({
                icon: 'warning',
                text: message,
                showCloseButton: true,
                showCancelButton: true,
                reverseButtons: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    isConfirmed = true;
                    $(event.currentTarget).trigger('submit');
                }
            });
        });
    }

    registerAddWishListValidation($addWishlistForm) {
        this.addWishlistValidator = nod({
            submit: '.wishlist-form input[type="submit"]',
        });

        this.addWishlistValidator.add([
            {
                selector: '.wishlist-form input[name="wishlistname"]',
                validate: (cb, val) => {
                    const result = val.length > 0;

                    cb(result);
                },
                errorMessage: 'You must enter a wishlist name.',
            },
        ]);

        $addWishlistForm.on('submit', event => {
            this.addWishlistValidator.performCheck();

            if (this.addWishlistValidator.areAll('valid')) {
                return;
            }

            event.preventDefault();
        });
    }

    onReady() {
        const $addWishListForm = $('.wishlist-form');

        if ($addWishListForm.length) {
            this.registerAddWishListValidation($addWishListForm);
        }

        this.wishlistDeleteConfirm();
    }
}

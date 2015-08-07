import $ from 'jquery';
import { api } from 'bigcommerce/stencil-utils';
import 'foundation/js/foundation/foundation';
import 'foundation/js/foundation/foundation.reveal';
import nod from './common/nod';
import PageManager from '../page-manager';

export default class WishList extends PageManager {
    constructor() {
        super();
        this.modalConfig = {
            modal: $('#modal'),
            modalContent: $('.modal-content', this.modal),
            modalOverlay: $('.loadingOverlay', this.modal)
        };

        let $addWishListForm = $('.wishlist-form');

        this.wishlistDeleteConfirm();

        if ($addWishListForm.length) {
            this.registerAddWishListValidation($addWishListForm);
        }

        // Initialize wish list listener
        this.wishListHandler();
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

    wishListModal(url, template) {
        // clear the modal
        this.modalConfig.modalContent.html('');
        this.modalConfig.modalOverlay.show();

        // open modal
        this.modalConfig.modal.foundation('reveal', 'open');

        api.getPage(url, {template: template}, (err, content) => {
            if (err) {
                throw new Error(err);
            }

            this.modalConfig.modalOverlay.hide();
            this.modalConfig.modalContent.html(content);
        });
    }

    wishListHandler() {
        $('body').on('click','[data-wishlist]', (event) => {
            let $wishListUrl = event.currentTarget.href;
            this.wishListModal($wishListUrl, 'account/add-wishlist');

            event.preventDefault();
        });
    }
}

import $ from 'jquery';
import PageManager from '../page-manager';

export default class WishList extends PageManager {
    constructor() {
        this.wishlistDeleteConfirm();
        this.createWishlist();
        super();
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

    /**
     * Opens modal that display add-wishlist.html component
     */
    createWishlist() {
        $('#wishlist-create').on('click', (event) => {
            event.preventDefault();
            let $wishListModalContent = $('#wishlist-modal').html();
            this.wishlistModal($wishListModalContent);
        })
    }

    /**
     * Modal code that contains the add-wishlist component
     * @param template
     */
    wishlistModal(template) {
        let $modal = $('#modal'),
            $modalContent = $('.modal-content', $modal),
            $modalOverlay = $('.loadingOverlay', $modal);

        $modalContent.html('');
        $modalOverlay.show();

        $modal.foundation('reveal', 'open');

        $modalOverlay.hide();
        console.log(template);
        $modalContent.html(template);


    }
}

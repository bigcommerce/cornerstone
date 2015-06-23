import $ from 'jquery';
import 'foundation/js/foundation/foundation';
import 'foundation/js/foundation/foundation.reveal';
import PageManager from '../page-manager';

export default class WishList extends PageManager {
    constructor() {
        super();
        this.wishlistDeleteConfirm();
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
}

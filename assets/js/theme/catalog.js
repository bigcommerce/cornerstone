import PageManager from './page-manager';
import urlUtils from './common/utils/url-utils';
import Url from 'url';

export default class CatalogPage extends PageManager {
    constructor(context) {
        super(context);

        window.addEventListener('beforeunload', () => {
            if (document.activeElement.id === 'sort') {
                window.localStorage.setItem('sortByStatus', 'selected');
            }
        });
    }

    arrangeFocusOnSortBy() {
        const $sortBySelector = $('[data-sort-by="product"] #sort');

        if (window.localStorage.getItem('sortByStatus')) {
            $sortBySelector.focus();
            window.localStorage.removeItem('sortByStatus');
        }
    }

    onSortBySubmit(event, currentTarget) {
        const url = Url.parse(window.location.href, true);
        const queryParams = $(currentTarget).serialize().split('=');

        url.query[queryParams[0]] = queryParams[1];
        delete url.query.page;

        event.preventDefault();
        window.location = Url.format({ pathname: url.pathname, search: urlUtils.buildQueryString(url.query) });
    }
}

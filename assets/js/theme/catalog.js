import PageManager from './page-manager';
import urlUtils from './common/utils/url-utils';
import Url from 'url';

export default class CatalogPage extends PageManager {
    onSortBySubmit(event, currentTarget) {
        const url = Url.parse(window.location.href, true);
        const queryParams = $(currentTarget).serialize().split('=');

        url.query[queryParams[0]] = queryParams[1];
        delete url.query.page;

        event.preventDefault();
        window.location = Url.format({ pathname: url.pathname, search: urlUtils.buildQueryString(url.query) });
    }
}

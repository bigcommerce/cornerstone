import $ from 'jquery';
import _ from 'lodash';
import ko from 'knockout';
import utils from 'bigcommerce/stencil-utils';

export default function () {
    let $quickSearchResults = $('.quickSearchResults');

    //stagger searching for 400ms after last input
    let doSearch = _.debounce((searchQuery) => {
        utils.api.search.search(searchQuery, {template: 'search/quick-results'}, (err, response) => {
            $quickSearchResults.html(response);
        });
    }, 400);

    utils.hooks.on('search-quick', (event) => {
        let searchQuery = $(event.currentTarget).val();

        // server will only perform search with at least 3 characters
        if (searchQuery.length < 3) {
            return;
        }

        doSearch(searchQuery);
    });
}

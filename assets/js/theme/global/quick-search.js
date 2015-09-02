import $ from 'jquery';
import _ from 'lodash';
import utils from 'bigcommerce/stencil-utils';
import stencilDropDown from './stencil-dropdown';

export default function() {
    const TOP_STYLING = 'top: 49px;';

    let $quickSearchResults = $('.quickSearchResults');
    let $quickSearchDiv = $('#quickSearch');

    stencilDropDown.bind($('[data-search="quickSearch"]'), $quickSearchDiv, TOP_STYLING);

    // stagger searching for 200ms after last input
    let doSearch = _.debounce((searchQuery) => {
        utils.api.search.search(searchQuery, {template: 'search/quick-results'}, (err, response) => {
            if (err) {
                throw new Error(err);
            }
            $quickSearchResults.html(response);
        });
    }, 200);

    utils.hooks.on('search-quick', (event) => {
        let searchQuery = $(event.currentTarget).val();

        // server will only perform search with at least 3 characters
        if (searchQuery.length < 3) {
            return;
        }

        doSearch(searchQuery);
    });
}

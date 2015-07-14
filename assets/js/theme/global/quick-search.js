import $ from 'jquery';
import _ from 'lodash';
import utils from 'bigcommerce/stencil-utils';
import stencilDropdown from './stencil-dropdown'

function hideDropdown($searchDiv) {
    $searchDiv.removeClass('is-open f-open-dropdown').attr('style', 'top: 0px').attr('aria-hidden', 'true');
}

function showDropdown($searchDiv, event) {
    $searchDiv.addClass('is-open f-open-dropdown').attr('style', 'top: 49px;').attr('aria-hidden', 'false');
    event.stopPropagation();
}

export default function () {
    let $quickSearchResults = $('.quickSearchResults');
    let $quickSearchDiv = $('#quickSearch');

    stencilDropdown.bind($('[data-search="quickSearch"]'), $quickSearchDiv, 'top: 49px;');

    //stagger searching for 200ms after last input
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

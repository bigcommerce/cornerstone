import $ from 'jquery';
import _ from 'lodash';
import ko from 'knockout';
import utils from 'bigcommerce/stencil-utils';

export default function () {
    let quickSearchViewModel = {
            results: ko.observable('')
        },
        options = {
            template: 'search/quick-results'
        };

    ko.applyBindings(quickSearchViewModel, $('.quickSearchResults').get(0));

    //stagger searching for 400ms after last input
    let doSearch = _.debounce((searchQuery) => {
        utils.api.search.search(searchQuery, options, (err, response) => {
            quickSearchViewModel.results(response.content);
        });
    }, 400);

    utils.hooks.on('search-quick', (event) => {
        let searchQuery = $(event.currentTarget).val();

        if (searchQuery.length < 3) return; // server will only perform search with at least 3 characters

        doSearch(searchQuery);
    });
}

import $ from 'jquery';
import _ from 'lodash';
import ko from 'knockout';
import utils from 'bigcommerce/stencil-utils';

export default function () {
    let quickSearchViewModel = {
            results: ko.observable('')
        },
        params = {
            render_with: 'search/quick-results'
        };

    ko.applyBindings(quickSearchViewModel, $('.quickSearchResults').get(0));

    //stagger searching for 400ms after last input
    let doSearch = _.debounce((searchQuery) => {
        utils.remote.search.search(searchQuery, params, (err, data) => {
            quickSearchViewModel.results(data);
        });
    }, 400);

    utils.events.on('input', 'search-quick', (event, ele) => {
        let searchQuery = $(ele).val();

        if (searchQuery.length < 3) return; //server will only perform search with at least 3 characters

        doSearch(searchQuery);
    });
}

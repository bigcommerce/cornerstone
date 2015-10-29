import $ from 'jquery';
import _ from 'lodash';
import utils from 'bigcommerce/stencil-utils';
import stencilDropDown from './stencil-dropdown';
import nod from '../common/nod';

let internals = {
    initValidation($form) {
        this.validator = nod({
            submit: $form
        });

        return this;
    },
    bindValidation(element) {
        if (this.validator) {
            this.validator.add({
                selector: element,
                validate: 'presence',
                errorMessage: element.data('error-message')
            });
        }

        return this;
    },
    checkElement() {
        if (this.validator) {
            this.validator.performCheck();
            return this.validator.areAll('valid');
        }
        return false;
    }
};

export default function() {
    const TOP_STYLING = 'top: 49px;';
    const $quickSearchResults = $('.quickSearchResults');
    const $quickSearchDiv = $('#quickSearch');
    let validator = internals.initValidation($quickSearchDiv).bindValidation($quickSearchDiv.find('#search_query'));

    stencilDropDown.bind($('[data-search="quickSearch"]'), $quickSearchDiv, TOP_STYLING);

    // stagger searching for 200ms after last input
    const doSearch = _.debounce((searchQuery) => {
        utils.api.search.search(searchQuery, {template: 'search/quick-results'}, (err, response) => {
            if (err) {
                return false;
            }

            $quickSearchResults.html(response);
        });
    }, 200);

    utils.hooks.on('search-quick', (event) => {
        const searchQuery = $(event.currentTarget).val();

        // server will only perform search with at least 3 characters
        if (searchQuery.length < 3) {
            return;
        }

        doSearch(searchQuery);
    });

    // Catch the submission of the quick-search
    $quickSearchDiv.on('submit', (event) => {
        if (!validator.checkElement()) {
            return event.preventDefault();
        }

        return true;
    });
}

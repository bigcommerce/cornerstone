import $ from 'jquery';
import _ from 'lodash';
import utils from 'bigcommerce/stencil-utils';
import StencilDropDown from './stencil-dropdown';
import nod from '../common/nod';

const internals = {
    initValidation($form) {
        this.validator = nod({
            delay: 1,
            submit: $form,
        });

        return this;
    },
    bindValidation(element) {
        if (this.validator) {
            this.validator.add({
                selector: element,
                validate: 'presence',
                errorMessage: element.data('error-message'),
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
    },
    unBindValidation(element) {
        if (this.validator) {
            this.validator.remove(element);
        }

        return this;
    },
};

export default function() {
    let stencilDropDown;
    const TOP_STYLING = 'top: 49px;';
    const $quickSearchResults = $('.quickSearchResults');
    const $quickSearchDiv = $('#quickSearch');
    const validator = internals.initValidation($quickSearchDiv);
    const $searchQuery = $('#search_query');
    const stencilDropDownExtendables = {
        hide: () => {
            validator.unBindValidation($quickSearchDiv.find('#search_query'));
            $searchQuery.blur();
        },
        show: (event) => {
            validator.bindValidation($quickSearchDiv.find('#search_query'));
            $searchQuery.focus();
            event.stopPropagation();
        },
        onBodyClick: (e, $container) => {
            // If the target element has this data tag or one of it's parents, do not close the search results
            // We have to specify `.modal-background` because of limitations around Foundation Reveal not allowing
            // any modification to the background element.
            if ($(e.target).closest('[data-prevent-quick-search-close], .modal-background').length === 0) {
                stencilDropDown.hide($container);
            }
        },
    };

    stencilDropDown = new StencilDropDown(stencilDropDownExtendables);
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

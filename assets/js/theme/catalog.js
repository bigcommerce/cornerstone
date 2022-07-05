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
        
        $('#product-listView, #product-gridView').on('click', e => {
            $('.search-item').removeClass('active');
            
            if (e.target.closest('a').id === 'product-gridView') {
                $('.productGrid').removeClass('list-view');
            } else {
                $('.productGrid').addClass('list-view');
            }
            
            $(e.target.closest('a')).addClass('active');
        });
        
        $(window).on('resize', function () {
            if ($(window).width() < 801) {
                if ($('#product-listView').hasClass('active')) {
                    sessionStorage.setItem('wasList', true);
                }
                $(".productGrid").removeClass("list-view");
                $('.search-item').removeClass('active');
                $('#product-gridView').addClass('active');
            } else {
                if (sessionStorage.getItem('wasList')) {
                    $(".productGrid").addClass("list-view");
                    $('.search-item').removeClass('active');
                    $('#product-listView').addClass('active');
                    sessionStorage.removeItem('wasList');
                }
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
    
    onSidebarToggle(event) {
        let toggleLink = event.target.closest('.toggleLink');
        $(`#${toggleLink.dataset.collapsible}`).toggleClass('is-open');
    }
}

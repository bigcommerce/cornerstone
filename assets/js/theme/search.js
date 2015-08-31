import PageManager from '../page-manager';
import FacetedSearch from './common/faceted-search';
import jstree from 'vakata/jstree';
import collapsible from './common/collapsible';

export default class Search extends PageManager {
    constructor() {
        let $productListingContainer = $('#product-listing-container'),
            $contentResultsContainer = $('#search-results-content'),
            $facetedSearchContainer = $('#faceted-search-container'),
            requestOptions = {
                template: {
                    productListing: 'search/product-listing',
                    sidebar: 'search/sidebar'
                }
            };

        super();

        new FacetedSearch(requestOptions, function(content) {
            $productListingContainer.html(content.productListing);
            $facetedSearchContainer.html(content.sidebar);

            $("html, body").animate({
                scrollTop: 0
            }, 100);
        });

        // Initially hidden via JS so non JS can see it at the start
        $contentResultsContainer.addClass('u-hiddenVisually');

        $('[data-product-results-toggle]').click((event) => {
            $productListingContainer.removeClass('u-hiddenVisually');
            $contentResultsContainer.addClass('u-hiddenVisually');
        });

        $('[data-content-results-toggle]').click((event) => {
            $contentResultsContainer.removeClass('u-hiddenVisually');
            $productListingContainer.addClass('u-hiddenVisually');
        });
    }

    formatCategoryTreeForJSTree(node) {
        let nodeData = {
            text: node.data,
            id: node.metadata.id,
            state: {
                selected: node.selected
            }
        };

        if (node.state) {
            nodeData.state.opened = node.state == 'open';
            nodeData.children = true;
        }

        if (node.children) {
            nodeData.children = [];
            node.children.forEach((childNode) => {
                nodeData.children.push(this.formatCategoryTreeForJSTree(childNode));
            });
        }

        return nodeData;
    }

    loaded() {
        let $searchForm = $('[data-advanced-search-form]'),
            $categoryTreeContainer = $searchForm.find('[data-search-category-tree]'),
            treeData = [];

        collapsible();

        this.context.categoryTree.forEach((node) => {
           treeData.push(this.formatCategoryTreeForJSTree(node));
        });

        this.categoryTreeData = treeData;
        this.createCategoryTree($categoryTreeContainer);

        $searchForm.submit((event) => {
            let selectedCategoryIds = $categoryTreeContainer.jstree().get_selected();
            $searchForm.find('input[name="category\[\]"]').remove();

            for (let categoryId of selectedCategoryIds) {

                let input = $('<input>', {
                    type: 'hidden',
                    name: 'category[]',
                    value: categoryId
                });

                $searchForm.append(input);
            }
        });
    }

    loadTreeNodes(node, cb) {
        $.ajax({
            url: '/remote/v1/category-tree',
            data: {
                selectedCategoryId: node.id,
                prefix: 'category'
            },
            success: (data) => {
                let formattedResults = [];

                data.forEach((node) => {
                    formattedResults.push(this.formatCategoryTreeForJSTree(node));
                });

                cb(formattedResults);
            }
        });
    }

    createCategoryTree($container) {
        let treeOptions = {
            core: {
                data: (node, cb) => {
                    // Root node
                    if (node.id === '#') {
                        cb(this.categoryTreeData);
                    } else {
                        // Lazy loaded children
                        this.loadTreeNodes(node, cb);
                    }
                },
                themes: {
                    icons: false
                }
            },
            checkbox: {
                three_state: false
            },
            plugins: [ "checkbox" ]
        };

        $container.jstree(treeOptions);
    }
}

import PageManager from '../page-manager';
import FacetedSearch from './common/faceted-search';
import collapsible from './common/collapsible';
import 'vakata/jstree';

export default class Search extends PageManager {
    constructor() {
        const $productListingContainer = $('#product-listing-container');
        const $contentResultsContainer = $('#search-results-content');
        const $facetedSearchContainer = $('#faceted-search-container');
        const requestOptions = {
            template: {
                productListing: 'search/product-listing',
                sidebar: 'search/sidebar'
            }
        };

        super();

        this.facetedSearch = new FacetedSearch(requestOptions, (content) => {
            $productListingContainer.html(content.productListing);
            $facetedSearchContainer.html(content.sidebar);

            $('html, body').animate({
                scrollTop: 0
            }, 100);
        });

        // Initially hidden via JS so non JS can see it at the start
        $contentResultsContainer.addClass('u-hiddenVisually');

        $('[data-product-results-toggle]').click(() => {
            $productListingContainer.removeClass('u-hiddenVisually');
            $contentResultsContainer.addClass('u-hiddenVisually');
        });

        $('[data-content-results-toggle]').click(() => {
            $contentResultsContainer.removeClass('u-hiddenVisually');
            $productListingContainer.addClass('u-hiddenVisually');
        });
    }

    formatCategoryTreeForJSTree(node) {
        const nodeData = {
            text: node.data,
            id: node.metadata.id,
            state: {
                selected: node.selected
            }
        };

        if (node.state) {
            nodeData.state.opened = node.state === 'open';
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
        const $searchForm = $('[data-advanced-search-form]');
        const $categoryTreeContainer = $searchForm.find('[data-search-category-tree]');
        const treeData = [];

        collapsible();

        this.context.categoryTree.forEach((node) => {
            treeData.push(this.formatCategoryTreeForJSTree(node));
        });

        this.categoryTreeData = treeData;
        this.createCategoryTree($categoryTreeContainer);

        $searchForm.submit(() => {
            const selectedCategoryIds = $categoryTreeContainer.jstree().get_selected();

            $searchForm.find('input[name="category\[\]"]').remove();

            for (const categoryId of selectedCategoryIds) {
                const input = $('<input>', {
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
                const formattedResults = [];

                data.forEach((dataNode) => {
                    formattedResults.push(this.formatCategoryTreeForJSTree(dataNode));
                });

                cb(formattedResults);
            }
        });
    }

    createCategoryTree($container) {
        const treeOptions = {
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
            plugins: [ 'checkbox' ]
        };

        $container.jstree(treeOptions);
    }
}

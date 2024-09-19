/* eslint-disable indent */
import { NUM_OF_PRODUCTS } from './constants';

function renderPrice(node, themeSettings) {
    const { price, retailPrice } = node.prices || { price: {} };
    return `
    <div class="price-section price-section--withoutTax rrp-price--withoutTax"${!retailPrice ? ' style="display: none;"' : ''}>
        ${themeSettings['pdp-retail-price-label']}
        <span data-product-rrp-price-without-tax class="price price--rrp"> 
            ${retailPrice ? `${retailPrice.value} ${retailPrice.currencyCode}` : ''}
        </span>
    </div>
    <div class="price-section price-section--withoutTax">
        <span class="price-label">
            ${themeSettings['pdp-price-label']}
        </span>
        <span data-product-price-without-tax class="price price--withoutTax">${price.value} ${price.currencyCode}</span>
    </div>
    `;
}

function renderRestrictToLogin() {
    return '<p translate>Log in for pricing</p>';
}

function renderCard(node, options) {
    const { themeSettings } = options;
    const categories = node.categories.edges.map(({ node: cNode }) => cNode.name).join(',');
    const productUrl = node.path;
    const addToCartUrl = node.addToCartUrl;

    return `<div class="productCarousel-slide">
                <article
                    class="card"
                    data-entity-id="${node.entityId}"
                    data-event-type=""
                    data-name="${node.name}"
                    data-product-brand="${node.brand && node.brand.name ? node.brand.name : ''}"
                    data-product-price="${node.prices && node.prices.price.value}"
                    data-product-category="${categories}"
                    data-position=""
                >
                    <figure class="card-figure">
                        <a href="${productUrl}" data-event-type="product-click">
                            <div class="card-img-container">
                                ${node.defaultImage ?
                                    `<img
                                        src="${node.defaultImage.urlOriginal}"
                                        alt="${node.name}"
                                        title="${node.name}"
                                        data-sizes="auto"
                                        srcset-bak=""
                                        class="card-image${themeSettings.lazyload_mode ? ' lazyload' : ''}"
                                    />` : ''
                                }
                                
                            </div>
                        </a>
                        <figcaption class="card-figcaption">
                            <div class="card-figcaption-body">
                                ${themeSettings.show_product_quick_view
                                    ? `<a class="button button--small card-figcaption-button quickview"
                                          data-product-id="${node.entityId}
                                          data-event-type="product-click"
                                      >Quick view</a>`
                                    : ''}
                                <a href="${addToCartUrl}" data-event-type="product-click" class="button button--small card-figcaption-button">Add to Cart</a>
                            </div>
                        </figcaption>
                    </figure>
                    <div class="card-body">
                        ${node.brand && node.brand.name ? `<p class="card-text" data-test-info-type="brandName">${node.brand.name}</p>` : ''}
                        <h4 class="card-title">
                            <a href="${productUrl}" data-event-type="product-click">${node.name}</a>
                        </h4>
                        <div class="card-text" data-test-info-type="price">
                            ${themeSettings.restrict_to_login ? renderRestrictToLogin() : renderPrice(node, themeSettings)}
                        </div>
                    </div>
                </article>
            </div>`;
}

function createFallbackContainer(carousel) {
    const container = $('[itemscope] > .tabs-contents');
    const tabs = $('[itemscope] > .tabs');
    tabs.html(`
        <li class="tab is-active" role="presentational">
            <a class="tab-title" href="#tab-related" role="tab" tabindex="0" aria-selected="true" controls="tab-related">Related products</a>
        </li>
    `);
    container.html(`
        <div role="tabpanel" aria-hidden="false" class="tab-content has-jsContent is-active recommendations" id="tab-related">
            ${carousel}
        </div>
    `);
}

export default function injectRecommendations(products, el, options) {
    const cards = products
        .slice(0, NUM_OF_PRODUCTS)
        .map((product) => renderCard(product, options))
        .join('');

    const carousel = `
        <section
            class="productCarousel"
            data-list-name="Recommended Products"
            data-slick='{
                "dots": true,
                "infinite": false,
                "mobileFirst": true,
                "slidesToShow": 2,
                "slidesToScroll": 2,
                "responsive": [
                    {
                        "breakpoint": 800,
                        "settings": {
                            "slidesToShow": ${NUM_OF_PRODUCTS},
                            "slidesToScroll": 3
                        }
                    },
                    {
                        "breakpoint": 550,
                        "settings": {
                            "slidesToShow": 3,
                            "slidesToScroll": 3
                        }
                    }
                ]
            }'
        >
            ${cards}
        </section>`;
    // eslint-disable-next-line no-param-reassign
    if (!el.get(0)) {
        createFallbackContainer(carousel);
    } else {
        el.html(carousel);
    }
}

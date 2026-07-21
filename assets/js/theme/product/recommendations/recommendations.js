import gql from './graphql';
import { EVENT_TYPE, NUM_OF_PRODUCTS, SERVICE_CONFIG_ID } from './constants';
import injectRecommendations from './recommendations-carousel';
import { showOverlay, hideOverlay, getSizeFromThemeSettings } from './utils';

/*
 * Invokes graphql query
 * @param {string} id - product id
 * @param {string} storefrontAPIToken - token from settings
 * @param {string} imageSize - e.g. '500x569'
 * @param {number} pageSize - number of products to be fetched
 * returns {Object}
 * */
function getRecommendations(id, serviceConfigId, storefrontAPIToken, imageSize, pageSize, validateOnly = false) {
    return gql(
        `query ProductRecommendations($id: Int!, $includeTax: Boolean, $eventType: String!, $pageSize: Int!, $serviceConfigId: String!, $validateOnly: Boolean!) {
                  site {
                    apiExtensions {
                      googleRetailApiPrediction(
                        pageSize: $pageSize
                        userEvent: {
                          eventType: $eventType,
                          productDetails: [{ entityId: $id, count: 1 }]
                        }
                        servingConfigId: $serviceConfigId
                        validateOnly: $validateOnly
                      ) {
                        attributionToken
                        results {
                          name
                          entityId
                          path
                          brand {
                            name
                          }
                          prices(includeTax:$includeTax) {
                            price {
                              value
                              currencyCode
                            }
                            salePrice {
                              value
                              currencyCode
                            }
                            retailPrice {
                              value
                              currencyCode
                            }
                          }
                          categories {
                            edges {
                                node {
                                    name
                                }
                            }
                          }
                          defaultImage {
                            urlOriginal
                          }
                          addToCartUrl
                          availability
                        }
                      }
                    }
                  }
                }`,
        {
            id: Number(id), includeTax: false, eventType: EVENT_TYPE, pageSize, serviceConfigId, validateOnly,
        },
        storefrontAPIToken,
    );
}

/*
 * Carries out a flow with recommendations:
 * 1. Queries qraphql endpoint for recommended products information
 * 2. Creates carousel with product cards in "Related products" section
 * @param {Element} el - parent DOM element which carousel with products will be attached to
 * @param {Object} options - productId, customerId, settings, themeSettings
 * returns {Promise<void>}
 * */
export default function applyRecommendations(el, options) {
    const consentManager = window.consentManager;

    // Do not load recommendations if user has opted out of advertising consent category
    if (consentManager) {
        const customerPreferences = consentManager.preferences.loadPreferences().customPreferences;
        if (customerPreferences && !customerPreferences.advertising) return;
    }

    const { productId, themeSettings, storefrontAPIToken } = options;
    const imageSize = getSizeFromThemeSettings(themeSettings.productgallery_size);

    showOverlay(el);

    return getRecommendations(
        productId,
        SERVICE_CONFIG_ID,
        storefrontAPIToken,
        imageSize,
        NUM_OF_PRODUCTS,
    )
        .then((response) => {
            const { results: products } = response.data.site.apiExtensions.googleRetailApiPrediction;

            injectRecommendations(products, el, {
                products,
                themeSettings,
                productId,
            });
        })
        .catch(err => {
            // eslint-disable-next-line no-console
            console.error('Error happened during recommendations load', err);
        })
        .then(() => hideOverlay(el));
}

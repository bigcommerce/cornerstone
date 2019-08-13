import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';


/**
 * Run a basic request against the GraphQL Storefront API using Apollo Client and log the results to the browser console
 */
export default function (token) {
    const client = new ApolloClient({
        headers: { Authorization: `Bearer ${token}` },
    });

    client.query({
        query: gql`
            query MyFirstQuery {
                site {
                    settings {
                        storeName
                    }
                    products(first:5) {
                        edges {
                            node {
                                name
                                sku
                                prices {
                                    retailPrice {
                                        value
                                        currencyCode
                                    }
                                    price {
                                        value
                                        currencyCode
                                    }
                                }
                                defaultImage {
                                    url(width:1280)
                                }
                            }
                        }
                    }
                }
            }
        `,
    })
        .then(data => console.log(data))
        .catch(error => console.error(error));
}

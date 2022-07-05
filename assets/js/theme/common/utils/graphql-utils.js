export class GraphqlUtils {
    constructor(context) {
        this.context = context;
    }

    getProductBySKU(sku) {
        return $.ajax({
            type: 'POST',
            url: '/graphql',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${this.context.storefrontToken}`
            },
            data: JSON.stringify({
                query: `
                    query ProductsQuery {
                        site {
                            product(sku: "${sku}") {
                                sku
                                path
                                prices {
                                    price {
                                        value
                                    }
                                }
                                defaultImage {
                                    url(width: 100)
                                    altText
                                }
                                customFields {
                                    edges {
                                        node {
                                            name
                                            value
                                        }
                                    }
                                }
                            }
                        }
                    }
                `
            })
        });
    }
}

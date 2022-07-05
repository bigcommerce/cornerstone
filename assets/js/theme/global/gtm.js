export function mutationReady() {
    (function(win) {
        'use strict';
        
        var listeners = [], 
        doc = win.document, 
        MutationObserver = win.MutationObserver || win.WebKitMutationObserver,
        observer;
        
        function available(selector, fn) {
            // Store the selector and callback to be monitored
            listeners.push({
                selector: selector,
                fn: fn
            });
            if (!observer) {
                // Watch for changes in the document
                observer = new MutationObserver(check);
                observer.observe(doc.documentElement, {
                    childList: true,
                    subtree: true
                });
            }
            // Check if the element is currently in the DOM
            check();
        }
            
        function check() {
            // Check the DOM for elements matching a stored selector
            for (var i = 0, len = listeners.length, listener, elements; i < len; i++) {
                listener = listeners[i];
                // Query for elements matching the specified selector
                elements = doc.querySelectorAll(listener.selector);
                for (var j = 0, jLen = elements.length, element; j < jLen; j++) {
                    element = elements[j];
                    // Make sure the callback isn't invoked with the 
                    // same element more than once
                    if (!element.ready) {
                        element.ready = true;
                        // Invoke the callback with the element
                        listener.fn.call(element, element);
                    }
                }
            }
        }

        // Expose `ready`
        win.available = available;
                
    })(window);
}

function listDetails(context, lastImpression = undefined) {
    
    // list name & location
    let listName = undefined;
    let listLocation = undefined;
    
    if (context.categoryName) {
        listName = context.categoryName;
        listLocation = 'category page';
    } else if (location.hash.includes('#/filter:')) {
        listName = 'search results filtered';
        listLocation = 'search page';
    } else if (location.href.includes('?search_query=')) {
        listName = 'search results';
        listLocation = 'search page';
    } else if (context.productObj) {
        listName = lastImpression.parentElement.parentElement
        .querySelector('.productTabs-sectionHeading').innerText.trim();
        listLocation = 'product detail page';
    } else if (lastImpression) {
        let list = lastImpression.parentElement;
        listName = list.dataset.listName;
        listLocation = list.dataset.listLocation;
    } else {
        listName = document.title;
        listLocation = document.title;
    }
    
    if (lastImpression) {
        if ($(lastImpression).siblings('.page-heading').length) {
            listName = $(lastImpression).siblings('.page-heading').text().trim();
        }
    }
    
    return [listName, listLocation];
}

// product impression
export function productImpression(context) {
    window.listImpressionCount = 0;
    window.locationState = location.href;
    window.available('.productGrid .product:last-child', function (lastImpression) {
        let list = lastImpression.parentElement;
        
        // retrieve list name & location
        let listInfo = listDetails(context, lastImpression);
        let listName = listInfo[0];
        let listLocation = listInfo[1];
        
        // impressions
        let impressions = [];
        let products = list.querySelectorAll('.product');
        if (window.locationState !== location.href) {
            window.listImpressionCount = 0;
            window.locationState = location.href;
        }
        
        // collect the product impression
        for (let position = window.listImpressionCount; position < products.length; position++) {
            const currentImpression = products[position];
            let impression = {};
            const impressionCard = currentImpression.querySelector('.card');
            
            // set basic data
            impression.name = impressionCard.dataset.name.trim();
            impression.id = impressionCard.querySelector('.card-sku').innerText.trim();
            impression.price = undefined;
            impression.brand = impressionCard.dataset.productBrand.trim() !== 'false' ?
            impressionCard.dataset.productBrand.trim() : undefined;
            impression.category = impressionCard.dataset.productCategory.trim() ?
                impressionCard.dataset.productCategory.trim() : undefined;

            // set variant
            impression.variant = impressionCard.dataset.variant ?
                impressionCard.dataset.variant.trim() : undefined;
            
            // set list information
            impression.list = listName;
            impression.position = position + 1;
            
            // set dimensions
            impression.dimension70 = undefined;
            impression.dimension81 = listLocation;
            
            // push to impressions list
            impressions.push(impression);
            if (impressions.length === 10) {
                // emit event product impression event
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                    'event': 'product-impression',
                    'ecommerce': {
                        'currencyCode': 'USD',
                        'impressions': impressions
                    }
                });
                impressions = [];
                window.listImpressionCount += 10;
            }
        }
        
        if (!impressions.length) {
            return;
        }
        
        // emit event product impression event
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            'event': 'product-impression',
            'ecommerce': {
                'currencyCode': 'USD',
                'impressions': impressions
            }
        });
        window.listImpressionCount += impressions.length;
    });
    
    window.available('.productCarousel', function (lastImpression) {
        let list = lastImpression;
        let impressionCount = 0;
        
        // retrieve list name & location
        let listInfo = listDetails(context, lastImpression);
        let listName = lastImpression.previousElementSibling.innerText.trim();
        let listLocation = listInfo[1];
        
        // impressions
        let impressions = [];
        let products = list.querySelectorAll('.card');
        if (window.locationState !== location.href) {
            impressionCount = 0;
            window.locationState = location.href;
        }
        for (let position = impressionCount; position < products.length; position++) {
            const impressionCard = products[position];
            let impression = {};
            
            // basic data
            impression.name = impressionCard.dataset.name.trim();
            impression.id = impressionCard.dataset.entityId.trim() ?
                impressionCard.dataset.entityId.trim() : undefined;
            impression.price = undefined;
            impression.brand = impressionCard.dataset.productBrand.trim() !== 'false' ?
                impressionCard.dataset.productBrand.trim() : undefined;
            impression.category = impressionCard.dataset.productCategory ?
                impressionCard.dataset.productCategory : undefined;

            // variant
            impression.variant = impressionCard.dataset.variant ?
                impressionCard.dataset.variant.trim() : undefined;
            
            // list information
            impression.list = listName;
            impression.position = position + 1;
            
            // dimensions
            impression.dimension70 = undefined;
            impression.dimension81 = listLocation;
            
            // push to impressions list
            impressions.push(impression);
            if (impressions.length === 10) {
                // emit event product impression event
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                    'event': 'product-impression',
                    'ecommerce': {
                        'currencyCode': 'USD',
                        'impressions': impressions
                    }
                });
                impressions = [];
                impressionCount += 10;
            }
        }
        
        // don't emit event if impressions are empty
        if (!impressions.length) {
            return;
        }
        
        // emit event product impression event
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            'event': 'product-impression',
            'ecommerce': {
                'currencyCode': 'USD',
                'impressions': impressions
            }
        });
        impressionCount += impressions.length;
    });
}

// product clicks
export function productClick(context) {
    window.available('[data-event-type="product-click"]', function (productLink) {
        let impressionCard = $(this).parents('.card')[0];

        // set variant
        let variant = impressionCard.dataset.variant ?
            impressionCard.dataset.variant.trim() : undefined;
        
        // product title click
        productLink.addEventListener('click', function(e) {
            let listInfo = listDetails(context, $(this).parents('.productCarousel')[0]);
            let listName = listInfo[0];
            let listLocation = listInfo[1];
            
            let sku = impressionCard.querySelector('.card-sku').innerText.replace('Model Number: ', '');
            
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'product-click',
                'ecommerce': {
                    'currencyCode': 'USD',
                    'click': {
                        'actionField': {
                            'list': listName
                        },
                        'products':  [{
                            'name': impressionCard.dataset.name,
                            'id': sku, 
                            'price': undefined,
                            'brand': impressionCard.dataset.productBrand.trim() !== 'false' ?
                                impressionCard.dataset.productBrand.trim() : undefined,
                            'category': impressionCard.dataset.productCategory.trim() ?
                                impressionCard.dataset.productCategory : undefined,
                            'variant': variant,
                            'position': $(impressionCard).parent().index() + 1,
                            'dimension70': undefined,
                            'dimension81': listLocation // recommended products, category page, etc
                        }]
                    }
                }
            });
        });
    });
}

// download click
export function downloadClick(e) {
    let pdfName = e.target.innerText.trim();
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        'event': 'download-click',
        'pdfFriendlyName': pdfName //use and care manual, etc.
    });
}

// PDP spec tab click
export function specTabClick(tabName, productName, productSKU) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        'event': 'spec-tab',
        'prodName': productName, //monogram 48” built-in side-by-side refrigerator, etc.
        'prodSku': productSKU, //ZISS480DKSS, etc.
        'specTab': tabName //about this product, reviews, etc.
    });
}

// navigation link click
export function navigationClick(e) {
    let navURL = e.target.closest('a').href;
    let navText = e.target.innerText.trim();
    let navLocation = $(e.target).parents('header').length ? 'header' : 'footer';
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        'event': 'navigation',
        'navLocation': navLocation, //footer, header
        'navElementText': navText, //products, special offers, contact us, etc. 
        'navURL': navURL
    });
}

/*
 Import all product specific js
 */
import PageManager from './page-manager';
import collapsibleFactory from './common/collapsible';
import ProductDetails from './common/product-details';
import videoGallery from './product/video-gallery';
import { specTabClick } from "./global/gtm";

export default class Product extends PageManager {
    constructor(context) {
        super(context);
        this.url = window.location.href;
    }

    onReady() {
        // Init collapsible
        collapsibleFactory('[data-collapsible]', { disabledBreakpoint:  'small'});

        this.productDetails = new ProductDetails($('.productView'), this.context);

        videoGallery();
        
        document.querySelector('#about-product').addEventListener('click', () => {
            document.querySelector('[href="#about"]').click();
        });
        
        this.sendGTMEvents(this.context.productObj);
    }
    
    // GTM events
    sendGTMEvents(product) {
        // PDP View
        let name = product.title;
        let sku = product.sku;
        let brand = product.brand ? product.brand : undefined;
        let category = product.category.length ? product.category.toString() : undefined;
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            'event': 'product-detail-view',
            'ecommerce': {
                'currencyCode': 'USD',
                'detail': {
                    'actionField': {},
                    'products': [
                        {
                            'name': name,
                            'id': sku, 
                            'price': undefined,
                            'brand': brand,
                            'category': category,
                            'variant': undefined,
                            'dimension70': undefined
                        }
                    ]
                }
            }
        });
        
        // spec ownership click
        document.querySelectorAll('.support-box')
        .forEach(specOwnerbox => {
            specOwnerbox.addEventListener('click', e => {
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                    'event': 'spec-ownership-click',
                    'supportSection': e.target.closest('.support-box')
                    .querySelector('h3').innerText.trim()
                });
            });
        });
        
        // spectab click event
        document.querySelectorAll('.productTabs-heading a, .productTabs-sticky-header-links a')
            .forEach(specTab => {
            specTab.addEventListener('click', e => {
                let productObj = this.context.productObj
                specTabClick(e.target.innerText.trim(), productObj.title, productObj.sku);
            });
        });
    }
}

import utils from '@bigcommerce/stencil-utils';
import ProductDetailsBase from './product-details-base';
import 'foundation-sites/js/foundation/foundation';
import 'foundation-sites/js/foundation/foundation.reveal';
import ImageGallery from '../product/image-gallery';
import { isPlainObject } from 'lodash';
import { downloadClick } from "../global/gtm";

export default class ProductDetails extends ProductDetailsBase {
    constructor($scope, context) {
        super($scope, context);
        this.context = context;
        this.imageGallery = new ImageGallery($('[data-image-gallery]', this.$scope));
        this.imageGallery.init();

        this.initStickyHeader();
        this.buildHighlightsHtml();
        this.buildSpecTable();
        this.buildWarrantyHtml();
        this.buildDocHtml();
    }

    /**
     * Checks if the current window is being run inside an iframe
     * @returns {boolean}
     */
    isRunningInIframe() {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }

    setLiveRegionAttributes($element, roleType, ariaLiveStatus) {
        $element.attr({
            role: roleType,
            'aria-live': ariaLiveStatus,
        });
    }

    checkIsQuickViewChild($element) {
        return !!$element.parents('.quickView').length;
    }

    showProductImage(image) {
        if (isPlainObject(image)) {
            const zoomImageUrl = utils.tools.imageSrcset.getSrcset(
                image.data,
                { '1x': this.context.zoomSize },
                /*
                    Should match zoom size used for data-zoom-image in
                    components/products/product-view.html

                    Note that this will only be used as a fallback image for browsers that do not support srcset

                    Also note that getSrcset returns a simple src string when exactly one size is provided
                */
            );

            const mainImageUrl = utils.tools.imageSrcset.getSrcset(
                image.data,
                { '1x': this.context.productSize },
                /*
                    Should match fallback image size used for the main product image in
                    components/products/product-view.html

                    Note that this will only be used as a fallback image for browsers that do not support srcset

                    Also note that getSrcset returns a simple src string when exactly one size is provided
                */
            );

            const mainImageSrcset = utils.tools.imageSrcset.getSrcset(image.data);

            this.imageGallery.setAlternateImage({
                mainImageUrl,
                zoomImageUrl,
                mainImageSrcset,
            });
        } else {
            this.imageGallery.restoreImage();
        }
    }

    /**
     * Redirect to url
     *
     * @param {String} url
     */
    redirectTo(url) {
        if (this.isRunningInIframe() && !window.iframeSdk) {
            window.top.location = url;
        } else {
            window.location = url;
        }
    }

    /*
     * Sticky header shows on scroll
     */
    initStickyHeader() {
        // show sticky header if scrolled past tabs
        $(window).on('scroll', () => {
            if ($(window).scrollTop() > $('#productStickyHeaderAnchor').offset().top) {
                $('#productStickyHeader').show();
            } else {
                $('#productStickyHeader').hide();
            }
        });
    }

    sortList(prefix, orderIndex) {
        if (this.context.productObj.custom_fields) {
            const customFields = this.context.productObj.custom_fields;
            // add all custom fields starting with prefix to an array
            const listArr = [];
            for (let i = 0; i < customFields.length; i++) {
                if (customFields[i].name.indexOf(prefix) == 0) {
                    listArr.push(customFields[i]);
                }
            }

            // sort by name and index
            listArr.sort((a, b) => {
                let aIndex = 0;
                let aName = '';
                const aSplit = a.name.split('_');
                if (aSplit.length > orderIndex) {
                    //aIndex = parseInt(aSplit[orderIndex], 10);
                    aIndex = parseInt(aSplit[aSplit.length - 1]);
                    aName = aSplit[orderIndex - 1];
                }

                let bIndex = 0;
                let bName = '';
                const bSplit = b.name.split('_');
                if (bSplit.length > orderIndex) {
                    //bIndex = parseInt(bSplit[orderIndex], 10);
                    bIndex = parseInt(bSplit[bSplit.length - 1]);
                    bName = bSplit[orderIndex - 1];
                }

                if (aName == bName) {
                    return (aIndex > bIndex) ? 1 : -1;
                }

                return (a.name > b.name) ? 1 : -1;
            });

            return listArr;
        }

        return null;
    }

    /*
     * Build highlights list
     */
    buildHighlightsHtml() {
        try {
            const warranty = JSON.parse(this.context.productObj.warranty);
            if (warranty && warranty.BenefitCopy && warranty.BenefitCopy.length) {
                
                // top 4 features
                let benefitCopy = warranty.BenefitCopy.filter(benefit => {
                    let flag = false;
                    for (const key in benefit) {
                        if (
                            !key.includes('Image') &&
                            !key.includes('Video') &&
                            !key.includes('Copy')
                        ) {
                            flag = true;
                        }
                    }
                    return flag;
                });
                const features = benefitCopy.slice(0, 4).map((item, index) => {
                    // return item[`Feature-${index + 1}`];
                    let element;
                    for (const key in item) {
                        if (Object.hasOwnProperty.call(item, key)) {
                            element = item[key];
                        }
                    }
                    return element;
                });

                if (features && features.length) {
                    features.forEach(feature => {
                        $('#productHighlights').append(`<li class="feature">${feature}</li>`);
                    });
                    $(".productView-highlights").removeClass('u-hidden');
                }
                $('.productView-highlights').siblings('.loadingOverlay').css('display', 'none');
            }
        } catch (err) {
            console.error(err)
            $('.productView-highlights').siblings('.loadingOverlay').css('display', 'none');
        }
    }

    buildSpecTable() {
        // sort custom fields starting with Attributes_
        const listArr = this.sortList('Attributes_', 3);

        if (listArr && listArr.length) {
            for (let i = 0; i < listArr.length; i++) {
                // ignore app filter
                if (listArr[i].name.indexOf('GEAParts.com filter') < 0) {
                    const nameSplit = listArr[i].name.split('_');
                    if (nameSplit.length > 2) {
                        // remove \
                        const customFieldTitle = nameSplit[1].replace(/\\/g, '');
                        const customFieldName = nameSplit[2].replace(/\\/g, '');
                        const customFieldValue = listArr[i].value.replace(/\\/g, '');

                        // if table for this attribute already exists, add row
                        // else add new table
                        let tableExists = false;
                        $('.productTabs-specs-table').each((index, elem) => {
                            if ($('.productTabs-specsTable--heading', elem).text() == customFieldTitle) {
                                tableExists = true;

                                // if row for this name already exists, add to column
                                // else add new row
                                let rowExists = false;
                                $('tr', elem).each((indexRow, elemRow) => {
                                    if ($('.specName', elemRow).text() == customFieldName) {
                                        rowExists = true;

                                        $('.specValues', elemRow).append(`<br>${customFieldValue}`);
                                    }
                                });
                                if (!rowExists) {
                                    $('table', elem).append(`<tr><td class="specName">${customFieldName}</td><td class="specValues">${customFieldValue}</td></tr>`);
                                }
                            }
                        });
                        if (!tableExists) {
                            $('#productTabsSpecs').append(`
                                <div class="productTabs-specs-table">
                                    <table class="table">
                                        <tr class="productTabs-specsTable--heading"><td class="specName" colspan="2"><strong>${customFieldTitle}</strong></td></tr>
                                        <tr><td class="specName">${customFieldName}</td><td class="specValues">${customFieldValue}</td></tr>
                                    </table>
                                </div>
                            `);
                        }
                    }
                }
            }
        } else {
            $('#productTabsSpecs').append(`<p>${this.context.productNoSpecs}</p>`)
        }
    }

    buildWarrantyHtml() {
        try {
            if (this.context.productObj.warranty) {
                const warranty = JSON.parse(this.context.productObj.warranty);

                if (warranty && warranty.BenefitCopy && warranty.BenefitCopy.length) {

                    let warrantyHtml = '';
                    let features4HTML = '';
                    let features3HTML = '';
                    let features2HTML = '';
                    let features1HTML = '';
                    let features = {};
                    
                    warranty.BenefitCopy.forEach((item) => {
                        let keys = Object.keys(item)[0].split(' ');
                        features[keys[0]] = features[keys[0]] || {};
                        features[keys[0]][keys[1] ? keys[1].toLowerCase() :
                         'label'] = item[Object.keys(item)[0]];
                    });
                    
                    for (const key in features) {
                        if (Object.hasOwnProperty.call(features, key)) {
                            const feature = features[key];
                            
                            if (Object.keys(feature).length === 4) {
                                features4HTML += `<article class="product-feature d-flex align-items-top">
                                    <div class="product-feature-content">
                                        <figure class="product-feature-figure">
                                            <img src="${feature.image}" alt=${feature.label}/>
                                        </figure>
                                        <div class="product-feature-body">
                                            <h4>${feature.label}</h4>
                                            <p>${feature.copy}</p>
                                            <a href="${feature.video}" target="_blank">
                                            <span class="icon icon--play">
                                                <svg><use xlink:href="#icon-play-circle-regular" /></svg>
                                            </span>Play Video</a>
                                        </div>
                                    </div>
                                </article>`;
                            }
                            
                            if (Object.keys(feature).length === 3) {
                                features3HTML += `<article class="product-feature d-flex align-items-top">
                                    <div class="product-feature-content">
                                        ${feature.image ? `<figure class="product-feature-figure">
                                            <img src="${feature.image}" alt=${feature.label}/>
                                        </figure>`: ''}
                                        <div class="product-feature-body">
                                            <h4>${feature.label}</h4>
                                            ${feature.copy ? `<p>${feature.copy}</p>` : ''}
                                            ${feature.video ? `<a href="${feature.video}" target="_blank">
                                            <span class="icon icon--play">
                                                <svg><use xlink:href="#icon-play-circle-regular" /></svg>
                                            </span>Play Video</a>` : ''}
                                        </div>
                                    </div>
                                </article>`;
                            }
                            
                            if (Object.keys(feature).length === 2) {
                                features2HTML += `<article class="product-feature d-flex align-items-top">
                                    <div class="product-feature-content">
                                        ${feature.image ? `<figure class="product-feature-figure">
                                            <img src="${feature.image}" alt=${feature.label}/>
                                        </figure>`: ''}
                                        <div class="product-feature-body">
                                            <h4>${feature.label}</h4>
                                            ${feature.copy ? `<p>${feature.copy}</p>` : ''}
                                            ${feature.video ? `<a href="${feature.video}" target="_blank">
                                            <span class="icon icon--play">
                                                <svg><use xlink:href="#icon-play-circle-regular" /></svg>
                                            </span>Play Video</a>` : ''}
                                        </div>
                                    </div>
                                </article>`;
                            }
                            
                            if (Object.keys(feature).length === 1) {
                                features1HTML += `<article class="product-feature">
                                    <div class="product-feature-content">
                                        <div class="product-feature-body">
                                            <h4>${feature.label}</h4>
                                        </div>
                                    </div>
                                </article>`;
                            }
                        }
                    }

                    warrantyHtml = `${features4HTML}
                    ${features3HTML}
                    ${features2HTML}
                    ${features1HTML}`;
                    if (warrantyHtml && warrantyHtml !== '') {
                        $('#productTabsFeatures').append(warrantyHtml);
                    } else {
                        $('#about').hide();
                    }
                }
            }
        } catch (err) {
            console.error(err);
            $('#about').hide();
        }
    }

    /*
     * Build documents list
     */
    buildDocHtml() {
        // sort custom fields starting with Documents_ and CAD_
        let listHtml = '';
        const listArr = this.sortList('Document_', 1);
        if (listArr) {
            for (let i = 0; i < listArr.length; i++) {
                // name for documents link is everything after 'documents_x_'
                // href is custom field value
                const nameArr = listArr[i].name.split('_');
                nameArr.splice(0, 2);
                const docName = nameArr.join(' ').replace(/\\/g, '');
                if (docName && docName !== '') {
                    listHtml += `
                        <li>
                            <a class="d-flex align-items-top productTabs-ownerSupport--docLink" href="${listArr[i].value}" target="_blank">
                                ${docName}
                            </a>
                        </li>
                    `;
                }
            }
        }

        if (listHtml && listHtml != '') {
            $('#productTabsManuals').html(listHtml);
            document.querySelectorAll('.productTabs-ownerSupport--docLink')
            .forEach(docLink => {
                docLink.addEventListener('click', downloadClick);
            });
        } else {
            $('#productTabsManuals').html(`<li>${this.context.productNoManuals}</li>`)
        }
    }
}

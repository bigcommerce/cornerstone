/**
 * Persistent admin bar for store administrators viewing the storefront
 * @param maintenanceMode
 * @param secureBaseUrl
 * @param channelId
 * @param adminBarLanguage
 * @param productId
 * @param categoryId
 */
export default function (secureBaseUrl, channelId = 1, maintenanceMode = {}, adminBarLanguage, productId, categoryId) {
    const lang = adminBarLanguage.translations;
    const password = maintenanceMode.password || false;
    const isMaintenanceMode = (maintenanceMode.header && !password) || false;

    function isInIframe() {
        try {
            return window.location !== window.parent.location;
        } catch (e) {
            return true;
        }
    }

    // eslint-disable-next-line no-shadow
    function getContextualMatch(productId, categoryId) {
        if (productId && parseInt(productId, 10)) {
            return {
                type: 'product',
                url: `/manage/products/${productId}/edit`,
            };
        } else if (categoryId && parseInt(categoryId, 10)) {
            return {
                type: 'category',
                url: `/manage/products/categories/${categoryId}/edit`,
            };
        }
    }

    function doesNotHaveAdminCookie() {
        return document.cookie.indexOf('ADMIN_BAR=1') === -1;
    }

    // Set admin cookie if appropriate
    if (window.URLSearchParams && window.URL && (new URL(document.location)).searchParams.get('ctk')) {
        document.cookie = 'ADMIN_BAR=1; path=/';
    }


    // Return if isInIframe is true (inside page builder) or if there is no admin cookie
    if (doesNotHaveAdminCookie() || isInIframe()) {
        return;
    }

    const url = encodeURIComponent((new URL(window.location.href).pathname + window.location.search).replace(/^\/|\/$/g, ''));
    const contextualMatch = getContextualMatch(productId, categoryId);

    const $element = $('<div>', {
        class: 'adminBar',
    });

    $element.html(`<div class="adminBar-logo">
        <a href="${secureBaseUrl}/manage/dashboard"><svg><use xlink:href="#icon-logo-small"></use></svg></a></div>
        <div class="adminBar-content">
        ${password ?
        `<div class="adminBar-private">
                    <span class="preview">${lang['admin.prelaunch_header']} <strong>${password}</strong></span>
                </div>` : ''}
        ${isMaintenanceMode ?
        `<div class="adminBar-private">
                <span>${lang['admin.maintenance_header']}</span>
                <span class="svg-icon svg-baseline adminBar-large tooltip">
                    <svg><use xlink:href="#icon-admin-tooltip"></use></svg>
                    <span class="tooltiptext tooltip-bottom">${lang['admin.maintenance_tooltip']}</span>
                </span>
                <a href="?showStore=no" class="adminBar-large">${lang['admin.maintenance_showstore_link']} <span class="svg-icon svg-baseline">
                    <svg style="height: 0.8em;"><use xlink:href="#icon-admin-link"></use></svg>
                </span></a>
         </div>` : ''}
         <div class="adminBar-links">
            ${contextualMatch ? `<a href='${secureBaseUrl}${contextualMatch.url}' target="_blank">
                <span class="svg-icon svg-baseline">
                    <svg><use xlink:href="#icon-admin-edit"></use></svg>
                </span><span class="adminBar-large"> Edit ${contextualMatch.type} information</span></a>` : ''}
            <a href="${secureBaseUrl}/manage/page-builder?channelId=${channelId}&redirectIframeUrl=${url}" target="_blank">
                <span class="svg-icon svg-baseline">
                    <svg><use xlink:href="#icon-admin-brush"></use></svg>
                </span><span class="adminBar-large"> ${lang['admin.page_builder_link']}</span>
            </a>
         </div>
         <div class="adminBar-close" id="close-admin-bar">
            <span class="svg-icon svg-baseline">
                <svg><use xlink:href="#icon-admin-close"></use></svg>
            </span>
         </div>
        </div>`);

    $('body').addClass('hasAdminBar');
    $('body').append($element);

    $('#close-admin-bar').click(() => {
        $('body').removeClass('hasAdminBar');
        $('.adminBar').remove();
        document.cookie = 'ADMIN_BAR=0; path=/';
    });
}

import utils from '@bigcommerce/stencil-utils';

/**
 * European websites must notify users of cookies to comply with European Union law.
 * This will alert shoppers that this website uses cookies.
 */
export default function () {
    /*
    // Here you can override the default browser alert box by hooking to the 'cookie-privacy-notification' hook.
    utils.hooks.on('cookie-privacy-notification', (event, privacyMessage) => {
        // You can make your own custom modal or alert box appear in your theme using the privacyMessage provided
        myCustomAlert(privacyMessage);

        // Call event.preventDefault() to prevent the default browser alert from occurring in stencil-utils
        event.preventDefault();
    });
    */

    const $privacyDialog = $('.cookieMessage');

    if (document.cookie.indexOf('ACCEPT_COOKIE_USAGE') === -1) {
        $privacyDialog.show();
    }

    $('body').on('click', '[data-privacy-accept]', () => {
        const date = new Date();
        date.setDate(date.getDate() + 365);
        document.cookie = `ACCEPT_COOKIE_USAGE=1;expires=${date.toGMTString()}; path=/`;

        utils.hooks.emit('cookie-privacy-accepted');
        $privacyDialog.hide();
    });
}

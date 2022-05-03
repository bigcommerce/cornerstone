import { showAlertModal } from './modal';
import utils from '@bigcommerce/stencil-utils';

let currencySelectorCalled = false;

export default function (cartId) {
    if (!cartId) return;

    if (!currencySelectorCalled) {
        currencySelectorCalled = true;
    } else {
        return;
    }

    function changeCurrency(url, currencyCode) {
        $.ajax({
            url,
            contentType: 'application/json',
            method: 'POST',
            data: JSON.stringify({ currencyCode }),
        }).done(() => {
            window.location.reload();
        }).fail((e) => {
            showAlertModal(JSON.parse(e.responseText).error);
        });
    }

    $('[data-cart-currency-switch-url]').on('click', event => {
        const currencySessionSwitcher = event.target.href;
        event.preventDefault();
        utils.api.cart.getCart({ cartId }, (err, response) => {
            if (err || response === undefined) {
                window.location.href = currencySessionSwitcher;
                return;
            }

            const showWarning = response.discounts.some(discount => discount.discountedAmount > 0) ||
                response.coupons.length > 0 ||
                response.lineItems.giftCertificates.length > 0;

            if (showWarning) {
                const text = $(event.target).data('warning');
                const $preModalFocusedEl = $('.navUser-action--currencySelector');

                showAlertModal(text, {
                    icon: 'warning',
                    showCancelButton: true,
                    $preModalFocusedEl,
                    onConfirm: () => {
                        changeCurrency($(event.target).data('cart-currency-switch-url'), $(event.target).data('currency-code'));
                    },
                });
            } else {
                changeCurrency($(event.target).data('cart-currency-switch-url'), $(event.target).data('currency-code'));
            }
        });
    });
}

import swal from './sweet-alert';
import utils from '@bigcommerce/stencil-utils';

export default function (cartId) {
    function changeCurrency(url, currencyCode) {
        $.ajax({
            url,
            contentType: 'application/json',
            method: 'POST',
            data: JSON.stringify({ currencyCode }),
        }).done(() => {
            window.location.reload();
        }).fail((e) => {
            swal.fire({
                text: JSON.parse(e.responseText).error,
                icon: 'warning',
                showCancelButton: true,
            });
        });
    }

    $('[data-cart-currency-switch-url]').on('click', event => {
        const currencySessionSwitcher = event.target.href;
        if (!cartId) {
            return;
        }
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
                swal.fire({
                    text: $(event.target).data('warning'),
                    icon: 'warning',
                    showCancelButton: true,
                }).then(result => {
                    if (result.value && result.value === true) {
                        changeCurrency($(event.target).data('cart-currency-switch-url'), $(event.target).data('currency-code'));
                    }
                });
            } else {
                changeCurrency($(event.target).data('cart-currency-switch-url'), $(event.target).data('currency-code'));
            }
        });
    });
}

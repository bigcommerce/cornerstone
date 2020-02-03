import sweetAlert from '../global/sweet-alert';

/**
 * https://stackoverflow.com/a/37949642
 */
function replaceBulk(str, findArray, replaceArray) {
    let stringy = str;
    let regex = [];
    const map = {};
    for (let i = 0; i < findArray.length; i++) {
        regex.push(findArray[i].replace('[-[\]{}()*+?.\\^$|#,]', '\\$0'));
        map[findArray[i]] = replaceArray[i];
    }
    regex = regex.join('|');
    stringy = stringy.replace(new RegExp(regex, 'g'), (matched) => map[matched]);
    return stringy;
}

export default function (context) {
    $('body').on('click', '#form-action-validateForm', event => {
        const $form = $(event.currentTarget).closest('[data-cart-item-add]');
        const attr = $form.find('#form-action-addToCart').attr('disabled');
        // For some browsers, `attr` is undefined; for others,
        // `attr` is false.  Check for both.
        if (typeof attr !== typeof undefined && attr !== false) {
            const message = $form.find('.alertBox-column.alertBox-message').text();
            sweetAlert.fire(message);
            return false;
        }
        if ($form[0].checkValidity()) {
            const formStr = $form.serialize();
            const replacedString = replaceBulk(formStr, ['%5B', '%5D', 'add', 'qty%5B%5D'], ['[', ']', 'buy', 'qty']);
            sweetAlert.fire({
                cancelButtonText: context.buyNowModalCancelText,
                confirmButtonText: context.buyNowModalConfirmText,
                customClass: {
                    cancelButton: 'button',
                    confirmButton: 'button',
                },
                icon: 'question',
                reverseButtons: true,
                showCancelButton: true,
                title: context.buyNowModalTitle,
                text: context.buyNowModalText,
            }).then((result) => {
                if (result.value) {
                    window.location = `/cart.php?${replacedString}&source=buy-now-button`;
                }
            });
        } else {
            // trigger html5 validation for required fields.
            $form.find('#form-action-addToCart').trigger('click');
        }
        event.preventDefault();
    });

    $('body').on('click', '#form-action-buyNowButton', event => {
        $(event.currentTarget).next().trigger('click');
        event.preventDefault();
    });
}

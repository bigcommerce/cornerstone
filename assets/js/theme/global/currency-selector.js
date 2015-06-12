export default function () {
    $(document.body).on('click', '.currencySelector', function() {
        $('.currency-selection-list').toggleClass('active')
    });
};

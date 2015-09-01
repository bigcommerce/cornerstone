export default function() {
    $(document.body).on('click', '.currencySelector', function onClick() {
        $('.currency-selection-list').toggleClass('active');
    });
}

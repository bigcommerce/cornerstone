export default function () {
    $(document.body).on('click', '.currencySelector', () => {
        $('.currency-selection-list').toggleClass('active');
    });
}

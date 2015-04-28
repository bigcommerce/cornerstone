import ko from 'knockout';

let productOptionsViewModel = {
    sku: '',
    canAddToCart: true
}

ko.applyBindings(productOptionsViewModel);

export default productOptionsViewModel;

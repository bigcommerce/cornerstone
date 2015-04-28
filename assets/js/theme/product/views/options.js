import ko from 'knockout';

let productOptionsViewModel = {
    sku: ko.observable(),
    canAddToCart: ko.observable(true)
}

ko.applyBindings(productOptionsViewModel);

export default productOptionsViewModel;

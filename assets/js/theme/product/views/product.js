import $ from 'jquery';
import ko from 'knockout';

let productViewModel = {
    price: ko.observable(),
    sku: ko.observable(),
    canAddToCart: ko.pureComputed({
        write: function (instock, purchasable) {
            return instock && purchasable;
        },
        read: function() {

        },
        owner: this
    })
};

ko.applyBindings(productViewModel, $('.productView').get(0));

export default productViewModel;

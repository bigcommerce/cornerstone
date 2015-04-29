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

export default productViewModel;

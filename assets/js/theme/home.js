import PageManager from './page-manager';
import haloAddOptionForProduct from './themevale/themevale_AddOptionForProduct';

export default class Home extends PageManager {
    constructor(context) {
        super(context);
    }

    onReady() {
    	this.loadOptionForProductCard();
    }

    loadOptionForProductCard() {
    	const context = this.context;

        if($('.tab-content').length > 0){
            $('.tab-content').each((index, element) => {
                var $prodWrapId = $(element).attr('id');
                haloAddOptionForProduct(context, $prodWrapId);
            });
        }
        if($('.productCarousel').length > 0 && $('.homepage-layout-2').length > 0){
            $('.productCarousel').each((index, element) => {
                var $prodWrapId = $(element).attr('id');
                haloAddOptionForProduct(context, $prodWrapId);
            });
        }
    }
}

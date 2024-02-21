import PageManager from './page-manager';
import loadProductByCategory from './common/product-by-category';
import loadProductById from './common/featured-product';

export default class Home extends PageManager {
    onReady() {
        const {
            categoryBlockCarouselLimit,
            categoryBlockCarouselCol,
        } = this.context;

        loadProductByCategory(categoryBlockCarouselCol, categoryBlockCarouselLimit);
        loadProductById(this.context);
    }
}

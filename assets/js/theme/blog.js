import PageManager from './page-manager';

export default class Blog extends PageManager {
    constructor(context) {
        super(context);
    }
    
    onReady() {
        console.log('hi sam this is a BLOG page', this.context);
    }
}
import PageManager from './page-manager';

export default class Page extends PageManager {
    constructor(context) {
        super(context);
        this.url = window.location.pathname;
    }

    onReady() {
        if (this.url === '/') {
            console.log('homepage!');
        } else {
            console.log('NOT homepage!');
        }
    }
}
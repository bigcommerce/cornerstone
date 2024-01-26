import PageManager from "../page-manager";

export default class Page extends PageManager {
    constructor(context) {
        super(context);
        this.header = document.querySelector('header');
        this.footer = document.querySelector('footer');
        this.banner = document.querySelector('#consent-manager-update-banner');
    }

    onReady() {
        console.log('custom page code');
        const queryString = window.location.search;
        const params = new URLSearchParams(queryString);
        console.log('params: ', params);
        if (params.get('asDoc')) {
            this.header.style.display = 'none';
            this.footer.style.display = 'none';
            this.banner.style.display = 'none';
        }
    }
}
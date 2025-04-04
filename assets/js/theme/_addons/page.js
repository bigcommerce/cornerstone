import PageManager from "../page-manager";

export default class Page extends PageManager {
    constructor(context) {
        super(context);
        this.header = document.querySelector('header');
        this.footer = document.querySelector('footer');
        this.banner = document.querySelector('#consent-manager-update-banner');
        this.contents = document.querySelector('.contents');
        this.contentsHeading = this.contents.querySelector('h3');
        this.contentsList = this.contents.querySelector('ul');
        this.contentsArrow = this.contents.querySelector('h3 svg');
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

        const contents = document.querySelector('.contents');
        const contentsList = contents.querySelector('ul');
        contentsList.style.position = 'relative';

        if(this.contentsHeading) {
            this.contentsHeading.addEventListener('click', (e) => {
                this.contentsList.classList.toggle('open');
                this.contentsArrow.classList.toggle('open');
                console.log('list clicked');
            })
        }
    }
}
const path = require('path');

import ThemeRenderer from '../../helpers/stencil-paper-helper';
import themeContext from '../../mock/home-context.json';

/**
 * We will definitely be waiting for a lot of resources to load up
 * so timeout for this test needs to increase
 */
// eslint-disable-next-line no-undef
jest.setTimeout(10000);

describe('Verify the functionality of templates/pages/home.html', () => {
    let context;

    beforeAll(async () => {
        /**
         * Make a deep copy of the object
         * @type {any}
         */
        context = JSON.parse(JSON.stringify(themeContext));

        /**
         * Define the theme renderer
         * @type {StencilPaperHelper}
         * @param {string} page
         * @param {Object} context
         */
        const themeRenderer = new ThemeRenderer(path.join('pages', 'home'), context);

        /**
         * Attach the new page to the DOM
         */
        await themeRenderer.renderHTML();
    });

    it('should verify that the logo is loaded', () => {
        /**
         * This verifies the logo text is loaded
         * @type {Element}
         */
        const logo = document.querySelector('.header-logo-text');
        expect(logo.textContent).toEqual('example test environment');
    });

    it('should have the same number of carousel available within the theme rendered', () => {
        /**
         * This nodelist within the page should have the same number of carousel
         * within the context object supplied
         * @type {NodeListOf<Element>}
         */
        const carousels = document.querySelectorAll('.heroCarousel a');
        expect(carousels.length).toEqual(context.carousel.slides.length);
    });

    it('should expect navigation page to contain `Test Categories`', () => {
        const navigationItems = document.querySelectorAll('.navPages-item a');
        const navigationTextItems = [];
        const categoriesContainers = [];

        /**
         * Adds the categories from context object
         */
        context.categories.forEach((category) => {
            categoriesContainers.push(category.name);
        });

        /**
         * Add Categories from rendered page nodes
         */
        navigationItems.forEach((item) => {
            navigationTextItems.push(item.textContent
                .trim()
                .replace(/\r\n|\n|\r$/, ''));
        });
        expect(navigationTextItems).toEqual(expect.arrayContaining(categoriesContainers));
    });

    it('should have products', () => {
        /**
         * Verifies that Element Nodes of products exists within the rendered theme
         * @type {NodeListOf<Element>}
         */
        const productsEl = document.querySelectorAll('.main .product');
        expect(productsEl.length).toBeGreaterThan(0);
    });

    it('should verify that click within the login button works', () => {
        /**
         * Verifies that login links will be called and navigated once pressed
         * @type {Element}
         */
        const button = document.querySelector('[href="/login.php"]');
        const buttonClick = jest.fn();
        button.addEventListener('click', () => buttonClick(button.href));
        button.click();
        expect(buttonClick).toHaveBeenCalledWith(`${window.location.href}login.php`);
    });

    it('should verify that the newsletter is available within the page', () => {
        const newsletter = document.querySelector('[data-section-type="newsletterSubscription"] .form');
        expect(newsletter.getAttribute('action')).toBe('/subscribe.php');
        expect(newsletter.getAttribute('method')).toBe('post');
    });

    it('should have footer navigation and links', () => {
        const footerLinkListEl = document.querySelectorAll('.footer-info-list a');
        expect(footerLinkListEl.length).toBeGreaterThan(0);
    });
});

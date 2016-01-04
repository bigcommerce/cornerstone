import mobileMenuToggleFactory from '../../../theme/global/mobile-menu-toggle';
import { CartPreviewEvents } from '../../../theme/global/cart-preview';
import $ from 'jquery';


describe('MobileMenuToggle', () => {
    let mobileMenuToggle;
    let $body;

    beforeEach(() => {
        const html = `
            <div class="body">
                <header class="header">
                    <a data-mobile-menu-toggle="menu">Menu</a>
                    <nav id="menu"></nav>
                </header>
            </div>
        `;

        $body = $(html);
        $body.appendTo(document.body);

        mobileMenuToggle = mobileMenuToggleFactory();
    });

    afterEach(() => {
        $body.remove();
    });

    it('should toggle menu when trigger receives click event', () => {
        spyOn(mobileMenuToggle, 'toggle');
        mobileMenuToggle.$toggle.trigger('click');

        expect(mobileMenuToggle.toggle).toHaveBeenCalled();
    });

    it('should hide menu when preview cart is open', () => {
        spyOn(mobileMenuToggle, 'hide');
        mobileMenuToggle.$menu.addClass('is-open');
        mobileMenuToggle.$header.trigger(CartPreviewEvents.open);

        expect(mobileMenuToggle.hide).toHaveBeenCalled();
    });

    describe('show', () => {
        it('should add active class to body', () => {
            mobileMenuToggle.show();

            expect(mobileMenuToggle.$body.hasClass('has-activeNavPages')).toBeTruthy();
        });

        it('should add active class to header', () => {
            mobileMenuToggle.show();

            expect(mobileMenuToggle.$header.hasClass('is-open')).toBeTruthy();
        });

        it('should add active class to trigger', () => {
            mobileMenuToggle.show();

            expect(mobileMenuToggle.$toggle.hasClass('is-open')).toBeTruthy();
        });

        it('should add active class to component', () => {
            mobileMenuToggle.show();

            expect(mobileMenuToggle.$menu.hasClass('is-open')).toBeTruthy();
        });
    });

    describe('hide', () => {
        beforeEach(() => {
            mobileMenuToggle.$body.addClass('has-activeNavPages');
            mobileMenuToggle.$header.addClass('is-open');
            mobileMenuToggle.$toggle.addClass('is-open');
            mobileMenuToggle.$menu.addClass('is-open');
        });

        it('should remove active class from body', () => {
            mobileMenuToggle.hide();

            expect(mobileMenuToggle.$body.hasClass('has-activeNavPages')).toBeFalsy();
        });

        it('should remove active class from header', () => {
            mobileMenuToggle.hide();

            expect(mobileMenuToggle.$header.hasClass('is-open')).toBeFalsy();
        });

        it('should remove active class from trigger', () => {
            mobileMenuToggle.hide();

            expect(mobileMenuToggle.$toggle.hasClass('is-open')).toBeFalsy();
        });

        it('should remove active class from component', () => {
            mobileMenuToggle.hide();

            expect(mobileMenuToggle.$menu.hasClass('is-open')).toBeFalsy();
        });
    });
});

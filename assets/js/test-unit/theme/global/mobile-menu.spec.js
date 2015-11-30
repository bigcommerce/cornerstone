import mobileMenuFactory from '../../../theme/global/mobile-menu';
import { CartPreviewEvents } from '../../../theme/global/cart-preview';

describe('MobileMenu', () => {
    let mobileMenu;
    let $body;

    beforeEach(() => {
        const html = `
            <div class="body">
                <header class="header">
                    <a data-mobilemenu>Menu</a>
                    <nav id="mobile-menu"></nav>
                </header>
            </div>
        `;

        $body = $(html);
        $body.appendTo(document.body);

        mobileMenu = mobileMenuFactory();
    });

    afterEach(() => {
        $body.remove();
    });

    it('should toggle menu when trigger receives click event', () => {
        spyOn(mobileMenu, 'toggle');
        mobileMenu.$trigger.trigger('click');

        expect(mobileMenu.toggle).toHaveBeenCalled();
    });

    it('should hide menu when preview cart is open', () => {
        spyOn(mobileMenu, 'hide');
        mobileMenu.$menu.addClass('is-open');
        mobileMenu.$header.trigger(CartPreviewEvents.open);

        expect(mobileMenu.hide).toHaveBeenCalled();
    });

    describe('show', () => {
        it('should add active class to body', () => {
            mobileMenu.show();

            expect(mobileMenu.$body.hasClass('has-activeNavPages')).toBeTruthy();
        });

        it('should add active class to header', () => {
            mobileMenu.show();

            expect(mobileMenu.$header.hasClass('is-open')).toBeTruthy();
        });

        it('should add active class to trigger', () => {
            mobileMenu.show();

            expect(mobileMenu.$trigger.hasClass('is-open')).toBeTruthy();
        });

        it('should add active class to component', () => {
            mobileMenu.show();

            expect(mobileMenu.$menu.hasClass('is-open')).toBeTruthy();
        });
    });

    describe('hide', () => {
        beforeEach(() => {
            mobileMenu.$body.addClass('has-activeNavPages');
            mobileMenu.$header.addClass('is-open');
            mobileMenu.$trigger.addClass('is-open');
            mobileMenu.$menu.addClass('is-open');
        });

        it('should remove active class from body', () => {
            mobileMenu.hide();

            expect(mobileMenu.$body.hasClass('has-activeNavPages')).toBeFalsy();
        });

        it('should remove active class from header', () => {
            mobileMenu.hide();

            expect(mobileMenu.$header.hasClass('is-open')).toBeFalsy();
        });

        it('should remove active class from trigger', () => {
            mobileMenu.hide();

            expect(mobileMenu.$trigger.hasClass('is-open')).toBeFalsy();
        });

        it('should remove active class from component', () => {
            mobileMenu.hide();

            expect(mobileMenu.$menu.hasClass('is-open')).toBeFalsy();
        });
    });
});

import menuFactory from '../../../theme/global/menu';
import $ from 'jquery';

describe('Menu', () => {
    let menu;
    let $body;

    beforeEach(() => {
        const html = `
            <div class="body">
                <nav data-menu id="menu">
                    <ul>
                        <li data-collapsible></li>
                        <li data-collapsible></li>
                        <li data-collapsible></li>
                    </ul>
                </nav>
            </div>
        `;

        $body = $(html);
        $body.appendTo(document.body);

        menu = menuFactory();
    });

    afterEach(() => {
        $body.remove();
    });

    describe('when clicking on body', () => {
        beforeEach(() => {
            spyOn(menu, 'collapseAll');
        });

        it('should collapse all', () => {
            $body.trigger('click');

            expect(menu.collapseAll).toHaveBeenCalled();
        });
    });

    describe('when clicking on menu', () => {
        beforeEach(() => {
            spyOn(menu, 'collapseAll');
        });

        it('should not collapse all', () => {
            menu.$menu.trigger('click');

            expect(menu.collapseAll).not.toHaveBeenCalled();
        });
    });

    describe('collapseAll', () => {
        it('should ask all collapsibleGroups to hide', () => {
            spyOn(menu.collapsibleGroups[0], 'close');
            menu.collapseAll();

            expect(menu.collapsibleGroups[0].close).toHaveBeenCalled();
        });
    });
});

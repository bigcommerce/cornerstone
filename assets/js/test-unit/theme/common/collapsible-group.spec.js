import collapsibleGroupFactory from '../../../theme/common/collapsible-group';
import { CollapsibleEvents } from '../../../theme/common/collapsible';
import $ from 'jquery';


describe('CollapsibleGroup', () => {
    let collapsibleGroup;
    let $element;

    beforeEach(() => {
        const html = '<div data-collapsible-group></div>';

        $element = $(html);
        $element.appendTo(document.body);

        collapsibleGroup = collapsibleGroupFactory()[0];
    });

    afterEach(() => {
        $element.remove();
    });

    describe('when a collapsible is open', () => {
        let collapsible;
        let childCollapsible;

        beforeEach(() => {
            collapsible = jasmine.createSpyObj('collapsible', ['close', 'hasCollapsible']);
            childCollapsible = {};

            collapsibleGroup.openCollapsible = collapsible;
        });

        it('should close the currently open collapsible if it does not contain the newly open collapsible', () => {
            collapsible.hasCollapsible.and.returnValue(false);
            collapsibleGroup.$component.trigger(CollapsibleEvents.open, [childCollapsible]);

            expect(collapsible.close).toHaveBeenCalled();
            expect(collapsibleGroup.openCollapsible).toEqual(childCollapsible);
        });

        it('should not close the currently open collapsible if it contains the newly open collapsible', () => {
            collapsible.hasCollapsible.and.returnValue(true);
            collapsibleGroup.$component.trigger(CollapsibleEvents.open, [childCollapsible]);

            expect(collapsible.close).not.toHaveBeenCalled();
            expect(collapsibleGroup.openCollapsible).not.toEqual(childCollapsible);
        });
    });


    describe('when a collapsible is closed', () => {
        let collapsible;
        let childCollapsible;

        beforeEach(() => {
            collapsible = jasmine.createSpyObj('collapsible', ['hasCollapsible']);
            childCollapsible = {};

            collapsibleGroup.openCollapsible = collapsible;
        });

        it('should unset `openCollapsible` if it does not contain the newly open collapsible', () => {
            collapsible.hasCollapsible.and.returnValue(false);
            collapsibleGroup.$component.trigger(CollapsibleEvents.close, [childCollapsible]);

            expect(collapsibleGroup.openCollapsible).toEqual(null);
        });

        it('should not unset `openCollapsible` if it contains the newly open collapsible', () => {
            collapsible.hasCollapsible.and.returnValue(true);
            collapsibleGroup.$component.trigger(CollapsibleEvents.close, [childCollapsible]);

            expect(collapsibleGroup.openCollapsible).not.toEqual(null);
        });
    });
});

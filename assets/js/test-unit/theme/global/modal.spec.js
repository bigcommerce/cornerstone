import modalFactory, { ModalEvents } from '../../../theme/global/modal';
import $ from 'jquery';

function attachHtml(html) {
    const $element = $(html);
    $element.appendTo(document.body);

    return $element;
}

describe('Modal', () => {
    let $element;
    let modal;

    beforeEach(() => {
        $element = attachHtml(`
            <div id="modal" class="modal" data-reveal>
                <div class="modal-content"></div>
                <div class="loadingOverlay"></div>
            </div>
        `);

        modal = modalFactory()[0];
    });

    afterEach(() => {
        $element.remove();
        $('body').removeClass();
    });

    describe('when modal opens', () => {
        it('should add active class to body', () => {
            modal.$modal.trigger(ModalEvents.open);

            expect($('body').hasClass('has-activeModal')).toBeTruthy();
        });

        it('should have a max-height', () => {
            modal.$modal.trigger(ModalEvents.open);

            expect(modal.$content.css('max-height')).toBeDefined();
        });
    });

    describe('when modal finishes opening', () => {
        let $modalBody;

        beforeEach(() => {
            $('body').height(500);

            $modalBody = $(`
                <div class="modal-body">
                    <div style="height: 700px;"></div>
                </div>
            `);

            modal.$content.html($modalBody);
        });

        afterEach(() => {
            $('body').height(null);
        });

        it('should restrain content height', () => {
            modal.$modal.trigger(ModalEvents.opened);

            expect(parseInt($modalBody.css('max-height'), 10)).toEqual(637);
        });
    });

    describe('when modal closes', () => {
        it('should remove active class to body', () => {
            modal.$modal.trigger(ModalEvents.close);

            expect($('body').hasClass('has-activeModal')).toBeFalsy();
        });
    });

    describe('when modal finishes closing', () => {
        it('should reset size to default', () => {
            expect(modal.size).not.toEqual('large');
            modal.defaultSize = 'large';
            modal.$modal.trigger(ModalEvents.closed);

            expect(modal.size).toEqual('large');
        });
    });

    describe('constructor', () => {
        it('should set $modal', () => {
            expect(modal.$modal.get(0)).toBeDefined();
        });

        it('should set $content', () => {
            expect(modal.$content.get(0)).toBeDefined();
        });

        it('should set $overlay', () => {
            expect(modal.$overlay.get(0)).toBeDefined();
        });

        it('should set size to normal by default', () => {
            expect(modal.size).toEqual('normal');
        });

        it('should set pending to false by default', () => {
            expect(modal.pending).toBeFalsy();
        });

        describe('if template does not have `modal-content`', () => {
            beforeEach(() => {
                $element.remove();
                $element = attachHtml(`
                    <div id="modal" class="modal" data-reveal>
                        <div class="modal-header"></div>
                        <div class="modal-body"></div>
                    </div>
                `);

                modal = modalFactory()[0];
            });

            it('should create and attach `modal-content`', () => {
                expect($('.modal-content', modal.$modal).get(0)).toBeDefined();
            });

            it('should transclude existing content', () => {
                expect(modal.$content.html()).toEqual('<div class="modal-header"></div><div class="modal-body"></div>');
            });
        });
    });

    describe('open', () => {
        beforeEach(() => {
            spyOn(modal.$modal, 'foundation');
            spyOn(modal, 'clearContent');
        });

        it('should open modal', () => {
            modal.open();

            expect(modal.$modal.foundation).toHaveBeenCalledWith('reveal', 'open');
        });

        it('should set pending state to true by default', () => {
            modal.open();

            expect(modal.pending).toBeTruthy();
        });

        it('should set pending state to true if pending param is true', () => {
            modal.open({ pending: true });

            expect(modal.pending).toBeTruthy();
        });

        it('should set pending state to false if pending param is false', () => {
            modal.open({ pending: false });

            expect(modal.pending).toBeFalsy();
        });

        it('should set size if size param is passed', () => {
            expect(modal.size).not.toEqual('large');

            modal.open({ size: 'large' });

            expect(modal.size).toEqual('large');
        });

        it('should not set size if size param is not passed', () => {
            const size = modal.size;

            modal.open();

            expect(modal.size).toEqual(size);
        });

        it('should reset modal content by default', () => {
            modal.open();

            expect(modal.clearContent).toHaveBeenCalled();
        });

        it('should reset modal content if clearContent param is true', () => {
            modal.open({ clearContent: true });

            expect(modal.clearContent).toHaveBeenCalled();
        });

        it('should not reset modal content if clearContent param is false', () => {
            modal.open({ clearContent: false });

            expect(modal.clearContent).not.toHaveBeenCalled();
        });
    });

    describe('close', () => {
        beforeEach(() => {
            spyOn(modal.$modal, 'foundation');
        });

        it('should close modal', () => {
            modal.close();

            expect(modal.$modal.foundation).toHaveBeenCalledWith('reveal', 'close');
        });
    });

    describe('updateContent', () => {
        beforeEach(() => {
            spyOn(modal.$content, 'foundation');
        });

        it('should turn off pending state', () => {
            modal.pending = true;
            modal.updateContent('<p>hello world</p>');

            expect(modal.pending).toBeFalsy();
        });

        it('should update content', () => {
            modal.updateContent('<p>hello world</p>');

            expect(modal.$content.html()).toEqual('<p>hello world</p>');
        });

        it('should reinit foundation', () => {
            modal.updateContent('<p>hello world</p>');

            expect(modal.$content.foundation).toHaveBeenCalled();
        });
    });

    describe('clearContent', () => {
        it('should remove content', () => {
            modal.$content.html('hello world');

            modal.clearContent();

            expect(modal.$content.html()).toEqual('');
        });
    });

    describe('set pending', () => {
        it('should show overlay if true', () => {
            modal.pending = true;

            expect(modal.$overlay.is(':visible')).toBeTruthy();
        });

        it('should hide overlay if false', () => {
            modal.pending = false;

            expect(modal.$overlay.is(':visible')).toBeFalsy();
        });
    });

    describe('set size', () => {
        it('should set size class', () => {
            modal.size = 'large';
            expect(modal.$modal.hasClass('modal--large')).toBeTruthy();

            modal.size = 'normal';
            expect(modal.$modal.hasClass('modal--large')).toBeFalsy();
        });
    });
});

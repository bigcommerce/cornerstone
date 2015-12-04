import modalFactory, { ModalEvents } from '../../../theme/global/modal';

describe('Modal', () => {
    let $element;
    let html;
    let modal;

    beforeEach(() => {
        html = `
            <div id="modal" class="modal" data-reveal>
                <div class="modal-content"></div>
                <div class="loadingOverlay"></div>
            </div>
        `;

        $element = $(html);
        $element.appendTo(document.body);

        modal = modalFactory()[0];
    });

    afterEach(() => {
        $element.remove();
    });

    describe('when modal opens', () => {
        beforeEach(() => {
            spyOn(modal, 'clearContent');
        });

        it('should reset modal content', () => {
            modal.$modal.trigger(ModalEvents.open);

            expect(modal.clearContent).toHaveBeenCalled();
        });

        it('should turn on pending state', () => {
            expect(modal.pending).not.toBeTruthy();

            modal.$modal.trigger(ModalEvents.open);

            expect(modal.pending).toBeTruthy();
        });
    });

    describe('when modal closes', () => {
        it('should reset size to default', () => {
            expect(modal.size).not.toEqual('large');
            modal.defaultSize = 'large';
            modal.$modal.trigger(ModalEvents.close);

            expect(modal.size).toEqual('large');
        });
    });

    describe('open', () => {
        beforeEach(() => {
            spyOn(modal.$modal, 'foundation');
        });

        it('should open modal', () => {
            modal.open();

            expect(modal.$modal.foundation).toHaveBeenCalledWith('reveal', 'open');
        });

        it('should set size', () => {
            expect(modal.size).not.toEqual('large');

            modal.open({ size: 'large' });

            expect(modal.size).toEqual('large');
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
        it('should turn off pending state', () => {
            modal.pending = true;
            modal.updateContent('<p>hello world</p>');

            expect(modal.pending).toBeFalsy();
        });

        it('should update content', () => {
            modal.updateContent('<p>hello world</p>');

            expect(modal.$content.html()).toEqual('<p>hello world</p>');
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

export default class StencilDropdown {
    constructor(extendables) {
        this.extendables = extendables;
    }

    /**
     * @param $dropDown
     * @param style
     */
    hide($dropDown, style) {
        if (style) {
            $dropDown.attr('style', style);
        }

        // callback "hide"
        if (this.extendables && this.extendables.hide) {
            this.extendables.hide();
        }

        $dropDown.removeClass('is-open f-open-dropdown').attr('aria-hidden', 'true');
    }

    show($dropDown, event, style) {
        if (style) {
            $dropDown.attr('style', style).attr('aria-hidden', 'false');
        }

        $dropDown.addClass('is-open f-open-dropdown').attr('aria-hidden', 'false');

        // callback "show"
        if (this.extendables && this.extendables.show) {
            this.extendables.show(event);
        }
    }

    bind($dropDownTrigger, $container, style) {
        let modalOpened = false;

        $dropDownTrigger.on('click', event => {
            const $cart = $('.is-open[data-cart-preview]');

            if ($cart) {
                $cart.trigger('click');
            }

            if ($container.hasClass('is-open')) {
                this.hide($container, event);
            } else {
                this.show($container, event, style);
            }
        });

        $('body').on('click', e => {
            // Call onClick handler
            if (this.extendables && this.extendables.onBodyClick) {
                this.extendables.onBodyClick(e, $container);
            }
        }).on('keyup', (e) => {
            // If they hit escape and the modal isn't open, close the search
            if (e.which === 27 && !modalOpened) {
                this.hide($container);
            }
        }).on('open.fndtn.reveal', '[data-reveal]', () => {
            modalOpened = true;
        }).on('close.fndtn.reveal', '[data-reveal]', () => {
            modalOpened = false;
        }).on('click', '[data-drop-down-close]', () => {
            modalOpened = false;
            this.hide($container);
        });
    }
}

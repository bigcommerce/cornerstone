import $ from 'jquery';

export default {
    hide($dropDown, style) {
        if (style) {
            $dropDown.attr('style', style);
        }
        $('#search_query').blur();
        $dropDown.removeClass('is-open f-open-dropdown').attr('aria-hidden', 'true');
    },
    show($dropDown, event, style) {
        if (style) {
            $dropDown.attr('style', style).attr('aria-hidden', 'false');
        }

        $dropDown.addClass('is-open f-open-dropdown').attr('aria-hidden', 'false');
        $('#search_query').focus();
        event.stopPropagation();
    },
    bind($dropDownTrigger, $container, style) {
        let modalOpened = false;

        $dropDownTrigger.on('click', (event) => {
            const $cart = $('.is-open[data-cart-preview]');

            if ($cart) {
                $cart.click();
            }

            $container.hasClass('is-open') ? this.hide($container) : this.show($container, event, style);
        });

        $('body').click((e) => {
            // If the target element has this data tag or one of it's parents, do not close the search results
            // We have to specify `.modal-background` because of limitations around Foundation Reveal not allowing
            // any modification to the background element.
            if ($(e.target).closest('[data-prevent-quick-search-close], .modal-background').length === 0) {
                this.hide($container);
            }
        }).on('keyup', (e) => {
            // If they hit escape and the modal isn't open, close the search
            if (e.which === 27 && ! modalOpened) {
                this.hide($container);
            }
        }).on('open.fndtn.reveal', '[data-reveal]', () => {
            modalOpened = true;
        }).on('close.fndtn.reveal', '[data-reveal]', () => {
            modalOpened = false;
        });
    },
};

import $ from 'jquery';

export default {
    hide($dropDown, style) {
        if (style) {
            $dropDown.attr('style', style);
        }

        $dropDown.removeClass('is-open f-open-dropdown').attr('aria-hidden', 'true');
    },
    show($dropDown, event, style) {
        if (style) {
            $dropDown.attr('style', style).attr('aria-hidden', 'true');
        }

        $dropDown.addClass('is-open f-open-dropdown').attr('aria-hidden', 'false');
        event.stopPropagation();
    },
    bind($dropDownTrigger, $container, style) {
        $dropDownTrigger.on('click', (event) => {
            $container.hasClass('is-open') ? this.hide($container) : this.show($container, event, style);
        });

        $container.click((event) => {
            event.stopPropagation();
        });

        $('body').click(() => {
            this.hide($container);
        });
    }
}

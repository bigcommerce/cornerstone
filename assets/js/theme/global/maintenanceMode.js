import $ from 'jquery';

/**
 * Show the maintenance mode message to store administrators
 * @param maintenanceMode
 */
export default function (maintenanceMode = {}) {
    const header = maintenanceMode.header;
    const notice = maintenanceMode.notice;

    let scrollTop = 0;

    if (!(header && notice)) {
        return;
    }

    const $element = $('<div>', {
        id: 'maintenance-notice',
        class: 'maintenanceNotice',
    });

    $element.html(`<p class="maintenanceNotice-header">${header}</p>${notice}`);

    $('body').append($element);

    $(window)
        .bind('scroll', () => {
            $element.css('top', `${($('body').scrollTop() + scrollTop)}px`);
        })
        .bind('resize', () => {
            const menuWidth = $('#maintenance-notice').width();

            if (menuWidth + $('#maintenance-notice').offset().left > $(window).width()) {
                const newLeft = (`${$(window).width() - menuWidth - 50}px`);

                $('#maintenance-notice').css('left', newLeft);
            }
        });

    scrollTop = $('#maintenance-notice').scrollTop() - $('body').scrollTop();

    $(window).trigger('resize');
}

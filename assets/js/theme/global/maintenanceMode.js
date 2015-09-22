import utils from 'bigcommerce/stencil-utils';

/**
 * Show the maintenance mode message to store administrators
 * @param maintenanceMode
 */
export default function(maintenanceMode) {
    maintenanceMode = maintenanceMode || {};

    let scrollTop = 0,
        header = maintenanceMode.header,
        notice = maintenanceMode.notice,
        $element;

    if (!(header && notice)) {
        return;
    }

    $element = $('<div>', {
        'id': 'maintenance-notice',
        'class': 'maintenanceNotice'
    }).html(`<p class="maintenanceNotice-header">${header}</p>${notice}`);

    $('body').append($element);

    $(window)
        .bind('scroll', () => {
            $element.style.top = ($('body').scrollTop() + scrollTop) + "px";
        })
        .bind('resize', (event) => {
            let menuWidth = $('#maintenance-notice').width();
            if (menuWidth + $('#maintenance-notice').offset().left > $(window).width()) {
                let newLeft = ($(window).width() - menuWidth - 50) + 'px';
                $('#maintenance-notice').css('left', newLeft);
            }
        });

    scrollTop = $('#maintenance-notice').scrollTop() - $('body').scrollTop();
    $(window).trigger('resize');
}

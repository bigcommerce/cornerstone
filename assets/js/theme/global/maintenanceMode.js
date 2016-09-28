import $ from 'jquery';

/**
 * Show the maintenance mode message to store administrators
 * @param maintenanceMode
 */
export default function (maintenanceMode = {}) {
    const header = maintenanceMode.header;
    const notice = maintenanceMode.notice;

    if (!(header && notice)) {
        return;
    }

    const $element = $('<div>', {
        id: 'maintenance-notice',
        class: 'maintenanceNotice',
    });

    $element.html(`<p class="maintenanceNotice-header">${header}</p>${notice}`);

    $('body').append($element);
}

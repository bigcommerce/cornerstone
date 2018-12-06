import sweetAlert from 'sweetalert2';

export default function () {
    // Set defaults for sweetalert2 popup boxes
    sweetAlert.setDefaults({
        buttonsStyling: false,
        confirmButtonClass: 'button',
        cancelButtonClass: 'button',
    });

    return sweetAlert;
}

import swal from 'sweetalert2';

export default function () {
    // Set defaults for sweetalert2 popup boxes
    swal.setDefaults({
        buttonsStyling: false,
        confirmButtonClass: 'button',
        cancelButtonClass: 'button',
    });
}

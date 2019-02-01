import sweetAlert from 'sweetalert2';

// Set defaults for sweetalert2 popup boxes
sweetAlert.setDefaults({
    buttonsStyling: false,
    confirmButtonClass: 'button',
    cancelButtonClass: 'button',
});

// Re-export
export default sweetAlert;

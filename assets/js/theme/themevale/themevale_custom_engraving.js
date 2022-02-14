import $ from 'jquery';
import utils from '@bigcommerce/stencil-utils';
import swal from 'sweetalert2';
import _ from 'lodash';
import modalFactory, { showAlertModal } from '../global/modal';

export default function(context) {

     $(document).on('click', '#add-custom-engraving-button', function() {
        var line1 = $('#add-custom-engraving .form-field  input[name=line1]').val();
        var line2 = $('#add-custom-engraving .form-field  input[name=line2]').val();
            
        var ask_proceed = true;

        if (!$.trim(line1) && !$.trim(line2)) {
            $('#add-custom-engraving .form-field.Line1').removeClass('form-field--success').addClass('form-field--error');
            $('#add-custom-engraving .form-field.Line2').removeClass('form-field--success').addClass('form-field--error');
            $('.notes-cotent').before('<span class="alert-message">Please fill out Line 1 field or Line 2 field or both !</span>');
            ask_proceed = false;
        }  else {
            $('#add-custom-engraving .form-field.Line1').removeClass('form-field--error').addClass('form-field--success');
            $('#add-custom-engraving .form-field.Line2').removeClass('form-field--error').addClass('form-field--success');
            ask_proceed = true;
        }


       if (ask_proceed) {
            $('#add-custom-engraving .modal-close').trigger( "click" );

            if ($('.data-product-option .Line1 input').length > 0 ) {
                $('.data-product-option .Line1 input').val(line1);
            }
            if ($('.data-product-option .Line2 input').length > 0 ) {
                $('.data-product-option .Line2 input').val(line2);
            }
            if ($('.data-product-option .Engraving input.Custom').length > 0 ) {
                $('.data-product-option .Engraving input.Custom').trigger( "click" );
            }            
       }     

    });

}

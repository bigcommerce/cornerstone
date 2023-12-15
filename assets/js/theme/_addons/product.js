import PageManager from '../page-manager';
import {onLCP, onFID, onCLS} from 'web-vitals';

onCLS(console.log);
onFID(console.log);
onLCP(console.log);

export default class Product extends PageManager {
    constructor(context) {
        super(context);
        this.url = window.location.href;
    }

    // onReady() {
        
    //     //remove the container class from the body class to allow full width on cs-product pages
    //     $('#body-container').removeClass('container');

    //     //Listen for click on image carousel
    //     $('body').on('click', '[data-reveal-id="modal-images"]', (event) => {
    //         //Capture the index of the clicked image
    //         var startIndex = $(event.target).index();

    //         //Initialize the modal gallery
    //         this.initModalGallery(startIndex);
    //     });

    //     //Listen for closing of the modal gallery
    //     $('#modal-images').on('close.fndtn.reveal', () => {
    //         // destroy the modal carousel
    //         if($('.slick-carousel-modal').length > 1) {
    //             $('.slick-carousel-modal').slick('unslick');
    //         }
    //         $("#modal-images .modal-content").empty();
    //     });

    //     //Tab select event for clicking the product rating
    //     $('#product-rating').on('click', function (event) {
    //         event.preventDefault();
    //         var targetTabHref = $(this).attr('href');
    //         $('a.tab-title[href="' + targetTabHref + '"]').trigger('click');
    //     });

    //     //Listen for click on blem acknowledgement to check the box and close the modal
    //     $('#blem-acknowledgement').on('click', function (event) {
    //         $('#blem-check').prop("checked", true);
    //         $('.modal-close').trigger('click');
    //         $('#blem-check').removeAttr('data-reveal-id');
    //         $('#sratch-and-dent').remove();
    //     });

    //     //Listen for click on blem decline and close the modal without checking the box
    //     $('#blem-decline').on('click', function (event) {
    //         $('.modal-close').trigger('click');
    //     });

    // }

    // // Runs the CravenSpeed product images modal
    // initModalGallery(startIndex) {
    //     //Create the modal content
    //     $('#modal-images .modal-content').append('<button class="modal-close" type="button" title="Close"> <span class="aria-description--hidden">Close</span> <span aria-hidden="true">&#215;</span> </button>');
    //     $('#modal-images .modal-content').append('<div class="modal-slides"><div class="slick-carousel-modal"></div></div>');

    //     var imgModal = $('.slick-carousel-modal');

    //     //Copy the existing slick carousel and add it to the modal
    //     $('.slick-track .slick-slide').each(function () {
    //         let background = $(this).css('background');
    //         let urlRegex = /url\("([^"]+)"/;
    //         let url = background.match(urlRegex)[1];
    //         let modalSlide = $('<div class="modal-slide"></div>');
    //         let img = $('<img>').attr('src', url);
    //         modalSlide.append(img);
    //         if ($('.slick-slide').length === 1) {
    //             imgModal.append(img);
    //             imgModal.css('display', 'flex');
    //             imgModal.css('justify-content', 'center');
    //         } else {
    //             imgModal.append(modalSlide);
    //         }
    //     });

    //     // Initialize the modal carousel if there is more than one slide.
    //     if (imgModal.find('.modal-slide').length > 1) {
    //         imgModal.slick({
    //             initialSlide: startIndex,
    //             arrows: true,
    //             infinite: false
    //         });

    //         //force slick to recalculate it's dimensions
    //         imgModal.slick('refresh');
    //     }

    // }

}
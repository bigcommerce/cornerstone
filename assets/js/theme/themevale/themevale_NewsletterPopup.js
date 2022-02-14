import $ from 'jquery';
/* eslint-disable space-before-function-paren */
/* eslint-disable indent */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
/* eslint-disable padded-blocks */
/* eslint-disable prefer-template */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable no-inner-declarations */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-else-return */

export default function (t, ev) {

   function setCookie(cname, cvalue, exdays) {
      const d = new Date();
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
      const expires = 'expires=' + d.toUTCString();
      document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
   }

   function getCookie(cname) {
      const name = cname + '=';
      const ca = document.cookie.split(';');

      for (var i = 0; i < ca.length; i++) {
         var c = ca[i];
         while (c.charAt(0) === ' ') {
            c = c.substring(1);
         }
         if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
         }
      }
      return '';
   }

   const deleteCookie = function(name) {
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
   };

   if ((ev === true) && (getCookie('themevaleNewsletterPopup') === '')) {
      setTimeout(function() {
         $('#themevale_newsletter').removeClass('hide').addClass('animated fadeIn');
         $('body').addClass('has-newsletter');
      }, 500);
      

      $('#popupSubcribeFormSubmit').submit(function(event) {
         if ($('#popupSubcribeFormSubmit').find('#nl_email').val() === '') {
            alert('Please enter you Email Address!');
            return false;
         } else {
            setCookie('themevaleNewsletterPopup', 'closed', t);

            $('#themevale_newsletter').addClass('animated fadeOut');
            setTimeout(function() {
               $('#themevale_newsletter').addClass('hide');
               $('body').removeClass('has-newsletter');
               return true;
            }, 300);
         }
      });

      function setClosePopup() {
         setCookie('themevaleNewsletterPopup', 'closed', t);
         $('#themevale_newsletter').addClass('animated fadeOut');
         setTimeout(function() {
            $('#themevale_newsletter').addClass('hide');
            $('body').removeClass('has-newsletter');
         }, 300);
      }

      $(document).on('click', '[data-close-newsletter-popup]', function() {
         setClosePopup();
      });
      
      $('.popup-overlay').on('click', function(ev) {
         if ($('body').hasClass('has-newsletter')) {
            setClosePopup();
         }
      });

      $(document).keyup(function(e) {
         if (e.keyCode === 27) { // escape key maps to keycode `27`
            setClosePopup();
         }
      });
   }

   if (ev === false) {
      deleteCookie('themevaleNewsletterPopup');
   }
}

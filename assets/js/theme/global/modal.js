import $ from 'jquery';

export default {

    open: function (content) {
        let element = $('.modal');

        element.html(content);
        element.addClass('active');
    },

    close: function() {
        let element = $('.modal');
        element.removeClass('active');
        element.html('');
    }
};


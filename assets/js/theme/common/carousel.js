import $ from 'jquery';
import 'slick-carousel/slick/slick';

export default function () {

    let $carousel = $('[data-slick]');

    if ($carousel.length) {
        $carousel.slick();
    }

}

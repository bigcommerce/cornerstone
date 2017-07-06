import $ from 'jquery';
import 'slick-carousel/slick/slick.min';

export default function () {
    const $carousel = $('[data-slick]');

    if ($carousel.length) {
        $carousel.slick();
    }
}

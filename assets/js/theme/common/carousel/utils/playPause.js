import { throttle } from 'lodash';

const playAction = 'slickPlay';
const pauseAction = 'slickPause';

export default ($heroCarousel) => {
    const $playPauseButton = $('.js-hero-play-pause-button');

    if ($playPauseButton.length === 0) return;

    const slickSettings = $heroCarousel[0].slick;
    if (!slickSettings) return;

    const { slideCount, options: { speed } } = slickSettings;
    if (slideCount < 2) {
        $playPauseButton.css('display', 'none');
        return;
    }

    const onPlayPauseClick = () => {
        const isCarouselPlaying = $playPauseButton.data('play');
        const action = isCarouselPlaying ? pauseAction : playAction;
        const {
            play,
            ariaPlay,
            pause,
            ariaPause,
        } = $playPauseButton.data('labels');

        $heroCarousel.slick(action);
        $playPauseButton
            .data('play', !isCarouselPlaying)
            .text(action === playAction ? pause : play)
            .attr('aria-label', action === playAction ? ariaPause : ariaPlay);
    };

    $playPauseButton.on('click', throttle(onPlayPauseClick, speed, { trailing: false }));
};

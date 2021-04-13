import { throttle } from 'lodash';

const PLAY_ACTION = 'slickPlay';
const PAUSE_ACTION = 'slickPause';
const IS_ACTIVATED_DATA_ATTR = 'is-activated';

export default (carousel, slidesQuantity, context) => {
    const { $slider, $dots, speed } = carousel;
    const $playPauseButton = $slider.find('[data-play-pause-button]');

    if ($playPauseButton.length === 0) return;

    $playPauseButton.css('display', slidesQuantity < 2 ? 'none' : 'block');

    if ($playPauseButton.data(IS_ACTIVATED_DATA_ATTR)) return;

    const {
        carouselPlayPauseButtonPlay,
        carouselPlayPauseButtonPause,
        carouselPlayPauseButtonAriaPlay,
        carouselPlayPauseButtonAriaPause,
    } = context;

    const updateLabels = action => {
        $playPauseButton
            .text(action === PLAY_ACTION
                ? carouselPlayPauseButtonPause : carouselPlayPauseButtonPlay)
            .attr('aria-label', action === PLAY_ACTION
                ? carouselPlayPauseButtonAriaPause : carouselPlayPauseButtonAriaPlay);
    };

    const onPlayPauseClick = () => {
        const action = carousel.paused ? PLAY_ACTION : PAUSE_ACTION;

        $slider.slick(action);
        updateLabels(action);
    };

    // for correct carousel controls focus order
    if ($dots) {
        $playPauseButton.insertBefore($dots);
    } else $slider.append($playPauseButton);

    $playPauseButton.on('click', throttle(onPlayPauseClick, speed, { trailing: false }));
    $playPauseButton.data(IS_ACTIVATED_DATA_ATTR, true);

    if (carousel.breakpoints.length) {
        $slider.on('breakpoint', () => updateLabels(PLAY_ACTION));
    }
};

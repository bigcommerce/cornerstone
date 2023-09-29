import { throttle } from 'lodash';

const PLAY_ACTION = 'slickPlay';
const PAUSE_ACTION = 'slickPause';
const updateButtonLabels = (context) => {
    const {
        carouselPlayPauseButtonPlay,
        carouselPlayPauseButtonPause,
        carouselPlayPauseButtonAriaPlay,
        carouselPlayPauseButtonAriaPause,
    } = context;

    return ($button, action) => {
        $button
            .text(action === PLAY_ACTION
                ? carouselPlayPauseButtonPause : carouselPlayPauseButtonPlay)
            .attr('aria-label', action === PLAY_ACTION
                ? carouselPlayPauseButtonAriaPause : carouselPlayPauseButtonAriaPlay);
    };
};
let updateButtonLabelsWithContext;

export default (e, carouselObj, context) => {
    const { $slider, $dots, options: { speed } } = carouselObj;
    const $playPauseButton = $slider.find('[data-play-pause-button]');

    if ($playPauseButton.length === 0) return;

    // for correct carousel controls focus order
    if ($dots) {
        $playPauseButton.insertBefore($dots);
    } else $slider.append($playPauseButton);

    const { slidesQuantity } = $slider.data('state');
    $playPauseButton.css('display', slidesQuantity > 1 ? 'block' : 'none');

    if (e.type === 'init') updateButtonLabelsWithContext = updateButtonLabels(context);

    if (e.type === 'breakpoint') {
        updateButtonLabelsWithContext($playPauseButton, PLAY_ACTION);
        return;
    }

    const onPlayPauseClick = () => {
        const action = carouselObj.paused ? PLAY_ACTION : PAUSE_ACTION;

        $slider.slick(action);
        updateButtonLabelsWithContext($playPauseButton, action);
    };

    $playPauseButton.on('click', throttle(onPlayPauseClick, speed, { trailing: false }));
};

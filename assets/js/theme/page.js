import PageManager from './page-manager';

export default class Page extends PageManager {
    constructor(context) {
        super(context);
        this.pathname = window.location.pathname;
    }

    addVideoClickLayer() {
        const videoContainer = document.getElementsByClassName('video-container-realmax');
        const videoClickLayer = document.createElement('div');
        videoClickLayer.classList.add('video-click-layer');

        videoContainer[0].appendChild(videoClickLayer);

        const player = document.querySelector('[data-src="https://www.youtube.com/embed/bfctwig1HUQ?start=0&end=0&autoplay=1&loop=1&mute=1&playlist=bfctwig1HUQ&version=3&rel=0"]');
        console.log('player......? ', player);

        videoClickLayer.addEventListener('click', (el) => {
            // 1. unmute the video

            // 2. play the video from the beginning
            
            // 3. remove the clicklayer
            el.target.style.display = 'none';
        });
    }
    
    onReady() {
        this.pathname === '/' && this.addVideoClickLayer();
    }
}
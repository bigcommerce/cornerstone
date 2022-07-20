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

        videoClickLayer.addEventListener('click', (el) => {
            // 1. unmute the video

            // 2. play the video from the beginning
            
            // 3. remove the clicklayer
            el.target.style.display = 'none';
        });
    }
    
    onReady() {
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        var player;
        function onYouTubeIframeAPIReady() {
            player = new YT.Player('realmax-iframe', {
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
        }

        function onPlayerReady() {
            console.log('testing onPlayerReady');
        }
        
        function onPlayerStateChange(event) {
            console.log('testing onPlayerStateChange', event.data);
        }

        console.log('testing...');
        
        this.pathname === '/home-test' && this.addVideoClickLayer();
    }
}
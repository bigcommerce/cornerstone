export class VideoGallery {
    constructor($element) {
        this.$player = $element.find('[data-video-player]');
        this.$videos = $element.find('[data-video-item]');
        this.currentVideo = {};
        this.referrer = window.location.origin;
        this.isSafari = this.detectSafari();
        this.bindEvents();
        this.initializePlayer();
    }

    detectSafari() {
        const userAgent = navigator.userAgent.toLowerCase();

        return /safari/.test(userAgent) && !/chrome|chromium|crios|fxios/.test(userAgent);
    }

    /**
     * Build YouTube embed URL with widget_referrer and origin parameters
     * @param {string} videoId - YouTube video ID
     * @param {string} existingParams - Existing URL parameters (e.g., "rel=0")
     * @returns {string} Complete YouTube embed URL
     */
    buildEmbedUrl(videoId, existingParams = '') {
        const params = new URLSearchParams(existingParams);

        // helps with Safari compatibility
        params.set('widget_referrer', this.referrer);
        params.set('origin', this.referrer);

        return `//www.youtube.com/embed/${videoId}?${params.toString()}`;
    }

    /**
     * Set iframe permissions for enhanced YouTube player functionality
     */
    setIframePermissions() {
        const allowPermissions = [
            'autoplay',
            'clipboard-write',
            // allows the iframe to use Encrypted Media Extensions and play protected content
            'encrypted-media',
            'picture-in-picture',
            'web-share',
        ];
        const currentPermissions = (this.$player.attr('allow') || '').split(';').map(s => s.trim()).filter(Boolean);
        const allowSet = new Set([...currentPermissions, ...allowPermissions]);
        this.$player.attr('allow', Array.from(allowSet).join('; '));
    }

    initializePlayer() {
        // Set iframe referrer policy to ensure Referer header is sent
        this.$player.attr('referrerpolicy', 'strict-origin-when-cross-origin');

        // Set extra permissions for better YouTube functionality
        // this.setIframePermissions();

        const currentSrc = this.$player.attr('src') || this.$player.attr('data-src');
        if (currentSrc) {
            // Extract video ID and existing parameters from the URL
            const match = currentSrc.match(/\/embed\/([^?]+)(?:\?(.+))?/);
            if (match) {
                const videoId = match[1];
                const existingParams = match[2] || '';
                // Rebuild URL to ensure widget_referrer and origin are present for Safari compatibility
                const newSrc = this.buildEmbedUrl(videoId, existingParams);

                if (this.isSafari) {
                    // Removing lazyload and setting src directly ensures referrerpolicy is respected before the first request in Safari
                    this.$player.removeClass('lazyload');
                    this.$player.attr('src', newSrc);
                } else {
                    // Keep lazyload class and only update data-src for rest browsers
                    this.$player.attr('data-src', newSrc);
                }
            }
        }
    }

    selectNewVideo(e) {
        e.preventDefault();

        const $target = $(e.currentTarget);

        this.currentVideo = {
            id: $target.data('videoId'),
            $selectedThumb: $target,
        };

        this.setMainVideo();
        this.setActiveThumb();
    }

    setMainVideo() {
        const embedUrl = this.buildEmbedUrl(this.currentVideo.id);
        this.$player.attr('src', embedUrl);
    }

    setActiveThumb() {
        this.$videos.removeClass('is-active');
        this.currentVideo.$selectedThumb.addClass('is-active');
    }

    bindEvents() {
        this.$videos.on('click', this.selectNewVideo.bind(this));
    }
}

export default function videoGallery() {
    const pluginKey = 'video-gallery';
    const $videoGallery = $(`[data-${pluginKey}]`);

    $videoGallery.each((index, element) => {
        const $el = $(element);
        const isInitialized = $el.data(pluginKey) instanceof VideoGallery;

        if (isInitialized) {
            return;
        }

        $el.data(pluginKey, new VideoGallery($el));
    });
}

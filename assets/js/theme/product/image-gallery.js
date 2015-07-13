import $ from 'jquery';
import 'jackmoore/zoom';

export default class ImageGallery {

    constructor($gallery) {
        this.$gallery = $gallery;
        this.$mainImage = $gallery.find('[data-image-gallery-main]');
        this.$selectableImages = $gallery.find('[data-image-gallery-item]');
        this.currentImage = {};
        this.bindEvents();
        this.setImageZoom();
    }

    selectNewImage(e) {
        e.preventDefault();

        let $target = $(e.currentTarget);

        this.currentImage = {
            mainImageUrl: $target.attr('data-image-gallery-new-image-url'),
            zoomImageUrl: $target.attr('data-image-gallery-zoom-image-url'),
            $selectedThumb: $target
        };

        this.destroyImageZoom();
        this.setActiveThumb();
        this.swapMainImage();
        this.setImageZoom();
    }

    setActiveThumb() {
        this.$selectableImages.removeClass('is-active');
        this.currentImage.$selectedThumb.addClass('is-active');
    }

    swapMainImage() {
        this.$mainImage.attr({
            'data-zoom-image': this.currentImage.zoomImageUrl
        }).find('img').attr({
            src: this.currentImage.mainImageUrl
        });
    }

    setImageZoom() {
        this.$mainImage.zoom({url: this.$mainImage.attr('data-zoom-image')});
    }

    destroyImageZoom() {
        this.$mainImage.trigger('zoom.destroy');
    }

    bindEvents() {
        this.$selectableImages.on('click', this.selectNewImage.bind(this));
    }

}

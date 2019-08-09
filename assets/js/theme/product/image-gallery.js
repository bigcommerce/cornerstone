import 'easyzoom';
import _ from 'lodash';

export default class ImageGallery {
    constructor($gallery) {
        this.$mainImage = $gallery.find('[data-image-gallery-main]');
        this.$selectableImages = $gallery.find('[data-image-gallery-item]');
        this.currentImage = {};
    }

    init() {
        this.bindEvents();
        this.setImageZoom();
    }

    setMainImage(imgObj) {
        this.currentImage = _.clone(imgObj);

        this.setActiveThumb();
        this.swapMainImage();
    }

    setAlternateImage(imgObj) {
        if (!this.savedImage) {
            this.savedImage = {
                mainImageUrl: this.$mainImage.find('img').attr('src'),
                zoomImageUrl: this.$mainImage.attr('data-zoom-image'),
                mainImageSrcset: this.$mainImage.find('img').attr('srcset'),
                $selectedThumb: this.currentImage.$selectedThumb,
            };
        }
        this.setMainImage(imgObj);
    }

    restoreImage() {
        if (this.savedImage) {
            this.setMainImage(this.savedImage);
            delete this.savedImage;
        }
    }

    selectNewImage(e) {
        e.preventDefault();
        const $target = $(e.currentTarget);
        const imgObj = {
            mainImageUrl: $target.attr('data-image-gallery-new-image-url'),
            zoomImageUrl: $target.attr('data-image-gallery-zoom-image-url'),
            mainImageSrcset: $target.attr('data-image-gallery-new-image-srcset'),
            $selectedThumb: $target,
        };

        this.setMainImage(imgObj);
    }

    setActiveThumb() {
        this.$selectableImages.removeClass('is-active');
        if (this.currentImage.$selectedThumb) {
            this.currentImage.$selectedThumb.addClass('is-active');
        }
    }

    swapMainImage() {
        this.easyzoom.data('easyZoom').swap(
            this.currentImage.mainImageUrl,
            this.currentImage.zoomImageUrl,
            this.currentImage.mainImageSrcset,
        );

        this.$mainImage.attr({
            'data-zoom-image': this.currentImage.zoomImageUrl,
        });
    }

    checkImage() {
        const containerHeight = $('.productView-image').height();
        const containerWidth = $('.productView-image').width();
        const height = this.easyzoom.data('easyZoom').$zoom.context.height;
        const width = this.easyzoom.data('easyZoom').$zoom.context.width;
        if (height < containerHeight || width < containerWidth) {
            this.easyzoom.data('easyZoom').hide();
        }
    }

    setImageZoom() {
        this.easyzoom = this.$mainImage.easyZoom({
            onShow: () => this.checkImage(),
            errorNotice: '',
            loadingNotice: '',
        });
    }

    bindEvents() {
        this.$selectableImages.on('click', this.selectNewImage.bind(this));
    }
}

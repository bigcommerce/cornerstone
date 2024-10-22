export default class CsGallery {
  constructor({
    containerClass = 'test-container', // css class of the parent element
    modal = true, // true to include a clickable modal
    visibleSlides = 1, // the number of slides that are visible in the gallery at a time
    keyControls = true, // control the gallery with the keyboard
    type = 'image-gallery', // [image-gallery, collection] A gallery of photos, or a collection of products
    map = true, // Include a visual reference to the user's position in the gallery
  } = {}) {
    this.containerClass = containerClass;
    this.modal = modal;
    this.visibleSlides = visibleSlides;
    this.keyControls = keyControls;
    this.type = type;
    this.map = map;
    this.container = document.querySelector(`.${containerClass}`);
    this.imageContainer = this.container.querySelector('.slides-wrapper .slides');
    this.slides = this.imageContainer.querySelectorAll('.slide');
    this.mapElement = this.container.querySelector('.gallery-map');
    this.currentSlide = 1;
    this.moveDistance = 100;
    this.isAnimating = false;

    // setup modal elements if modal is selected
    if (this.modal) {
      this.galleryModal = this.container.querySelector('.gallery-modal');
      this.modalContent = this.container.querySelector('.modal-content');
    }

    // make sure visiible slides doesn't exceed the total number of slides
    if (this.slides.length < this.visibleSlides) {
      this.visibleSlides = this.slides.length;
    }

    // apply the appropriate class to the slides so that the correct number of slides are visible, and adjust the move distance for the next and prev functions
    if (this.visibleSlides > 1) {
      this.slides.forEach((slide) => {
        slide.classList.add(`visible-slides-${this.visibleSlides}`);
        this.moveDistance = 100 / this.visibleSlides;
      });
    }

    // add a class to the parent to trigger css for collection mode
    if (this.type === 'collection') {
      this.container.classList.add('collection');
    }

    // if there is only one slide, hide the map and don't create a gallery
    if (this.slides.length === 1) {
      this.map = false;
      this.container.querySelector('.gallery-nav').style.display = 'none';
    } else {
      this.init();
    }
  }

  init() {
    this.clickHandler = this.handleClick.bind(this);
    this.container.addEventListener('click', this.clickHandler);

    if (this.keyControls) {
      this.keydownHandler = this.handleKeydown.bind(this);
      document.addEventListener('keydown', this.keydownHandler);
    }

    if (this.map) {
      this.initMap();
    }

    // ensure that the map is visible if the previous gallery only had one image
    this.container.querySelector('.gallery-nav').style.display = 'flex';
  }

  handleClick(event) {
    const target = event.target.closest('[data-gallery-item]');
    if (!target) return;
    const action = target.dataset.galleryItem;
    if (action) {
      switch (action) {
        case 'next':
          this.handleNavigation('next');
          break;
        case 'previous':
          this.handleNavigation('previous');
          break;
        case 'slide':
          if (this.modal) {
            this.initModal(event.target.cloneNode(true));
          }
          break;
        case 'close':
          if (this.modal) {
            this.closeModal();
          }
          break;
        default:
          console.warn('unknown action in gallery');
      }
    }
  }

  handleKeydown(event) {
    const key = event.key;
    switch (key) {
      case 'ArrowLeft':
        this.handleNavigation('previous');
        break;
      case 'ArrowRight':
        this.handleNavigation('next');
        break;
      case 'Escape':
        if (this.modal) this.closeModal();
        break;
    }
  }

  initMap() {
    if (this.type === 'image-gallery') {
      const dot = '<svg width="8" height="8" xmlns="http://www.w3.org/2000/svg"><circle cx="4" cy="4" r="4" fill="gray"/></svg>';
      let dots = '';

      for (let i = 0; i < this.slides.length - this.visibleSlides + 1; i++) {
        dots += dot;
      }

      this.mapElement.innerHTML = dots;
      this.mapElement.children[0].classList.add('active');
    }

    if (this.type === 'collection') {
      const bar = document.createElement('div');
      const indicator = document.createElement('div');
      bar.classList.add('gallery-map-bar');
      indicator.classList.add('gallery-map-indicator');
      this.indicatorWidth = 100 / (this.slides.length - (this.visibleSlides - 1));
      indicator.style.width = `${this.indicatorWidth}%`;
      bar.append(indicator);
      this.mapElement.append(bar);
    }
  }

  handleNavigation(direction) {
    let bump = false;

    if ( direction === 'next' && this.currentSlide < this.slides.length - (this.visibleSlides - 1)) {
      this.currentSlide++;
    } else if (direction === 'previous' && this.currentSlide > 1) {
      this.currentSlide--;
    } else {
      this.bump();
      bump = true;
    }

    let moveAddress = -(this.currentSlide - 1) * this.moveDistance;
    if (!bump) {
      this.moveTo(moveAddress);
    }

    if (this.map) {
      if (this.type === 'image-gallery') {
        const children = this.mapElement.children;

        for (let i = 0; i < children.length; i++) {
          if (i === this.currentSlide - 1) {
            children[i].classList.add('active');
          } else {
            children[i].classList.remove('active');
          }
        }
      }

      if (this.type === 'collection') {
        const indicator = this.container.querySelector('.gallery-map-indicator');
        indicator.style.transform = `translateX(calc((${this.currentSlide} - 1) * 100%))`;
      }
    }
  }

  initModal(image) {
    this.modalContent.innerHTML = '';
    this.modalContent.append(image);
    this.galleryModal.style.display = 'flex';
    this.galleryModal.showModal();
  }

  closeModal() {
    this.modalContent.innerHTML = '';
    this.galleryModal.style.display = 'none';
    this.galleryModal.close();
  }
  
  moveTo(address) {
    this.imageContainer.style.transform = `translateX(${address}%)`;
  }

  // an animation to indicate when there is not another image to navigate to
  bump() {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const bumpDistance = 25;
    const slideOffset = -(this.currentSlide - 1) * this.moveDistance;
    const bumpOffset = this.currentSlide === 1 ? bumpDistance : -bumpDistance;

    this.imageContainer.style.transform = `translateX(calc(${slideOffset}% + ${bumpOffset}px))`;

    setTimeout(() => {
      this.imageContainer.style.transform = `translateX(${slideOffset}%)`;
    }, 100);

    setTimeout(() => {
      this.isAnimating = false;
    }, 400);
  }

  destroy() {
    // Remove click event listener from container
    this.container.removeEventListener('click', this.clickHandler);

    // Remove keydown event listener from document
    if (this.keyControls) {
      document.removeEventListener('keydown', this.keydownHandler);
    }

    // Clear modal if modal is enabled
    if (this.modal) {
      this.closeModal();
      this.galleryModal = null;
      this.modalContent = null;
    }

    // Clear any DOM elements and references
    this.mapElement.innerHTML = '';

    // reset the position of the slides container
    this.imageContainer.style.transform = `translateX(0)`;
    
    // Nullify properties for garbage collection
    this.slides = null;
    this.imageContainer = null;
    this.container = null;
    this.mapElement = null;

  }
}

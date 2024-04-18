import PageManager from '../page-manager';
import inStockNotifyForm from './product/inStockNotify';

export default class Product extends PageManager {
  constructor(context) {
    super(context);
    this.make;
    this.model;
    this.gen;
    this.opt1Index;
    this.endPointIndex;
    this.endPointData;
    this.name;
    this.baseId;
    this.baseSku;
    this.aliasSku;
    this.inventory;
    this.madeToOrder = false;
    this.aliasProduct = false;
    this.selectChange = false;
    this.galleryInitialized = false;
    this.imageArray = [];
    this.vehicleProducts = [];
    this.loadedDefaultIntructions = false;
    this.blemData = {};
    this.blemAcknowledged = false;
    this.addUrl = '';
    this.blemAddUrl = '';

    this.instructionsTabHandler = this.instructionsTabHandler.bind(this);
    this.ratingHandler = this.ratingHandler.bind(this);
    this.blemAcceptHandler = this.blemAcceptHandler.bind(this);
    this.blemDeclineHandler = this.blemDeclineHandler.bind(this);
    this.toggleBlem = this.toggleBlem.bind(this);

    this.stockNotificationSignup = new inStockNotifyForm(
      document.querySelector('#stock-notification')
    );

    // element properties
    this.addToCartButton = document.querySelector('#product-add-button');
    this.instructionsTab = document.querySelector('#instructions-tab');
    this.rating = document.querySelector('#product-rating');
    this.reviewsTab = document.querySelector('#tab-reviews');
    this.blemAcceptButton = document.querySelector('#blem-accept');
    this.blemDeclineLink = document.querySelector('#blem-decline');

    // an object containing the selection steps and their properties (the element, default, etc...)
    this.selectionSteps = {
      make: {
        element: document.querySelector('#make'),
        default: 'Choose your Make',
        hasIndex: false,
        step: 0,
      },
      model: {
        element: document.querySelector('#model'),
        default: 'Choose your Model',
        hasIndex: false,
        step: 1,
      },
      gen: {
        element: document.querySelector('#year'),
        default: 'Choose your Year',
        hasIndex: true,
        step: 2,
      },
      opt1: {
        element: document.querySelector('#option-one'),
        default: 'Choose an Option',
        hasIndex: true,
        step: 3,
      },
      opt2: {
        element: document.querySelector('#option-two'),
        default: 'Choose an Option',
        hasIndex: true,
        step: 4,
      },
    };

    // content elements
    this.contentElements = {
      productMessages: document.querySelector('#product-messages'),
      gallery: document.querySelector('#gallery-container'),
      galleryControls: document.querySelector('#gallery-controls'),
      dots: document.querySelector('#position-indicator'),
      sku: document.querySelector('#product-sku'),
      shippingTime: document.querySelector('#product-shipping'),
      stock: document.querySelector('#product-stock'),
      price: document.querySelector('#product-price'),
      brand: document.querySelector('#product-brand'),
      description: document.querySelector('#product-description'),
      instructions: document.querySelector('#instructions-content'),
      moreProducts: document.querySelector('#more-products'),
      moreProductsHeader: document.querySelector('#more-products-header'),
      blemForm: document.querySelector('#product-blem-form'),
    };
  }

  onReady() {
    // console.log("Ready");
    // console.log('last update: ', last_update);
    // fix to wake touch event handling in safari
    document.addEventListener('touchstart', function (e) {});

    // initialize the gallery
    this.initGallery();

    // initialize the product rating
    this.addRating();

    // initialize the select elements
    this.initSelections();

    // initialize event listeners
    this.bindEvents();
  }

  bindEvents() {
    // event listeners

    // create a change listener for each of the selection elements (except for add) that triggers a corresponding function (ie: makeChange)
    for (const key in this.selectionSteps) {
      if (this.selectionSteps[key] !== 'add') {
        const select = this.selectionSteps[key].element;

        select.addEventListener('change', (event) => {
          const selectedOption = event.target.value;
          const functionName = key + 'Change';
          this[functionName](selectedOption);
        });
      }
    }

    this.instructionsTab.addEventListener('click', this.instructionsTabHandler);
    this.rating.addEventListener('click', this.ratingHandler);
    this.blemAcceptButton.addEventListener('click', this.blemAcceptHandler);
    this.blemDeclineLink.addEventListener('click', this.blemDeclineHandler);
  }

  // handle messages
  sendMessage(message) {
    if (message === 'outOfStock') {
      this.contentElements.productMessages.innerHTML =
        'Out of stock.&nbsp;<span>Sign up for stock updates</span>.';
      this.contentElements.productMessages.setAttribute(
        'data-reveal-id',
        'stock-notification'
      );
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      this.contentElements.productMessages.classList.add('error');
      this.contentElements.productMessages.style.visibility = 'visible';
    }
  }

  // initialize the image gallery
  initGallery() {
    // console.log("Init Gallery");
    const images = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const next = document.querySelector('#next');
    const prev = document.querySelector('#prev');
    const bump = 15;

    let currentSlide = 0;
    let totalSlides = images.length;
    // console.log("total slides: ", totalSlides);
    let positions = [];

    dots[0].classList.add('active-dot');

    // Calculate positions for each image
    for (const image of images) {
      let distance = 100 * positions.length;
      positions.push(distance);
    }

    // Show specific image by index
    function showImg(slide) {
      // console.log("show image ", slide);
      const distance = positions[slide];
      gallery.style.transform = `translateX(-${distance}%)`;

      // Update active dot
      dots.forEach((dot) => {
        dot.classList.remove('active-dot');
      });
      dots[slide].classList.add('active-dot');
      currentSlide = slide;
    }

    // End Bump Logic
    function handleEndBump(direction) {
      gallery.style.transition = 'transform .1s ease';
      const sign = direction === 'next' ? '-' : '+';
      gallery.style.transform = `translateX(calc(-${positions[currentSlide]}% ${sign} ${bump}px))`;
      setTimeout(() => {
        gallery.style.transform = `translateX(-${positions[currentSlide]}%)`;
      }, 100);
      gallery.style.transition = 'transform .4s ease';
    }

    // Next and Previous image functions
    function nextImg() {
      totalSlides = images.length;
      console.log('next image slides count: ', totalSlides);
      if (currentSlide < totalSlides - 1) {
        currentSlide++;
        showImg(currentSlide);
      } else {
        handleEndBump('next');
      }
    }

    function prevImg() {
      // console.log("previous image");
      if (currentSlide > 0) {
        currentSlide--;
        showImg(currentSlide);
      } else {
        handleEndBump('prev');
      }
    }

    // Add touch event handling
    let touchStartX = 0;
    let touchEndX = 0;

    gallery.addEventListener(
      'touchstart',
      (e) => {
        e.preventDefault();
        touchStartX = e.touches[0].clientX;
      },
      { passive: false }
    );

    gallery.addEventListener(
      'touchmove',
      (e) => {
        e.preventDefault();
        touchEndX = e.touches[0].clientX;
      },
      { passive: false }
    );

    gallery.addEventListener(
      'touchend',
      (e) => {
        // Include the event object here
        console.log('touch end');
        e.preventDefault();
        const touchDiff = touchEndX - touchStartX;

        // Set a threshold to determine a valid swipe
        if (Math.abs(touchDiff) > 50) {
          // Swipe left
          if (touchDiff < 0) {
            nextImg();
          }
          // Swipe right
          else {
            prevImg();
          }
        }
      },
      { passive: false }
    );

    // gallery listeners
    // Event listeners for dot clicks
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        showImg(index);
      });
    });

    next.addEventListener('click', () => nextImg());
    prev.addEventListener('click', () => prevImg());

    this.galleryInitialized = true;
    showImg(0);
    // console.log("gallery initialized? ", this.galleryInitialized);
  }

  // display the rating value and review count
  addRating() {
    // console.log("Add Rating");
    const stars = document.querySelector('#star-rating').children;
    const ratingInfo = document.querySelector('#rating-info');
    const starValue = Math.ceil(archetype_average_review);

    let i = 0;
    while (i < starValue) {
      stars[i].classList.remove('icon--ratingEmpty');
      stars[i].classList.add('icon--ratingFull');
      i++;
    }

    ratingInfo.innerHTML =
      ' ' +
      archetype_average_review +
      ' out of ' +
      archetype_review_count +
      ' reviews';
  }

  // initialize the dropdowns, pre-select and set cookie when possible.
  initSelections() {
    // console.log("Init Selections");
    if (universal_product === true) {
      if (this.initVehicle()) {
        if (option_data['All Vehicles'][0].name === '') {
          this.endPointIndex = option_data['All Vehicles'][0].index;
          this.initCartAdd(this.endPointIndex, 'make');
        } else {
          this.createOptions(option_data['All Vehicles'], 'opt1', null, 320);
          this.highlightActiveStep(3);
        }
      } else {
        this.createOptions(option_data['All Vehicles'], 'opt1', null, 324);
        this.highlightActiveStep(3);
      }
    } else {
      // if the full vehicle cookie exists set up the first 3 dropdowns and load option 1
      if (this.initVehicle()) {
        this.createOptions(make_data, 'make', this.make);
        this.createOptions(model_data[this.make], 'model', this.model);
        this.createOptions(gen_data[this.model], 'gen', this.gen);
        this.loadOpt1();
      } else {
        // if nothing is selected create the make dropdown and highlight it
        if (this.checkFitment()) {
          if (!this.make) {
            this.createOptions(make_data, 'make', null);
            this.highlightActiveStep(0);
            // check if model is selected
          } else if (!this.model) {
            this.createOptions(make_data, 'make', this.make);
            // if there is only one model, pre-select it and check the generations
            if (model_data[this.make].length === 1) {
              this.model = model_data[this.make][0];
              setCookie('model', this.model);
              this.createOptions(model_data[this.make], 'model', this.model);
              // if there is only one generation, pre-select it and load option 1
              if (gen_data[this.model].length === 1) {
                this.gen = gen_data[this.model][0].index;
                setCookie('year', this.gen);
                this.createOptions(gen_data[this.model], 'gen', this.gen);
                this.loadOpt1();
                return;
              } else {
                // there are multiple generations so create the options but don't select one
                this.createOptions(gen_data[this.model], 'gen', null);
              }
              this.highlightActiveStep(2);
            } else {
              // there are multiple models so create the options but don't select one
              this.createOptions(model_data[this.make], 'model', null);
              this.highlightActiveStep(1);
            }
            // if make and model are selected check if gen can be pre-selected and load the generation dropdown
          } else {
            this.createOptions(make_data, 'make', this.make);
            this.createOptions(model_data[this.make], 'model', this.model);
            // if only one generation exists, select it and load option 1
            if (gen_data[this.model].length === 1) {
              this.gen = gen_data[this.model][0].index;
              setCookie('year', this.gen);
              this.createOptions(gen_data[this.model], 'gen', this.gen);
              this.loadOpt1();
            } else {
              // there are multiple generations so create the options but don't select one
              this.createOptions(gen_data[this.model], 'gen', null);
              this.highlightActiveStep(2);
            }
          }
        } else {
          this.createOptions(make_data, 'make', null);
        }
      }
    }
  }

  checkCookieVehicle() {
    // console.log("Check Cookie Vehicle");
    this.make = getCookie('make');
    this.model = getCookie('model');
    this.gen = getCookie('year');

    if (this.make || this.model || this.gen) {
      return true;
    } else {
      return false;
    }
  }

  checkParamsVehicle() {
    // console.log("Check Params Vehicle");
    const params = getUrlParams();

    if (params.url_override) {
      this.make = params.make;
      this.model = params.model;
      this.gen = params.year;
    }

    if (this.make || this.model || this.gen) {
      return true;
    } else {
      return false;
    }
  }

  // checkFitment() {
  //   // console.log("check fitment");
  //   // console.log('this.make: ', this.make);
  //   // console.log('this.model: ', this.model);
  //   // console.log('this.gen: ', this.gen);
  //   // console.log('universal: ', universal_product);
  //   if (universal_product) {
  //     return true;
  //   } else if (this.gen === "" || this.gen in option_data || !this.gen) {
  //     console.log('model_data:', this.model_data);
  //     console.log('this.model', this.model);
  //     if (
  //       this.model === "" ||
  //       model_data[this.make].includes(this.model) ||
  //       !this.model
  //     ) {
  //       if (this.make === "" || make_data.includes(this.make) || !this.make) {
  //         return true;
  //       } else {
  //         return false;
  //       }
  //     } else {
  //       return false;
  //     }
  //   } else {
  //     return false;
  //   }
  // }

  checkFitment() {
    if (universal_product) {
      return true;
    } else if (this.make === '' || make_data.includes(this.make)) {
      if (this.model === '') {
        return true;
      } else if (model_data[this.make].includes(this.model)) {
        if (this.gen === '' || gen_data[this.model] && gen_data[this.model].some(item => item.index === this.gen)) {
          return true;
        } else {
          return false;
        }
      }
    }
  }

  // load the make, model, and year from the cookie or the url parameters if url_override is true. return true if make model and gen are selected.
  initVehicle() {
    console.log('Init Vehicle');
    if (this.checkParamsVehicle()) {
    } else {
      if (this.checkCookieVehicle()) {
      } else {
        if (aliasVehicle) {
          this.aliasProduct = true;
          this.make = aliasVehicle.make;
          this.model = aliasVehicle.model;
          this.gen = aliasVehicle.gen;
          this.aliasSku = aliasVehicle.sku;
          this.getAliasOptions();
        } else {
        }
      }
    }

    if (this.checkFitment()) {
      if (this.make && this.model && this.gen) {
        this.getVehicleProducts();
        return true;
      } else {
        if (universal_product) {
          return true;
        } else {
          return false;
        }
      }
    } else {
      this.contentElements.productMessages.innerHTML =
        '<a href="/">This product does not fit your ' +
        this.make +
        ' ' +
        this.model +
        '. Find matching products here.</a>';
      this.contentElements.productMessages.classList.add('error');
    }
  }

  // provide an array, a target select, and a selected value to create a list of options to add to the select. 'target' is the key value from this.selectionSteps. Includes default. 'selected' can be null if no option is selected yet.
  createOptions(array, target, selected, line) {
    console.log('create options target: ', array, target, selected, line);
    let defaultOption = new Option(
      this.selectionSteps[target].default,
      this.selectionSteps[target].default
    );

    // for each item in the given array create an option for it and select it if matches the selected value
    const options = array.map((item) => {
      const option = new Option();
      // check if the array consists of single strings or is an object with properties
      if (this.selectionSteps[target].hasIndex) {
        option.value = item.index;
        option.text = item.name;
        if (selected) {
          if (item.index === selected) {
            option.selected = true;
          }
        }
      } else {
        option.value = item;
        option.text = item;
        if (selected) {
          if (item === selected) {
            option.selected = true;
          }
        }
      }
      return option;
    });
    // enable the target select element and add the options that have been created
    this.selectionSteps[target].element.style.visibility = 'visible';
    this.selectionSteps[target].element.disabled = false;
    this.selectionSteps[target].element.append(defaultOption, ...options);
  }

  // toggle the add to cart button. true = enabled.
  cartButton(isEnabled) {
    // check for the cart button
    if (this.addToCartButton) {
      // set the disabled property to the opposite of the boolean that was passed to the function
      this.addToCartButton.disabled = !isEnabled;
      if (isEnabled) {
        // if true was passed enable the button
        // console.log("cart button enabled");
        this.addToCartButton.classList.add('enabled');
        this.addToCartButton.style.pointerEvents = 'all';
      } else {
        // if false was passed disable the button
        // console.log("cart button disabled");
        this.addToCartButton.classList.remove('enabled');
        this.addToCartButton.href = '';
        this.addToCartButton.style.pointerEvents = 'none';
      }
    }
  }

  // highlights the next select that requires user input. provide the select step value from this.selectionSteps.
  highlightActiveStep(step) {
    // console.log("Highlight Active Step: ", step);
    // evaluate each step to determine and set it's active status
    for (const select in this.selectionSteps) {
      // if the select has the next-step class, remove the class
      if (this.selectionSteps[select].element.classList.contains('next-step')) {
        this.selectionSteps[select].element.classList.remove('next-step');
      }
      // if the select is the step passed to this function add the next-step class
      if (this.selectionSteps[select].step === step) {
        this.selectionSteps[select].element.classList.add('next-step');
      }
      // if the passed step is opt1 or opt1 make it visible
      if (
        step > 2 &&
        this.selectionSteps[select].step >= 3 &&
        this.selectionSteps[select].step <= step
      ) {
        this.selectionSteps[select].element.style.visibility = 'visible';
      }

      // if the passed step is opt1 make sure opt2 is hidden
      if (step <= 2 && this.selectionSteps[select].step >= 3) {
        this.selectionSteps[select].element.style.visibility = 'hidden';
      }
    }
  }

  // provide the endPointIndex that is to be added to the cart and check if it is valid to add (has inventory).
  initCartAdd(index, select) {
    // console.log("init card add");
    this.endPointIndex = index;
    if (index !== this.selectionSteps[select].default) {
      this.endPointData = key_dict[index];
      this.baseId = this.endPointData.base_id;
      this.aliasSku = this.endPointData.alias_sku;
      this.inventory = global_inv[this.baseId];
      this.name = this.endPointData.name;
      this.updateContent();
      this.checkBlem();
      if (this.inventory.av > 0 || this.madeToOrder) {
        this.addUrl =
          '/cart.php?action=add&sku=' +
          encodeURIComponent(this.aliasSku) +
          '&source=' +
          encodeURIComponent(this.name);
        this.addToCartButton.href = this.addUrl;
        for (const select in this.selectionSteps) {
          this.selectionSteps[select].element.classList.remove('next-step');
        }
        this.cartButton(true);
      }
    } else {
      this.highlightActiveStep(this.selectionSteps[select].step);
      this.cartButton(false);
    }
  }

  // loads option one when appropriate
  loadOpt1() {
    // console.log("Load Option One: ", this.gen);
    let opt1Data = option_data[this.gen];
    if (!this.aliasProduct) {
      // not an alias product
      if (opt1Data) {
        if (opt1Data.length === 1 && opt1Data[0].name.trim() === '') {
          this.endPointIndex = opt1Data[0].index;
          this.initCartAdd(this.endPointIndex, 'opt1');
          this.highlightActiveStep(null);
        } else if (opt1Data.length === 1) {
          this.opt1Index = opt1Data[0].index;
          this.createOptions(opt1Data, 'opt1', this.opt1Index, 616);
          if (!this.loadOpt2()) {
            this.endPointIndex = this.opt1Index;
            this.initCartAdd(this.endPointIndex, 'opt1');
            this.clearOptions('opt1');
            this.selectionSteps.opt1.element.style.visibility = 'visible';
          }
        } else {
          this.createOptions(option_data[this.gen], 'opt1', null, 624);
          this.highlightActiveStep(3);
        }
      } else {
        this.endPointIndex = this.gen;
        this.initCartAdd(this.endPointIndex, 'gen');
      }
    } else {
      // alias product
      let opt1Data = option_data[this.gen];

      if (opt1Data.length === 1 && opt1Data[0].name.trim() === '') {
        // opt1 is an empty default option
        this.endPointIndex = opt1Data[0].index;
        this.initCartAdd(this.endPointIndex, 'gen');
      } else if (opt1Data.length === 1) {
        // opt1 is valid but there is only one
        this.opt1Index = opt1Data[0].index;
        this.createOptions(opt1Data, 'opt1', this.opt1Index, 642);
        if (!this.loadOpt2()) {
          this.endPointIndex = this.opt1Index;
          this.initCartAdd(this.endPointIndex, 'opt1');
          this.clearOptions('opt1');
          this.selectionSteps.opt1.element.style.visibility = 'visible';
        }
      } else {
        // there are multiple options for opt1
        this.createOptions(opt1Data, 'opt1', this.opt1Index, 651);
        this.selectionSteps['opt1'].element.style.visibility = 'visible';
        if (!this.loadOpt2()) {
          if (this.opt1Index) {
            this.endPointIndex = this.opt1Index;
            this.initCartAdd(this.endPointIndex, 'opt1');
          } else {
            this.highlightActiveStep(3);
          }
        }
      }
    }
  }

  loadOpt2() {
    this.clearOptions('opt1');
    let opt2Data = sub_option_data[this.opt1Index];
    if (opt2Data) {
      if (!this.aliasProduct) {
        if (opt2Data.length === 1) {
          this.opt2Index = opt2Data[0].index;
          this.createOptions(opt2Data, 'opt2', this.opt2index);
          this.endPointIndex = this.opt2Index;
          this.initCartAdd(this.endPointIndex, 'opt2');
        } else {
          this.createOptions(opt2Data, 'opt2', null);
          this.highlightActiveStep(4);
        }
      } else {
        if (this.endPointIndex) {
          this.createOptions(opt2Data, 'opt2', this.endPointIndex);
          this.selectionSteps['opt2'].element.style.visibility = 'visible';
          this.initCartAdd(this.endPointIndex, 'opt2');
        } else {
          this.createOptions(opt2Data, 'opt2', null);
          this.highlightActiveStep(4);
          this.selectionSteps['opt2'].element.style.visibility = 'visible';
        }
      }
      return true;
    } else {
      return false;
    }
  }

  makeChange(selected) {
    // console.log("Make Change, selected: ", selected);
    this.clearMessages();
    this.clearBlem();
    this.cartButton(false);
    this.selectChange = true;
    aliasVehicle = null;
    if (this.selectionSteps.make.default !== selected) {
      this.make = selected;
      setCookie('make', this.make);
      setCookie('model', '');
      setCookie('year', '');
      this.clearOptions('make');
      if (model_data[this.make].length === 1) {
        this.model = model_data[this.make][0];
        setCookie('model', this.model);
        setCookie('year', '');
        this.createOptions(
          model_data[this.make],
          'model',
          model_data[this.make][0]
        );
        if (gen_data[this.model].length === 1) {
          this.gen = gen_data[this.model][0].index;
          setCookie('year', this.gen);
          this.getVehicleProducts();
          this.createOptions(
            gen_data[this.model],
            'gen',
            gen_data[this.model][0].index
          );
          this.loadOpt1();
        } else {
          this.createOptions(gen_data[this.model], 'gen', null);
          this.highlightActiveStep(2);
        }
      } else {
        this.createOptions(model_data[this.make], 'model', null);
        this.highlightActiveStep(1);
      }
    } else {
      this.clearOptions('make');
      this.highlightActiveStep(0);
    }
  }

  modelChange(selected) {
    // console.log("Model Change, selected: ", selected);
    this.clearMessages();
    this.clearBlem();
    this.cartButton(false);
    this.selectChange = true;
    aliasVehicle = null;
    this.clearOptions('model');
    if (selected !== this.selectionSteps['model'].default) {
      this.model = selected;
      setCookie('model', selected);
      setCookie('year', '');
      if (gen_data[this.model].length === 1) {
        this.gen = gen_data[this.model][0].index;
        setCookie('year', this.gen);
        this.getVehicleProducts();
        this.createOptions(
          gen_data[this.model],
          'gen',
          gen_data[this.model][0].index
        );
        this.opt1Index = '';
        this.loadOpt1();
      } else {
        this.createOptions(gen_data[this.model], 'gen', null);
        this.highlightActiveStep(2);
      }
    } else {
      this.highlightActiveStep(1);
    }
  }

  genChange(selected) {
    // console.log("Gen Change, selected: ", selected);
    this.clearMessages();
    this.clearBlem();
    this.cartButton(false);
    this.selectChange = true;
    aliasVehicle = null;
    this.clearOptions('gen');
    if (selected !== this.selectionSteps['gen'].default) {
      this.gen = selected;
      setCookie('year', this.gen);
      this.opt1Index = '';
      this.loadOpt1();
      this.getVehicleProducts();
    } else {
      this.highlightActiveStep(2);
    }
  }

  opt1Change(selected) {
    // console.log("Option One Change, selected: ", selected);
    this.clearMessages();
    this.clearBlem();
    this.cartButton(false);
    this.selectChange = true;
    aliasVehicle = null;
    this.clearOptions('opt1');
    if (selected !== this.selectionSteps['opt1'].default) {
      this.opt1Index = selected;
      this.endPointIndex = '';
      if (!this.loadOpt2()) {
        this.selectionSteps['opt2'].element.style.visibility = 'hidden';
        this.endPointIndex = this.opt1Index;
        this.initCartAdd(this.endPointIndex, 'opt1');
      }
    } else {
      this.highlightActiveStep(3);
    }
  }

  opt2Change(selected) {
    // console.log("Option Two Change, selected: ", selected);
    this.clearMessages();
    this.clearBlem();
    this.cartButton(false);
    this.selectChange = true;
    aliasVehicle = null;
    if (selected !== this.selectionSteps.opt2.default) {
      this.endPointIndex = selected;
      this.clearOptions('opt2');
      this.initCartAdd(this.endPointIndex, 'opt2');
    } else {
      this.clearOptions('opt2');
      this.highlightActiveStep(4);
    }
  }

  clearOptions(source) {
    // console.log("Clear Options From: ", source);
    let position = this.selectionSteps[source].step;
    for (const select in this.selectionSteps) {
      if (this.selectionSteps[select].step > position) {
        this.selectionSteps[select].element.innerHTML = '';
        this.selectionSteps[select].element.disabled = true;
        if (
          this.selectionSteps[select].element.classList.contains('next-step')
        ) {
          this.selectionSteps[select].element.classList.remove('next-step');
        }
      }
    }
    if (position < 3) {
      this.selectionSteps['opt1'].element.style.visibility = 'hidden';
      this.selectionSteps['opt2'].element.style.visibility = 'hidden';
    }
  }

  getAliasOptions() {
    // console.log("get alias options");
    for (const item in key_dict) {
      if (key_dict[item].alias_sku === aliasVehicle.sku) {
        this.endPointIndex = item;
        let optionData = option_data[this.gen];
        for (const option of optionData) {
          if (option.index !== this.endPointIndex) {
            for (const subOptionSet in sub_option_data) {
              for (const subOption of sub_option_data[subOptionSet]) {
                if (subOption.index === this.endPointIndex) {
                  this.opt1Index = subOptionSet;
                  return;
                }
              }
            }
          } else {
            this.opt1Index = this.endPointIndex;
          }
        }
      }
    }
  }

  // clear all of the content elements in this.contentElements
  clearContent() {
    // console.log("clear content");
    for (const element in this.contentElements) {
      if (element !== 'moreProducts' && element !== 'moreProductsHeader')
        this.contentElements[element].innerHTML = '';
    }
    this.clearMessages();
  }

  // load the images for the endpoint product
  updateGallery() {
    // console.log("update gallery");
    // get the images for the selected product
    let imageData = this.endPointData.image_array;

    // pull the main image off of the imageData so it can be added to the end of the final array
    let mainImage = {
      url: imageData.url,
      description: imageData.description,
      url_tiny: imageData.url_tiny,
      url_standard: imageData.url_standard,
      sort_order: imageData.image_count,
    };

    // reset the image array
    this.imageArray.length = 0;

    // push the secondary images and the main image to the new image array
    this.imageArray.push(...imageData.secondary_images_list, mainImage);

    const gallery = document.createElement('div');
    gallery.id = 'gallery';

    // establish an array to contain the slide elements
    let slides = [];

    // Create new buttons and a new position indicator element
    let prevButton = document.createElement('button');
    Object.assign(prevButton, { id: 'prev', textContent: 'Previous' });
    let positionIndicator = document.createElement('div');
    positionIndicator.id = 'position-indicator';
    let nextButton = document.createElement('button');
    Object.assign(nextButton, { id: 'next', textContent: 'Next' });
    let dots = [];
    let dot = this.createDot();

    // index track which image the loop is on
    let i = 0;

    // create a slide and a dot for each image and add them to their arrays
    for (const image of this.imageArray) {
      let slide = document.createElement('div');
      slide.classList.add('slide');
      let img = document.createElement('img');
      img.src = image.url;
      img.alt = image.description;
      slide.appendChild(img);
      slides.push(slide);
      // create a new dot by cloning dot
      const newDot = dot.cloneNode(true);
      // set the first dot to active
      if (i === 0) {
        newDot.classList.add('active-dot');
        i++;
      }
      dots.push(newDot);
    }

    // apend the slides and controls to their parent elements
    gallery.append(...slides);
    this.contentElements.gallery.append(gallery);
    this.contentElements.galleryControls.append(
      prevButton,
      positionIndicator,
      nextButton
    );

    // since postion-indicator was removed, re-assign it to the appropriate selectElement
    this.contentElements.dots = document.querySelector('#position-indicator');

    // append the dots to the position indicator
    this.contentElements.dots.append(...dots);

    // re-initialize the gallery
    this.initGallery();
  }

  showInstructions() {
    this.contentElements.instructions.style.display = 'block';
  }

  // when an endpoint is selected by the user, reload the page content to match the endpoint product
  updateContent() {
    // console.log("update content");
    this.clearContent();
    this.updateGallery();
    this.baseSku = this.endPointData.base_sku;
    this.contentElements.sku.innerHTML = this.baseSku;
    let shipDay = this.getShipDay();
    this.contentElements.shippingTime.innerHTML = 'Ships free, ' + shipDay;
    if (this.inventory.av <= 0 && this.inventory.a2b > 0) {
      this.madeToOrder = true;
    }
    if (this.inventory.av > 10) {
      this.contentElements.stock.innerHTML = 'Plenty in stock';
    } else if (this.inventory.av > 0) {
      this.contentElements.stock.innerHTML =
        'Only ' + this.inventory.av + ' left. Order soon!';
    } else if (this.madeToOrder) {
      this.contentElements.stock.innerHTML = 'In Stock';
    } else {
      this.contentElements.stock.innerHTML = 'Out of Stock';
      this.sendMessage('outOfStock');
    }
    let priceFormatted = this.endPointData.price.toLocaleString('en-us', {
      style: 'currency',
      currency: 'USD',
    });
    this.contentElements.price.innerHTML = priceFormatted;

    if (this.endPointData.sale_price !== 0) {
      let salePriceFormatted = this.endPointData.sale_price.toLocaleString(
        'en-us',
        {
          style: 'currency',
          currency: 'USD',
        }
      );
      console.log('sale price valid: ', this.endPointData.sale_price);
      this.contentElements.price.innerHTML =
        '<span class="original-price">' +
        priceFormatted +
        '</span><span>' +
        salePriceFormatted +
        '</span>';
      this.contentElements.price.classList.add('sale-price');
    }
    this.contentElements.brand.innerHTML = this.endPointData.brand_name;
    this.contentElements.description.innerHTML = this.endPointData.description;
    const instructionsTabParent = this.instructionsTab.parentNode;
    if (instructionsTabParent.classList.contains('is-active')) {
      this.updateInstructions();
    }
  }

  createDot() {
    // Create an SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    // Set the width and height of the SVG and add the dot class
    svg.setAttribute('width', '18');
    svg.setAttribute('height', '18');
    svg.classList.add('dot');

    // Create a circle element
    const circle = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'circle'
    );

    // Set the attributes for the circle (centered in the SVG)
    circle.setAttribute('cx', '9');
    circle.setAttribute('cy', '9');
    circle.setAttribute('r', '9'); // Radius of the circle

    // Append the circle to the SVG
    svg.appendChild(circle);

    // return the svg
    return svg;
  }

  getShipDay() {
    let nowMilliseconds = Date.now();
    // console.log("now Milliseconds: ", nowMilliseconds);
    let timezoneOffset = new Date().getTimezoneOffset();
    // console.log("timezoneOffset: ", timezoneOffset);
    let offsetMilliseconds = (timezoneOffset / 60) * 3600 * 1000;
    let utcDate = new Date(nowMilliseconds + offsetMilliseconds);
    // console.log("utcDate: ", utcDate);
    let hour = utcDate.getHours();
    let minutes = utcDate.getMinutes();
    let month = utcDate.getMonth();
    let day = utcDate.getDay();
    let year = utcDate.getFullYear();
    let priceValidUntil = year + '-' + day + '-' + (month + 1);
    let shipDay = day;
    let whenShips = 'today';
    // console.log("hour: ", hour);
    // console.log("this.madeToOrder: ", this.madeToOrder);
    // console.log("shipDay: ", shipDay);

    // Daylight Savings Time >= 21, Standard Time >= 22
    if (hour >= 21 || hour < 9) {
      whenShips = 'tomorrow';
    }

    if (this.madeToOrder && whenShips === 'today') {
      whenShips = 'tomorrow';
    }

    if (whenShips === 'tomorrow' && shipDay >= 5) {
      whenShips = 'Monday';
    }

    return whenShips;
  }

  getVehicleProducts() {
    // console.log("vehicle products gen value: ", this.gen);
    this.vehicleProducts.length = 0;
    this.contentElements.moreProductsHeader.innerHTML = '';
    this.contentElements.moreProducts.innerHTML = '';
    let searchYear = this.gen.replace(this.model, '');
    searchYear = searchYear.replace(this.make, '');
    for (const item of search_string) {
      let keywords = item.keywords;
      if (
        keywords.includes(this.make) &&
        keywords.includes(this.model) &&
        keywords.includes(searchYear)
      ) {
        const product = {
          url: item.url,
          title: item.title,
          imageUrl: item.search_image_url,
          archId: item.arch_id,
          archPrice: item.arch_price,
        };
        this.vehicleProducts.push(product);
      }
    }

    const productCards = [];
    for (const product of this.vehicleProducts) {
      const card = document.createElement('div');
      const link = document.createElement('a');
      const img = document.createElement('img');
      const title = document.createElement('h3');
      const price = document.createElement('div');

      card.classList.add('product-card');
      link.classList.add('card-link');
      img.classList.add('product-card-image');
      title.classList.add('product-card-title');
      price.classList.add('product-card-price');

      link.href = product.url;
      img.src = product.imageUrl;
      img.alt = product.title;
      title.textContent = product.title;
      price.textContent = product.archPrice.toLocaleString('en-us', {
        style: 'currency',
        currency: 'USD',
      });

      card.append(link, img, title, price);
      productCards.push(card);
    }
    this.contentElements.moreProductsHeader.innerHTML =
      productCards.length +
      ' matching products for ' +
      this.make +
      ' ' +
      this.model;
    // console.log("gen_data:", gen_data);
    this.contentElements.moreProducts.append(...productCards);
    // console.log("product cards: ", productCards);
  }

  clearMessages() {
    this.contentElements.productMessages.innerHTML = '';
    this.contentElements.productMessages.classList = [];
    this.contentElements.productMessages.style.visibility = 'hidden';
  }

  updateInstructions() {
    // console.log('update instructions');
    const iframe = this.contentElements.instructions.querySelector('iframe');
    let currentSrc = '';
    let currentUrl = '';
    if (iframe) {
      // console.log('iframe.src: ', iframe.src);
      currentSrc = iframe.src;
      currentUrl = new URL(currentSrc).pathname + '?asDoc=true';
    }
    if (this.endPointData) {
      const urlString = this.endPointData.instructions_url;
      const urlBase = 'https://cravenspeed.com';
      const url = new URL(urlString, urlBase);
      url.searchParams.append('asDoc', 'true');
      const domain = url.hostname;
      if (domain === 'cravenspeed.com' || domain === 'www.cravenspeed.com') {
        const instructions = document.createElement('iframe');
        const newUrl = url.pathname + '?asDoc=true';
        // console.log('currentUrl: ', currentUrl);
        if (newUrl !== currentUrl) {
          this.showLoadingIcon();
          instructions.src = newUrl;
          instructions.onload = () => this.hideLoadingIcon();
          this.contentElements.instructions.appendChild(instructions);
        }
      } else {
        const instructionsLink = document.createElement('a');
        instructionsLink.src = url;
        this.contentElements.instructions.appendChild(instructionsLink);
      }
    } else {
      if (!this.loadedDefaultIntructions) {
        const url = new URL(default_instructions_url);
        const domain = url.hostname;
        if (domain === 'cravenspeed.com' || domain === 'www.cravenspeed.com') {
          this.showLoadingIcon();
          const instructions = document.createElement('iframe');
          instructions.src = url.pathname + '?asDoc=true';
          instructions.onload = () => this.hideLoadingIcon();
          this.contentElements.instructions.appendChild(instructions);
        } else {
          const instructionsLink = document.createElement('a');
          instructionsLink.src = url;
          this.contentElements.instructions.appendChild(instructionsLink);
        }
        this.loadedDefaultIntructions = true;
      }
    }
    this.contentElements.instructions.style.display = 'block';
  }

  showLoadingIcon() {
    const loadingIcon = document.querySelector('#doc-loading');
    loadingIcon.style.display = 'block';
  }

  hideLoadingIcon() {
    const loadingIcon = document.querySelector('#doc-loading');
    loadingIcon.style.display = 'none';
  }

  instructionsTabHandler() {
    this.updateInstructions();
  }

  ratingHandler() {
    // console.log("rating click");
    // Remove the class "is-active" from tabTitles
    const tabTitles = document.querySelectorAll('.tab');
    tabTitles.forEach((tabTitle) => {
      tabTitle.classList.remove('is-active');
    });

    // Remove the class "is-active" from tabs
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach((tab) => {
      tab.classList.remove('is-active');
    });

    const reviewsTitle = document.querySelector(
      '.tab a[href="#tab-reviews"]'
    ).parentNode;
    reviewsTitle.classList.add('is-active');

    const reviewsTab = document.querySelector('#tab-reviews');
    reviewsTab.classList.add('is-active');

    reviewsTitle.focus();
    reviewsTitle.scrollIntoView({
      behavior: 'smooth',
    });
  }

  clearBlem() {
    this.contentElements.blemForm.innerHTML = '';
  }

  checkBlem() {
    // console.log("check blem");
    this.blemData = blem_dict[this.endPointData.base_sku];
    if (this.blemData) {
      let blemInventory = global_inv[this.blemData.index];
      if (blemInventory) {
        if (blemInventory.av > 0 || blemInventory.a2b > 0) {
          let blemPrice = this.blemData.price;
          let savings = this.endPointData.price - blemPrice;
          let savingsFormatted = savings.toLocaleString('us-en', {
            style: 'currency',
            currency: 'USD',
          });
          let blemCheckbox = document.createElement('input');
          let blemLabel = document.createElement('label');
          blemCheckbox.type = 'checkbox';
          blemCheckbox.id = 'blem-opt-in';
          blemCheckbox.name = 'blem-opt-in';
          blemCheckbox.setAttribute('data-reveal-id', 'scratch-and-dent');
          blemLabel.setAttribute('for', 'blem-opt-in');
          let blemMessage = 'Interested in saving ' + savingsFormatted + '?';
          blemLabel.innerHTML = blemMessage;
          this.contentElements.blemForm.append(blemCheckbox, blemLabel);
          this.contentElements.blemForm.style.visibility = 'visible';
          this.blemAddUrl = `/cart.php?action=add&product_id=${encodeURIComponent(
            this.blemData.blem_id
          )}&source=${encodeURIComponent(this.name)}`;
        }
      }
    }
  }

  generateStockMessage(index) {
    const inventory = global_inv[index];
    if (inventory.av === 0 && inventory.a2b > 0) {
      return 'In stock';
    } else if (inventory.av > 10) {
      return 'Plenty in stock';
    } else if (inventory.av > 0) {
      return `Only ${inventory.av} left. Order soon!`;
    } else {
      return 'Out of stock';
    }
  }

  toggleBlem() {
    // console.log('toggle blem');
    let blemCheckbox = document.querySelector('#blem-opt-in');
    if (blemCheckbox.checked === true) {
      this.contentElements.sku.textContent =
        this.endPointData.base_sku + '-BLEM';
      this.contentElements.stock.innerHTML = this.generateStockMessage(
        this.blemData.index
      );
      this.contentElements.shippingTime.innerHTML = `Ships free, ${this.getShipDay()}`;
      let blemPriceFormatted = this.blemData.price.toLocaleString('us-en', {
        style: 'currency',
        currency: 'USD',
      });
      let newPrice = this.contentElements.price.textContent;
      this.contentElements.price.innerHTML = `<span class="original-price">${newPrice}</span><span>${blemPriceFormatted}</span>`;
      this.contentElements.price.classList.add('sale-price');
      this.addToCartButton.href = this.blemAddUrl;
    } else {
      this.contentElements.sku.textContent = this.endPointData.base_sku;
      this.contentElements.stock.textContent = this.generateStockMessage(
        this.endPointData.base_id
      );
      this.contentElements.shippingTime.innerHTML = `Ships free, ${this.getShipDay()}`;
      this.contentElements.price.innerHTML =
        this.endPointData.price.toLocaleString('en-us', {
          style: 'currency',
          currency: 'USD',
        });
      this.contentElements.price.classList.remove('sale-price');
      this.addToCartButton.href = this.addUrl;
    }
  }

  blemAcceptHandler() {
    // console.log('blem accept');
    let blemCheckbox = document.querySelector('#blem-opt-in');
    this.blemAcknowledged = true;
    blemCheckbox.removeAttribute('data-reveal-id');
    blemCheckbox.addEventListener('click', this.toggleBlem);
    blemCheckbox.checked = true;
    this.toggleBlem();
  }

  blemDeclineHandler() {
    // console.log('blem decline');
    let blemCheckbox = document.querySelector('#blem-opt-in');
    this.blemAcknowledged = false;
    blemCheckbox.setAttribute('data-reveal-id', 'scratch-and-dent');
    blemCheckbox.checked = false;
  }
}

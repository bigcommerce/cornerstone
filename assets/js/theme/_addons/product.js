import PageManager from "../page-manager";
import { onLCP, onFID, onCLS } from "web-vitals";

onCLS(console.log);
onFID(console.log);
onLCP(console.log);

export default class Product extends PageManager {
  constructor(context) {
    super(context);
    this.gallery = document.querySelector("#gallery");
    this.vehicle = this.getStoredVehicle();
    this.opt1;
    this.opt2;
    this.productSelector = document.querySelector("#product-selection");
    this.productSelects = Array.from(this.productSelector.children);
    this.makeSelect = document.querySelector("#make");
    this.modelSelect = document.querySelector("#model");
    this.yearSelect = document.querySelector("#year");
    this.optionOneSelect = document.querySelector("#option-one");
    this.optionTwoSelect = document.querySelector("#option-two");
    this.addToCartButton = document.querySelector("#product-add-button");
    this.optionEndPoint;
    this.modelData = model_data[this.vehicle.make];
    this.genData = gen_data[this.vehicle.model];
    this.optionData = [];
    this.supOptionData = [];
    this.baseId;
    this.name;
    this.inventory = [];

    this.optionMap = {
      make: {
        default: "Choose a Make",
        hasIndex: false,
        select: this.makeSelect,
        source: make_data,
        value: this.vehicle.make,
      },
      model: {
        default: "Choose a Model",
        hasIndex: false,
        select: this.modelSelect,
        source: this.modelData,
        value: this.vehicle.model,
      },
      year: {
        default: "Choose a Year",
        hasIndex: true,
        select: this.yearSelect,
        source: this.genData,
        value: this.vehicle.gen,
      },
      opt1: {
        default: "Choose an Option",
        hasIndex: true,
        select: this.optionOneSelect,
        source: this.optionData,
        value: this.optionOne,
      },
      opt2: {
        default: "Choose an Option",
        hasIndex: true,
        select: this.optionTwoSelect,
        source: this.subOptionData,
        value: this.optionTwo,
      },
    };
    console.log('optionMap: ', this.optionMap);
    console.log('optionMap[make].value: ', this.optionMap['make'].value);
  }

  onReady() {
    this.initGallery();
    this.addRating();
    this.initDropdowns();
  }

  // toggle the add to cart button
  cartButton(isEnabled) {
    if (this.addToCartButton) {
      this.addToCartButton.disabled = !isEnabled;

      if (isEnabled) {
        this.addToCartButton.classList.add("enabled");
      } else {
        this.addToCartButton.classList.remove("enabled");
      }
    }
  }

  // initialize the image gallery
  initGallery() {
    const images = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll(".dot");
    const next = document.querySelector("#next");
    const prev = document.querySelector("#prev");
    const bump = 15;

    let currentSlide = 0;
    let totalSlides = images.length;
    let positions = [];
    let touchstartX = 0;
    let touchendX = 0;

    dots[0].classList.add("active-dot");

    // Calculate positions for each image
    for (const image of images) {
      let distance = 100 * positions.length;
      positions.push(distance);
    }

    // Event listeners for dot clicks
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        showImg(index);
      });
    });

    // Show specific image by index
    function showImg(slide) {
      const distance = positions[slide];
      gallery.style.transform = `translateX(-${distance}%)`;

      // Update active dot
      dots.forEach((dot) => {
        dot.classList.remove("active-dot");
      });
      dots[slide].classList.add("active-dot");
      currentSlide = slide;
    }

    // Transition logic
    function handleTransition(direction) {
      gallery.style.transition = "transform .1s ease";
      const sign = direction === "next" ? "-" : "+";
      gallery.style.transform = `translateX(calc(-${positions[currentSlide]}% ${sign} ${bump}px))`;
      setTimeout(() => {
        gallery.style.transform = `translateX(-${positions[currentSlide]}%)`;
      }, 100);
      gallery.style.transition = "transform .4s ease";
    }

    // Next and Previous image functions
    function nextImg() {
      if (currentSlide < totalSlides - 1) {
        currentSlide++;
        showImg(currentSlide);
      } else {
        handleTransition("next");
      }
    }

    function prevImg() {
      if (currentSlide > 0) {
        currentSlide--;
        showImg(currentSlide);
      } else {
        handleTransition("prev");
      }
    }

    // Gesture handling for touch events
    function handleGesture() {
      if (touchendX < touchstartX) {
        nextImg();
      }
      if (touchendX > touchstartX) {
        prevImg();
      }
    }

    // Event listeners
    next.addEventListener("click", nextImg);
    prev.addEventListener("click", prevImg);

    gallery.addEventListener("touchstart", (e) => {
      touchstartX = e.changedTouches[0].screenX;
    });

    gallery.addEventListener("touchend", (e) => {
      touchendX = e.changedTouches[0].screenX;
      handleGesture();
    });
  }

  // get the currently selected vehicle from the cookies or the url params
  getStoredVehicle() {
    const params = getUrlParams();
    let make = getCookie("make");
    let model = getCookie("model");
    let gen = getCookie("year");

    if (params.url_override) {
      make = params.make;
      model = params.model;
      gen = params.year;
    }

    let vehicle = {
      make: make,
      model: model,
      gen: gen,
    };

    return vehicle;
  }

  // display the rating value and review count
  addRating() {
    const rating = document.querySelector("#star-rating");
    const stars = rating.children;
    const starValue = Math.ceil(archetype_average_review);
    const reviewCount = document.querySelector("#review-count");

    let i = 0;
    while (i < starValue) {
      stars[i].classList.remove("icon--ratingEmpty");
      stars[i].classList.add("icon--ratingFull");
      i++;
    }

    reviewCount.innerHTML = " " + archetype_review_count + " reviews";
  }

  // initialize the vehicle and option dropdowns
  initDropdowns() {
    const optionsToCreate = ["make", "model", "year"];
  
    for (const target of optionsToCreate) {
      this.createOptions(target);
  
      // Check the condition in createOptions and break out if needed
      if (!this.optionMap[target].value) {
        this.toggleNextStep(this.optionMap[target].select);
        break;
      }
    }
  
    this.loadOptions(this.vehicle.gen);
  }
  
  toggleNextStep(element) {
    for (const item of this.productSelects) {
      if (item.classList.contains("next-step") && item !== element) {
        item.classList.remove("next-step");
      } else if (item === element && !item.classList.contains("next-step")) {
        item.classList.add("next-step");
      }
    }
  }

  loadOptions(index) {
    this.optionData = option_data[index];
    if (this.optionData.length === 1) {
      if (this.optionData[0].name == "") {
        this.optionEndPoint = this.optionData[0].index;
        this.initAddToCart();
      } else {
      }
    }
  }

  initAddToCart() {
    console.log("init add to cart with: ", this.optionEndPoint);
    this.baseId = key_dict[this.optionEndPoint].base_id;
    this.aliasSku = key_dict[this.optionEndPoint].alias_sku;
    this.name = key_dict[this.optionEndPoint].name;
    let addUrl =
      "/cart.php?action=add&sku=" + this.aliasSku + "&source=" + this.name;
    this.addToCartButton.href = addUrl;
    this.cartButton(true);
  }

  createOptions(target) {
    const defaultOption = new Option(
      this.optionMap[target].default,
      this.optionMap[target].default
    );
    const options = this.optionMap[target].source.map((item) => {
      const option = new Option();
      if (this.optionMap[target].hasIndex) {
        option.value = item.index;
        option.text = item.name;
      } else {
        option.value = item;
        option.text = item;
      }
      if (this.optionMap[target].hasIndex) {
        if (item.index === this.optionMap[target].value) {
          option.selected = true;
        }
      } else {
        if (item === this.optionMap[target].value) {
          option.selected = true;
        }
      }
      return option;
    });

    this.optionMap[target].select.append(defaultOption, ...options);
  }
}

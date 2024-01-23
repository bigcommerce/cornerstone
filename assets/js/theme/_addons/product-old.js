import PageManager from "../page-manager";
import { onLCP, onFID, onCLS } from "web-vitals";

onCLS(console.log);
onFID(console.log);
onLCP(console.log);

export default class CsProduct extends PageManager {
  constructor(context) {
    super(context);
    this.url = window.location.href;
  }
  
  onReady() {
    const gallery = document.querySelector("#gallery");
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

    addRating();

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

    function addRating() {
      const rating = document.querySelector("#star-rating");
      const stars = rating.children;
      const starValue = Math.ceil(archetype_average_review);
      const reviewCount = document.querySelector('#review-count');
    
      let i = 0;
      while (i < starValue) {
        stars[i].classList.remove("icon--ratingEmpty");
        stars[i].classList.add("icon--ratingFull");
        i++;
      }
    
      reviewCount.innerHTML = ' ' + archetype_review_count + ' reviews';
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
}

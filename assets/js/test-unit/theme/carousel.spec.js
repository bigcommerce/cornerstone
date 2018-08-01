import carousel from '../../theme/common/carousel';
import $ from 'jquery'
import 'slick-carousel';

describe('carousel', () => {
    it('should generate carousel WITH dots if carousel has more than one slide', () => {	
		var multipleSlidesElement = $("<section class='heroCarousel' data-slick='{}'>\
			<a href=''>\
		        <div class='heroCarousel-slide  heroCarousel-slide--first'>\
		            <div class='heroCarousel-image-wrapper' style='height: 42.868654311039485vw'>\
		                <img class='heroCarousel-image' data-lazy='https://img.jpg?t=1532986020' alt='Our signature fixture that bends to your will' title='Our signature fixture that bends to your will' width='1241' height='532'>\
		            </div>\
		            <div class='heroCarousel-content'>\
		    			<h1 class='heroCarousel-title'>The Task Lamp</h1>\
		    			<p class='heroCarousel-description'>Our signature fixture that bends to your will</p>\
		        		<span class='heroCarousel-action button button--primary button--large'>Shop Now</span>\
					</div>\
		        </div>\
		    </a>\
		    <a href=''>\
		        <div class='heroCarousel-slide'>\
		            <div class='heroCarousel-image-wrapper' style='height: 99.75124378109453vw'>\
		                <img class='heroCarousel-image' data-lazy='https://img.png?t=1532986020'>\
		            </div>\
		        </div>\
		    </a>\
		</section>")

	    spyOn(jQuery.fn, 'find').and.returnValue(multipleSlidesElement);
	    var slickSpy = spyOn(multipleSlidesElement, 'slick');
	    carousel();
	    expect(slickSpy).toHaveBeenCalledWith({ dots: true });   
    });

    it('should generate carousel WITHOUT dots if carousel has one slide', () => {	
		var multipleSlidesElement = $("<section class='heroCarousel' data-slick='{}'>\
			<a href=''>\
		        <div class='heroCarousel-slide  heroCarousel-slide--first'>\
		            <div class='heroCarousel-image-wrapper' style='height: 42.868654311039485vw'>\
		                <img class='heroCarousel-image' data-lazy='https://img.jpg?t=1532986020' alt='Our signature fixture that bends to your will' title='Our signature fixture that bends to your will' width='1241' height='532'>\
		            </div>\
		            <div class='heroCarousel-content'>\
		    			<h1 class='heroCarousel-title'>The Task Lamp</h1>\
		    			<p class='heroCarousel-description'>Our signature fixture that bends to your will</p>\
		        		<span class='heroCarousel-action button button--primary button--large'>Shop Now</span>\
					</div>\
		        </div>\
		    </a>\
		</section>")

	    spyOn(jQuery.fn, 'find').and.returnValue(multipleSlidesElement);
	    var slickSpy = spyOn(multipleSlidesElement, 'slick');
	    carousel();
	    expect(slickSpy).toHaveBeenCalledWith({ dots: false });   
    });
});


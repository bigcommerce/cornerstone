/*
var JQZOOM_OPTIONS = {
	zoomType: 'innerzoom',
	preloadImages: false,
	title: false,
	position: ""
};
*/
$(document).ready(function() {

	// Clear Search Field
	$('.autobox').autobox();

	$('#prodAccordion .prodAccordionContent').hide();
	$('#prodAccordion .ProductDescription').addClass('current');
	$('#prodAccordion .ProductDescriptionContainer').show();
	$('#prodAccordion .Block .subtitle').click(function() {

		$(this).parent().toggleClass('current');
		$(this).css('outline','none').siblings('div').slideToggle('slow');
		

		return false;
	});
	
	
	// Horizontal Category List Dropdowns (non-flyout only)
	if(document.all) {
		$('#SideCategoryList li').hover(function() {
			$(this).addClass('over');
			return false;
		},
		function() {
			$(this).removeClass('over');
		});
	}
	
	//Fix IE7 z-index issues
	if ($.browser.msie && parseInt($.browser.version) == 7) {
		var zIndexNumber = 1000;
		$('#Menu ul li').each(function() { /* Pages menu */
			$(this).css('z-index', zIndexNumber);
			zIndexNumber -= 10;
		});
		$('#HeaderLower ul li').each(function() { /* Horizontal category menu */
			$(this).css('z-index', zIndexNumber);
			zIndexNumber -= 10;
		});
	}
	//
	//Fix IE6 z-index issues
	if ($.browser.msie && parseInt($.browser.version) == 6) {
		var zIndexNumber = 1000;
		$('#Menu ul li').each(function() { /* Pages menu */
			$(this).css('z-index', zIndexNumber);
			zIndexNumber -= 10;
		});
		$('#HeaderLower ul li').each(function() { /* Horizontal category menu */
			$(this).css('z-index', zIndexNumber);
			zIndexNumber -= 10;
		});
	}

	$('#change-currency').click(function(e) {
		e.stopPropagation();
		$('#currency-chooser .currencies').toggle();
		$(window).one('click', function() { $('#currency-chooser .currencies').hide(); });
	});
});




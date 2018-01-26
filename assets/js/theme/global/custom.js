import $ from 'jquery';

// add the line below to disable check
/* eslint-disable */

export default function scrollToTopAndCart(){
	window.$ = $;
	    var scrollTrigger = 300, // px
	        backToTop = function () {
	            var scrollTop = $(window).scrollTop();
	            if (scrollTop > scrollTrigger) {
	                $('#backTop').fadeIn('300');
	            } else {
	            	if($('#backTop').is(":visible")){
	            		$('#backTop').fadeOut('300');
	            	}
	            }
	        };
	    backToTop();
	    $(window).on('scroll', function () {
	        backToTop();
	    });
	    $('#backTop').on('click', function (e) {
	        e.preventDefault();
	        $('html,body').animate({
	            scrollTop: 0
	        }, 700);
	    });
	
	
	$(window).scroll(function() {    
		var scroll = $(window).scrollTop();
		 //console.log(scroll);
		if (scroll >= 150) {
		    //console.log('a');
		    $(".headerWrapper").addClass("fixed-menu");
		    $( ".header" ).fadeIn( "fast", function() {
			    // Animation complete
			    $(this).css('margin-top', '0');
			  });
		} else {
		    //console.log('a');
		    $(".headerWrapper").removeClass("fixed-menu");
		}
	});

	
	$('.showSidebar').click(function() {
		$('#faceted-search-container').toggleClass('category-open');
	});
	
	$('.cartWrap .navSearch-Icon').click(function() {
		$('.m--quickSearch').toggle();
	});
	
	$('.quickSearchResults').click(function() {
		$('.quickSearchResults').hide();
		$('input.form-input').focus(function() {
			$(this).val('');
		});
	});
		
	$('.navPages-quickSearch input.form-input').on('input', function () {
	   $('.quickSearchResults').toggle(this.value.length > 0);
	   $('.search-close').toggle(this.value.length > 0);
	});
	
	$(".card-title a").text(function(index, currentText) {
	    return currentText.substr(0, 60);
	});
	$('.customAddCart').on('click', function(e) {
		   var qty = $(this).parent('.addToCartWrap').siblings('.customQty').children().find('.qtyinput').val();
		   var link = $(this).attr('href');

		   // let's change the link
		   link = link + '&qty=' + qty
		   
		   	if (isNaN(qty) || qty < 1) {
		       alert('Please input a valid quantity');
			} else {
			   window.location.href = link;
			}
			e.preventDefault();
		})


		$("#form-action-addToCart[value='Pre-Order Now']" ).addClass('pre-order-btn');
		$(".has-activeModal #form-action-addToCart[value='Pre-Order Now']" ).addClass('pre-order-btn');


		$('body').each(() => {
		    const viewportWidth = $(window).width();
		    if (viewportWidth > 767) {
		        $(".navPages-action").hover(function() {
				    var data_id = $(this).data('id');
				
				    $('.navPage-subMenu-2').each(function() {
				        var item = $(this);
				
				        if(item.attr('id') == data_id)
				            item.show();
				        else
				            item.hide();
				    });
				    
				}, function() {
						$('.navPage-subMenu-2').hide();
					}
				);
			//	refresh once when browser resize
		    } else {
			// do nothing.
		    }
		    
		    if (viewportWidth < 767) {
		        $(".navPages-action-main").click(function() {
				    var data_id = $(this).data('id');
				
				    $('.navPage-subMenu-2').each(function() {
				        var item = $(this);
				
				        if(item.attr('id') == data_id)
				            item.toggle();
				        else
				            item.hide();
				    });
				    
				    return false;
				    
				});
				
				$(".navPage-subMenu-action-main").click(function() {
				    var data_id2 = $(this).data('id');
				
				    $('.navPage-childList').each(function() {
				        var item2 = $(this);
				
				        if(item2.attr('id') == data_id2)
				            item2.toggle();
				        else
				            item2.hide();
				    });
				    
				    return false;
				    
				});
				
				$('.navPage-subMenu-phone').insertAfter('#nav492');
				$('.navPage-subMenu-tablet').insertAfter('#nav589');
				$('.navPage-subMenu-computer').insertAfter('#nav632');
				$('.navPage-subMenu-repair').insertAfter('#nav944');
				$('.navPage-subMenu-accessories').insertAfter('#nav904');
				$('.navPage-subMenu-more').insertAfter('#nav851');
				
			//	refresh once when browser resize
		    } else {
			// do nothing.
		    }
		    
		});
}	

// add the line below to re-enable check
/* eslint-enable */


/* Product Variations */
var baseProduct = {};

function updateSelectedVariation(parent, variation, id) {
	if(typeof(parent) == 'undefined') {
		parent = $('body');
	}
	else {
		parent = $(parent);
	}

	if (typeof id == 'undefined') {
		id = '';
	}

	if(typeof(baseProduct.price) == 'undefined') {
		if($('.AddCartButton', parent).css('display') == "none") {
			var cartVisible = false;
		}
		else {
			var cartVisible = true;
		}

		var stockMessageVisible = false;
		if($('.OutOfStockMessage', parent).css('display') != 'none') {
			stockMessageVisible = true;
		}

		var price;
		$('.VariationProductPrice', parent).each(function(){
			var $$ = $(this);
			if ($$.is('input')) {
				price = $$.val();
			} else {
				price = $$.html();
			}
		});

		baseProduct = {
			saveAmount: $.trim($('.YouSaveAmount', parent).html()),
			price: $.trim(price),
			sku: $.trim($('.VariationProductSKU', parent).html()),
			weight: $.trim($('.VariationProductWeight', parent).html()),
			thumb: $.trim($('.ProductThumbImage img', parent).attr('src')),
			cartButton: cartVisible,
			stockMessage: stockMessageVisible,
			stockMessageText: $('.OutOfStockMessage', parent).html()
		};
	}

	// Show the defaults again
	if(typeof(variation) == 'undefined') {
		$('.WishListVariationId', parent).val('');
		$('.CartVariationId', parent).val('');
		if(baseProduct.saveAmount) {
			$('.YouSave', parent).show();
			$('.YouSaveAmount').html(baseProduct.saveAmount);
		} else {
			$('.YouSave', parent).hide();
		}
		$('.VariationProductPrice', parent).each(function(){
			var $$ = $(this);
			if ($$.is('input')) {
				$$.val(baseProduct.price);
			} else {
				$$.html(baseProduct.price);
			}
		});
		$('.VariationProductSKU', parent).html(baseProduct.sku);
		$('.VariationProductWeight', parent).html(baseProduct.weight);
		$('.ProductThumbImage img', parent).attr('src', baseProduct.thumb);
		$(parent).attr('currentVariation', '');
		$(parent).attr('currentVariationImage', '')
		if(baseProduct.sku == '') {
			$('.ProductSKU', parent).hide();
		}
		if(baseProduct.cartButton) {
			$('.AddCartButton', parent).show();
			if(typeof ShowAddToCartQtyBox != 'undefined' && ShowAddToCartQtyBox=='1') {
				$('.QuantityInput', parent).show();
			}
		}

		if(baseProduct.stockMessage) {
			$('.OutOfStockMessage', parent)
				.show()
				.html(baseProduct.stockMessageText)
			;
		}
		else {
			$('.OutOfStockMessage').hide();
		}

		$('.InventoryLevel', parent).hide();
	}
	// Otherwise, showing a specific variation
	else {
		$('.WishListVariationId', parent).val(id);
		$('.CartVariationId', parent).val(id);

		$('.VariationProductPrice', parent).each(function(){
			var $$ = $(this),
				price = baseProduct.price;

			if (variation.price !== undefined) {
				price = variation.price;
			}

			if ($$.is('input')) {
				$$.val(price.replace(/[^0-9\.,]/g, ''));
			} else {
				$$.html(price);
			}
		});

		if(variation.sku != '') {
			$('.VariationProductSKU', parent).html(variation.sku);
			$('.ProductSKU', parent).show();
		}
		else {
			$('.VariationProductSKU', parent).html(baseProduct.sku);
			if(baseProduct.sku) {
				$('.ProductSKU', parent).show();
			}
			else {
				$('.ProductSKU', parent).hide();
			}
		}
		$('.VariationProductWeight', parent).html(variation.weight);
		if(variation.instock == true) {
			$('.AddCartButton', parent).show();
			if(typeof ShowAddToCartQtyBox != 'undefined' && ShowAddToCartQtyBox=='1') {
				$('.QuantityInput', parent).show();
			}
			$('.OutOfStockMessage', parent).hide();
		}
		else {
			$('.AddCartButton, .QuantityInput', parent).hide();
			$('.OutOfStockMessage', parent).html(lang.VariationSoldOutMessage);
			$('.OutOfStockMessage', parent).show();
		}
		if(variation.thumb != '') {
			ShowVariationThumb = true;
			$('.ProductThumbImage img', parent).attr('src', variation.thumb);
			$(parent).attr('currentVariation', id);
			$(parent).attr('currentVariationImage', variation.image);

			$('.ProductThumbImage a').attr("href", variation.image);
		}
		else {
			$('.ProductThumbImage img', parent).attr('src', baseProduct.thumb);
			$(parent).attr('currentVariation', '');
			$(parent).attr('currentVariationImage', '')
		}
		if(variation.stock && parseInt(variation.stock)) {
			$('.InventoryLevel', parent).show();
			$('.VariationProductInventory', parent).html(variation.stock);
		}
		else {
			$('.InventoryLevel', parent).hide();
		}
		if(variation.saveAmount) {
			$('.YouSave', parent).show();
			$('.YouSaveAmount').html(variation.saveAmount);
			$('.RetailPrice').show();
		} else {
			$('.YouSave', parent).hide();
			$('.RetailPrice').hide();
		}
	}
}


function GenerateProductTabs()
{
	var ActiveTab = 'Active';
	var ProductTab = '';
	var TabNames = new Array();

	TabNames['ProductDescription'] = lang.Description;
	TabNames['ProductWarranty'] = lang.Warranty;
	TabNames['ProductOtherDetails'] = lang.OtherDetails;
	TabNames['SimilarProductsByTag'] = lang.ProductTags;
	TabNames['ProductByCategory'] = lang.SimilarProducts;
	TabNames['ProductReviews'] = lang.Reviews;
	TabNames['ProductVendorsOtherProducts'] = lang.OtherProducts;
	TabNames['ProductVideos'] = lang.ProductVideos;
	TabNames['SimilarProductsByCustomerViews'] = lang.SimilarProductsByCustomerViews;
	$('#prodAccordion .prodAccordionContent').show();
	$('#prodAccordion').removeAttr('id');
	$('.Content .Moveable').each (function() {
		if (this.id == 'ProductBreadcrumb' ||
			this.id == 'ProductDetails' ||
			$(this).html() == '' ||
			!TabNames[this.id]
			) {
			return;
		}
		
		var TabContentId = this.id;
		$('#'+TabContentId+' .subtitle').hide();

		TabName = TabNames[this.id];
		ProductTab += '<li id="'+this.id+'_Tab" class="'+ActiveTab+'"><a onclick="ActiveProductTab(\''+this.id+'_Tab\'); return false;" href="#">'+TabName+'</a></li>';

		if (ActiveTab == '')
		{
			$('#'+this.id).hide();
		}
		$('#'+this.id).removeClass('Moveable');
		ActiveTab = "";
	});

	if (ProductTab != '')
	{
		$('#ProductTabsList').html(ProductTab);
	}
}

function ActiveProductTab(TabId)
{
	var CurTabId = $('#ProductTabs .Active').attr('id');
	var CurTabContentId = CurTabId.replace('_Tab','');

	$('#ProductTabs .Active').removeClass('Active');

	$('#'+CurTabContentId).hide();

	$('#'+TabId).addClass('Active');

	var NewTabContentId = TabId.replace('_Tab','');
	$('#'+NewTabContentId).show();

}

function CheckEventDate() {

	var result = true;

	if(typeof(eventDateData) == 'undefined') {
		return true;
	}

	if ($('#EventDateDay').val() == -1 || $('#EventDateMonth').val() == -1 || $('#EventDateYear').val() == -1) {
		alert(eventDateData['invalidMessage']);
		return false;
	}

	if (eventDateData['type'] == 1) {
		if (new Date($('#EventDateYear').val()+'/'+$('#EventDateMonth').val()+'/'+$('#EventDateDay').val()) > new Date(eventDateData['compDateEnd'])
		 || new Date($('#EventDateYear').val()+'/'+$('#EventDateMonth').val()+'/'+$('#EventDateDay').val()) < new Date(eventDateData['compDate'])
		) {
			result = false;
		}

	} else if (eventDateData['type'] == 2) {
		if (new Date($('#EventDateYear').val()+'/'+$('#EventDateMonth').val()+'/'+$('#EventDateDay').val()) < new Date(eventDateData['compDate'])) {
			result = false;
		}

	} else if (eventDateData['type'] == 3) {
		if (new Date($('#EventDateYear').val()+'/'+$('#EventDateMonth').val()+'/'+$('#EventDateDay').val()) > new Date(eventDateData['compDate'])) {
			result = false;
		}
	} else {
		result = true;
	}

	if (!result) {
		alert(eventDateData['errorMessage']);
	}
	return result;
}

function selectCurrentVideo (videoId) {
	$('.currentVideo').removeClass('currentVideo');
	$('#video_' + videoId).addClass('currentVideo');
}

function showVideoPopup(videoId) {
	var l = (screen.availWidth/2)-250;
	var t = (screen.availHeight/2)-200;
	window.open(config.ShopPath + "/productimage.php?video_id="+videoId, "imagePop", "toolbar=0,scrollbars=1,location=0,statusbar=1,menubar=0,resizable=1,width=530,height=430,top="+t+",left="+l);
}

function updatePinterestMediaLink(image) 
{
	var src = $('.PinterestButtonContainer > a').attr('href');
	if (typeof src != 'undefined') {
		var newsrc = src.replace(new RegExp('&media=([^&]+)'), '&media=' + image);
		$('.PinterestButtonContainer > a').attr('href', newsrc);
	}
}

function showProductThumbImage(ThumbIndex, el)
{
	if (ShowImageZoomer && CurrentProdThumbImage == ThumbIndex)
		return;

	CurrentProdThumbImage = ThumbIndex;
	ShowVariationThumb = false;
	highlightProductTinyImage(ThumbIndex);

	// Swap the a tag for the current image so the lightbox will work.
	if (ShowImageZoomer) {
		var rel = $.parseJSON($(el).find('a').attr('rel'));
		replaceProductImageInZoom(rel.largeimage, rel.smallimage);
		updatePinterestMediaLink(rel.largeimage);
		$('.ProductThumbImage a').css({'cursor':'pointer'});
	} else {
		$('.ProductThumbImage a img').attr("src", ThumbURLs[ThumbIndex]);
	}
}

function replaceProductImageInZoom(zoom, thumb)
{
	if (ShowImageZoomer) {
		$('.ProductThumbImage')
			.find('img')
				.remove()
				.end()
			.append($('.ProductThumbImage').data('originalAElement'))
			.find('a')
				.attr('href', zoom).hide()
				.end()
			.find('img')
				.attr('src', thumb).parent().fadeIn(600);
				
		initiateImageZoomer();
	} else {
		var $productThumbImage = $('.ProductThumbImage');
		var originalAElement = $productThumbImage.data('originalAElement');
		if (originalAElement) {
			$productThumbImage.find('*')
				.remove()
				.end()
				.append($('.ProductThumbImage').data('originalAElement'));
		}
		$productThumbImage.find('img').attr('src', thumb);
	}
}

function removeTinyImageHighlight()
{
	CurrentProdThumbImage = 0;
	$('.ProductTinyImageList li').removeClass('selected');
	
	//$('.ProductTinyImageList li').css('border', '1px solid gray');
	//$('.ProductTinyImageList li .TinyOuterDiv').css('border', '2px solid white');

	//$('#TinyImageBox_' + CurrentProdThumbImage).css('border', '');
	//$('#TinyImageBox_' + CurrentProdThumbImage + ' .TinyOuterDiv').css('border', '');
}

function highlightProductTinyImage(ThumbIndex)
{
	$('.ProductTinyImageList li').removeClass('selected');	
	$('#TinyImageBox_'+ThumbIndex).addClass('selected');	
	//$('.ProductTinyImageList li').css('border', '1px solid gray');
	//$('.ProductTinyImageList li .TinyOuterDiv').css('border', '2px solid white');

	//$('#TinyImageBox_'+ThumbIndex).css('border', '1px solid #075899');
	//$('#TinyImageBox_'+ThumbIndex+' .TinyOuterDiv').css('border', '2px solid #075899');
}

function initiateImageCarousel()
{
	if (!$('.ImageCarouselBox').is(':visible')) {
		var seeMoreImageHeight = $("#ProductDetails .SeeMorePicturesLink").height();
		$("#ProductDetails .ProductThumb").width(ProductThumbWidth+20);
		$("#ProductDetails .ProductThumb").height(ProductThumbHeight+seeMoreImageHeight+10);
		return false;
	}

	highlightProductTinyImage(0);

	var PinterestButtonHeight = $("#ProductDetails .PinterestButtonContainer").height();
	var carouselHeight = $("#ProductDetails .ProductTinyImageList").height();
	$("#ProductDetails .ProductThumb").width(ProductThumbWidth+20);
	$("#ProductDetails .ProductThumb").height(ProductThumbHeight+carouselHeight+10+PinterestButtonHeight);

	var CarouselImageWidth = $('#ProductDetails .ProductTinyImageList > ul > li').outerWidth(true);

	$("#ImageScrollPrev").show();
	var CarouselButtonWidth =  $("#ProductDetails #ImageScrollPrev").outerWidth(true);
	$("#ImageScrollPrev").hide();

	var MaxCarouselWidth = $("#ProductDetails .ProductThumb").width() - (CarouselButtonWidth * 2);
	var MaxVisibleTinyImages = Math.floor(MaxCarouselWidth/CarouselImageWidth);

	if (MaxVisibleTinyImages<=0) {
		MaxVisibleTinyImages = 1;
	}

	var visible = MaxVisibleTinyImages;

	if (ThumbURLs.length <= MaxVisibleTinyImages) {
		visible = ThumbURLs.length;
		CarouselButtonWidth = 0;
	} else {
		$("#ImageScrollPrev").show();
		$("#ImageScrollNext").show();
	}

	var scroll = Math.round(visible/2);

	if($('#ProductDetails .ProductTinyImageList li').length > 0) {
		$("#ProductDetails .ProductTinyImageList").jCarouselLite({
			btnNext: ".next",
			btnPrev: ".prev",
			visible: visible,
			scroll: scroll,
			circular: false,
			speed: 200
		});
	}

	// end this floating madness
	$('#ImageScrollNext').after('<br clear="all" />');

	// pad the carousel box to center it
	$('#ProductDetails .ImageCarouselBox').css('padding-left', Math.floor(($("#ProductDetails .ProductThumb").width() - (visible * CarouselImageWidth) - (2 * CarouselButtonWidth)) / 2));

	// IE 6 doesn't render the carousel properly, the following code is the fix for IE6
	if($.browser.msie && $.browser.version.substr(0,1) == 6) {
		$("#ProductDetails .ProductTinyImageList").width($("#ProductDetails .ProductTinyImageList").width()+4);
		var liHeight = $("#ProductDetails .ProductTinyImageList li").height();
		$("#ProductDetails .ProductTinyImageList").height(liHeight+2);
	}
}


function initiateImageZoomer()
{
	// clone the A tag and save it for reuse later
	if (!$('.ProductThumbImage').data('originalAElement')) {
		$('.ProductThumbImage').data('originalAElement', $('.ProductThumbImage').html());
	}

	if (ShowImageZoomer) {
		var options = {
			//zoomWidth: 380,
			//zoomHeight: 300,
			//xOffset: 10,
			//position: "right",
			preloadImages: false,
			showPreload:false,
			title: false,
			cursor: 'pointer',
			zoomType: 'innerzoom'

		};

		$('.ProductThumbImage a').jqzoom(options);
	}
}

$(function () {
    if (window.location.href.search('#write_review') > 0) {
        if ($('#rating_box').length > 0) {
            show_product_review_form();
            if ($('#revrating').length > 0) {
                $('#revrating').focus();
            }
        }
    }
});

handleCarousel();
$( window ).resize(function() {
	handleCarousel();	
});

function handleCarousel() {
	
	if($( window ).width()<770) {
		
		if(!$("#ProductThumbDesktop").is(':empty') && $("#ProductThumbMobile").is(':empty')) {
			var source = $("#ProductThumbDesktop").html();
			$("#ProductThumbDesktop").html("");
			$("#ProductThumbMobile").html(source);
			initiateImageCarousel();
		}
	}
	else {
		if(!$("#ProductThumbMobile").is(':empty') && $("#ProductThumbDesktop").is(':empty')) {
			var source = $("#ProductThumbMobile").html();
			$("#ProductThumbMobile").html("");
			$("#ProductThumbDesktop").html(source);
			initiateImageCarousel();
		}
	}
}
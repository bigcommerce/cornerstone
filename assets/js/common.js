/* Common Javascript functions for use throughout Interspire Shopping Cart */

$(function(){
	// this is here just incase the HTMLHead code fails
	$('html').addClass('javascript');
});

// Fetch the value of a cookie
function get_cookie(name) {
	name = name += "=";
	var cookie_start = document.cookie.indexOf(name);
	if(cookie_start > -1) {
		cookie_start = cookie_start+name.length;
		cookie_end = document.cookie.indexOf(';', cookie_start);
		if(cookie_end == -1) {
			cookie_end = document.cookie.length;
		}
		return unescape(document.cookie.substring(cookie_start, cookie_end));
	}
}

// Set a cookie
function set_cookie(name, value, expires)
{
	if(!expires) {
		expires = "; expires=Wed, 1 Jan 2020 00:00:00 GMT;"
	} else {
		expire = new Date();
		expire.setTime(expire.getTime()+(expires*1000));
		expires = "; expires="+expire.toGMTString();
	}
	document.cookie = name+"="+escape(value)+expires;
}

/* Javascript functions for the products page */
var num_products_to_compare = 0;
var product_option_value = "";
var CurrentProdTab = "";
function showProductImage(filename, product_id, currentImage) {
	var l = (screen.availWidth/2)-350;
	var t = (screen.availHeight/2)-300;
	var variationAdd = '';
	if(ShowVariationThumb) {
		variationAdd = '&image_rule_id=' + encodeURIComponent(ShowVariationThumb);
		CurrentProdThumbImage = null;
	}
	UrlAddOn = '';

	if(currentImage) {
		UrlAddOn = "&current_image="+currentImage;
	} else if(CurrentProdThumbImage) {
		UrlAddOn = "&current_image="+CurrentProdThumbImage;
	}
	var imgPopup = window.open(filename + "?product_id="+product_id+variationAdd+UrlAddOn, "imagePop", "toolbar=0,scrollbars=1,location=0,statusbar=1,menubar=0,resizable=1,width=700,height=600,top="+t+",left="+l);
	imgPopup.focus();
}

function CheckQuantityLimits (form)
{
	var qty = parseInt($('#qty_').val(), 10);

	if (!qty) {
		// If text fields are being used for 'quantity' we need to get this value instead:
		qty = parseInt($('#text_qty_').val(), 10);
	}

	if (qty < productMinQty) {
		alert(lang.ProductMinQtyError);
		return false;
	}

	if (qty > productMaxQty) {
		alert(lang.ProductMaxQtyError);
		return false;
	}

	return true;
}

function CheckProductConfigurableFields(form)
{
	var requiredFields = $('.FieldRequired');
	var valid = true;
	requiredFields.each(function() {
		var namePart = this.name.replace(/^.*\[/, '');
		var fieldId = namePart.replace(/\].*$/, '');

		if(this.type=='checkbox' ) {
			if(!this.checked) {
				valid = false;
				alert(lang.EnterRequiredField);
				this.focus();
				return false;
			}
		} else if($.trim(this.value) == '') {
			if(this.type != 'file' || (this.type == 'file' && document.getElementById('CurrentProductFile_'+fieldId).value == '')) {
				valid = false;
				alert(lang.EnterRequiredField);
				this.focus();
				return false;
			}
		}
	});

	var fileFields = $(form).find("input[name^='ProductField']:file");
	fileFields.each(function() {
		if(this.value != '') {
			var namePart = this.name.replace(/^.*\[/, '');
			var fieldId = namePart.replace(/\].*$/, '');
			var fileTypes = document.getElementById('ProductFileType_'+fieldId).value;

			fileTypes = ','+fileTypes.replace(' ', '').toLowerCase()+','
			var ext = this.value.replace(/^.*\./, '').toLowerCase();

			if(fileTypes.indexOf(','+ext+',') == -1) {
				alert(lang.InvalidFileTypeJS);
				this.focus();
				this.select();
				valid = false;
			}

		}
	});

	return valid;
}

function check_add_to_cart(form, required) {
	var valid = true;
	var qtyInputs = $(form).find('input.qtyInput');
	qtyInputs.each(function() {
		if(isNaN($(this).val()) || $(this).val() <= 0) {
			alert(lang.InvalidQuantity);
			this.focus();
			this.select();
			valid = false;
			return false;
		}
	});
	if(valid == false) {
		return false;
	}

	if(!CheckProductConfigurableFields(form)) {
		return false;
	}

	// validate the attributes
	var attributesValidated = $('#productDetailsAddToCartForm')
		.validate()
		.form();

	if (!attributesValidated) {
		return false;
	}

	if (!CheckQuantityLimits(form)) {
		return false;
	}

	if(required && !$(form).find('.CartVariationId').val()) {
		alert(lang.OptionMessage);
		var select = $(form).find('select').get(0);
		if(select) {
			select.focus();
		}
		var radio = $(form).find('input[type=radio]').get(0);
		if(radio) {
			radio.focus();
		}
		return false;
	}

	if (!CheckEventDate()) {
		return false;
	}

	// if we're using the fastcart, pop that up now
	if (config.FastCart) {
		return fastCartAction();
	}

	return true;
}

function compareProducts(compare_path) {
	var pids = "";

	if($('form').find('input[name=compare_product_ids]:checked').size() >= 2) {
		var cpids = document.getElementsByName('compare_product_ids');

		for(i = 0; i < cpids.length; i++) {
			if(cpids[i].checked)
				pids = pids + cpids[i].value + "/";
		}

		pids = pids.replace(/\/$/, "");
		document.location.href = compare_path + pids;
		return false;
	}

	alert(lang.CompareSelectMessage);
	return false;
}

function product_comparison_box_changed(state) {
	// Increment num_products_to_compare - needs to be > 0 to submit the product comparison form


	if(state)
		num_products_to_compare++;
	else
		if (num_products_to_compare != 0)
			num_products_to_compare--;
}

function remove_product_from_comparison(id) {
	if(num_compare_items > 2) {
		for(i = 1; i < 11; i++) {
			document.getElementById("compare_"+i+"_"+id).style.display = "none";
		}

		num_compare_items--;
	}
	else {
		alert(lang.CompareTwoProducts);
	}
}

(function($){
	$.fn.captchaPlaceholder = function () {
		$(this).each(function(){
			var $$ = $(this);

			if (!$$.parent().is(':visible')) {
				// don't do anything if this placeholder isn't visible
				return;
			}

			var img = $$.find('.captchaImage');
			if (img.length) {
				// don't do anything if an image is already in the dom
				return;
			}

			var rand = Math.round(500 + Math.random() * 7500);
			img = $('<img class="captchaImage" src="' + config.ShopPath + '/captcha.php?' + rand + '" />');
			$$.append(img);
		});

		return this;
	};
})(jQuery);

function show_product_review_form() {
	document.getElementById("rating_box").style.display = "";
	if(typeof(HideProductTabs) != 'undefined' && HideProductTabs == 0) {
		CurrentProdTab = 'ProductReviews_Tab';
	} else {
		document.location.href = "#write_review";
	}

	$('.captchaPlaceholder').captchaPlaceholder();
}

function jump_to_product_reviews() {
	if(typeof(HideProductTabs) != 'undefined' && HideProductTabs == 0) {
		CurrentProdTab = 'ProductReviews_Tab';
	} else {
		document.location.href = "#reviews";
	}
}

function g(id) {
	return document.getElementById(id);
}

function check_product_review_form() {
	var revrating = g("revrating");
	var revtitle = g("revtitle");
	var revtext = g("revtext");
	var revfromname = g("revfromname");
	var captcha = g("captcha");
    var email = g("email");

    if(jQuery && jQuery(email).is(":visible") && email.value == "") {
		alert(lang.ReviewNoEmail);
		email.focus();
		return false;
	}

	if(revrating.selectedIndex == 0) {
		alert(lang.ReviewNoRating);
		revrating.focus();
		return false;
	}

	if(revtitle.value == "") {
		alert(lang.ReviewNoTitle);
		revtitle.focus();
		return false;
	}

	if(revtext.value == "") {
		alert(lang.ReviewNoText);
		revtext.focus();
		return false;
	}

    if(jQuery && jQuery(email).is(":visible") && email.value == "") {
        alert(lang.ReviewNoEmail);
        email.focus();
        return false;
    }

	if(captcha.value == "" && HideReviewCaptcha != "none") {
		alert(lang.ReviewNoCaptcha);
		captcha.focus();
		return false;
	}

	return true;
}

function check_small_search_form() {
	var search_query = g("search_query");

	if(search_query.value == "") {
		alert(lang.EmptySmallSearch);
		search_query.focus();
		return false;
	}

	return true;
}

function setCurrency(currencyId)
{
	var gotoURL = location.href;

	if (location.search !== '')
	{
		if (gotoURL.search(/[&|\?]setCurrencyId=[0-9]+/) > -1)
			gotoURL = gotoURL.replace(/([&|\?]setCurrencyId=)[0-9]+/, '$1' + currencyId);
		else
			gotoURL = gotoURL + '&setCurrencyId=' + currencyId;
	}
	else
		gotoURL = gotoURL + '?setCurrencyId=' + currencyId;

	location.href = gotoURL;
}


// Dummy sel_panel function for when design mode isn't enabled
function sel_panel(id) {}

function inline_add_to_cart(filename, product_id, quantity, returnTo) {
	if(typeof(quantity) == 'undefined') {
		var quantity = '1';
	}
	var html = '<form action="' + filename + '/cart.php" method="post" id="inlineCartAdd">';
	if(typeof(returnTo) != 'undefined' && returnTo == true) {
		var returnLocation = window.location;
		html += '<input type="hidden" name="returnUrl" value="'+escape(returnLocation)+'" />';
	}
	html += '<input type="hidden" name="action" value="add" />';
	html += '<input type="hidden" name="qty" value="'+quantity+'" />';
	html += '<input type="hidden" name="product_id" value="'+product_id+'" />';
	html += '<\/form>';
   $('body').append(html);
   $('#inlineCartAdd').submit();
}

function ShowPopupHelp(content, url, decodeHtmlEntities) {
	var popupWindow = open('', 'view','height=450,width=550');

	if(decodeHtmlEntities) {
		content = HtmlEntityDecode(content);
	}
	if (window.focus) {
		popupWindow.focus();
	}

	var doc = popupWindow.document;
	doc.write(content);
	doc.close();

	return false;
}

function HtmlEntityDecode(str) {
   try {
	  var tarea=document.createElement('textarea');
	  tarea.innerHTML = str; return tarea.value;
	  tarea.parentNode.removeChild(tarea);
   } catch(e) {
	  //for IE add <div id="htmlconverter" style="display:none;"></div> to the page
	  document.getElementById("htmlconverter").innerHTML = '<textarea id="innerConverter">' + str + '</textarea>';
	  var content = document.getElementById("innerConverter").value;
	  document.getElementById("htmlconverter").innerHTML = "";
	  return content;
   }
}

function setProductThumbHeight()
{
	var ImageBoxDiv = $('.ProductList:not(.List) .ProductImage a');
	var ImageListDiv = $('.ProductList:not(.List) li');
	var CurrentListHeight = ImageListDiv.height();
	var ProductImageMargin = ImageBoxDiv.css('margin-left')*2;

	var ImageBoxHeight = ThumbImageHeight;

	if (parseInt(ImageBoxDiv.css("padding-top"), 10)) {
		ImageBoxHeight += parseInt(ImageBoxDiv.css("padding-top"), 10) * 2; //Total Padding Width
	}

	if(parseInt(ImageBoxDiv.css("margin-top"), 10)) {
		ImageBoxHeight += parseInt(ImageBoxDiv.css("margin-top"), 10) * 2; //Total Margin Width
	}

	ImageBoxDiv.height(ImageBoxHeight);
	if ($.browser.msie && $.browser.version >= 7 && $.browser.version < 8) {
		// this is a specific browser check because this fix is only applicable for ie7
		ImageBoxDiv.css('line-height', ImageBoxHeight+'px');
	}

	// $('.Content .ProductList.List .ProductDetails').css('margin-left',ThumbImageWidth+2+'px');
	// $('.Content .ProductList.List li').height(Math.max(CurrentListHeight, ThumbImageHeight));
}

// Dummy JS object to hold language strings.
if (typeof lang == 'undefined') { lang = {}; }

/**
* A javascript equivalent of server-side getLang method with replacements support. The specified language entry must be
* present in the lang object. Returns a blank string if it is not.
*
* Usage:
* getLang('ProductMinQtyError', { qty: 10, product: 'Test Product' }); // pass the name of the language entry
*
* @param string name
* @param object replacements
* @return string
*/
function getLang (name, replacements)
{
	if (!lang[name]) {
		return '';
	}

	var string = lang[name];
	if (typeof replacements != 'object') {
		return string;
	}

	$.each(replacements, function(needle, haystack){
		string = string.replace(':' + needle, haystack);
	});

	return string;
}

// IE 6 doesn't support the :hover selector on elements other than links, so
// we use jQuery to work some magic to get our hover styles applied.
if(document.all) {
	var isIE7 = /*@cc_on@if(@_jscript_version>=5.7)!@end@*/false;
	if(isIE7 == false) {
		$(document).ready(function() {
			$('.ProductList li').hover(function() {
				$(this).addClass('Over');
			},
			function() {
				$(this).removeClass('Over');
			});
			$('.ComparisonTable tr').hover(function() {
				$(this).addClass('Over');
			},
			function() {
				$(this).removeClass('Over');
			});
		});
	}
	$('.ProductList li:last-child').addClass('LastChild');
}

function ShowLoadingIndicator() {
	if (typeof(disableLoadingIndicator) != 'undefined' && disableLoadingIndicator) {
		return;
	}
	var width = $(window).width();
	// var position = $('#Container').css('position');
	// if (position == 'relative') {
	// 	width = $('#Container').width();
	// }

	var scrollTop;
	if(self.pageYOffset) {
		scrollTop = self.pageYOffset;
	}
	else if(document.documentElement && document.documentElement.scrollTop) {
		scrollTop = document.documentElement.scrollTop;
	}
	else if(document.body) {
		scrollTop = document.body.scrollTop;
	}
	$('#AjaxLoading').show();
}

function HideLoadingIndicator() {
	$('#AjaxLoading').hide();
}


var loadedImages = {};

// Ensure that all product lists are the same height
function setProductListHeights(imgName, className) {
	// hack job putting this here but it needs to be reused by search ajax pager
	if (typeof(DesignMode) != 'undefined') {
		return;
	}

	if (typeof imgName != 'undefined') {
		if (typeof loadedImages[imgName] != 'undefined') {
			return;
		}

		loadedImages[imgName] = true;
	}

	setProductThumbHeight();

	/**
	 * Sets the height of the elements passed in to match that of the one that
	 * has the greatest height.
	 *
	 * @param ele The element(s) to adjust the height for.
	 * @return void
	 */
	function setHeight(ele) {
		var ele = $(ele),
			maxHeight = 0;
		ele
			// reset the height just in case it was set by the stylesheet so
			// we can detect it
			.css('min-height', 'auto')
			// get the one with the greatest height
			.each(function() {
				if ($(this).height() > maxHeight) {
					maxHeight = $(this).height();
				}
			})
			// and set them all to the greatest height
			.css('min-height', maxHeight);
	}

	function setHeightRows(selector) {
		var $elements = $(selector),
				rows = {},
				key;
		$elements.each(function() {
			var $this = $(this),
					currentTop = $this.offset().top;
			if (typeof rows[currentTop] === 'undefined')
				rows[currentTop] = $this;
			else
				rows[currentTop] = rows[currentTop].add(this);
		});
		for (key in rows) {
			if (!Object.hasOwnProperty.call(rows, key))
				continue;
			setHeight(rows[key]);
		}
	}

	if (!className) {
		className = '.Content';
	}

	setHeightRows(className + ' .ProductList:not(.List) li .ProductDetails');

	if (typeof imgName != 'undefined') {
		setHeightRows(className + ' .ProductList:not(.List) li .ProductPriceRating:has(img[src$=\''+imgName+'\'])');
	}

	setHeightRows(className + ' .ProductList:not(.List) li');
}


function fastCartAction(event) {
	var url = '';

	var modalOptions;

	// Supplied URL
	if (typeof(event) == 'string') {
		var url = event;

		// Make sure a valid URL was supplied
		if (!url || url.indexOf('cart.php') == -1) {
			return false;
		}

		// strip protocol from url to fix cross protocol ajax access denied problem
		url = url.replace(/^http[s]{0,1}:\/\/[^\/]*\/?/, '/');
		url += '&fastcart=1';

		$.ajax({
			url: url,
			dataType: 'json',
			success: function(data)	{
				if (data.success) {
					modalOptions = {
						data: data
					};
					_showFastCart(modalOptions);
				}
				else if (data.redirect) {
					window.location.href = data.redirect;
				}
			}
		});
	}
	// 'Add' button on product details page
	else {
		$('#productDetailsAddToCartForm').ajaxSubmit({
			data: {
				fastcart: 1,
				ajaxsubmit: 1
			},
			type: 'post',
			iframe: true,
			dataType: 'json',
			success: function(data)	{
				if (data.success) {
					modalOptions = {
						data: data
					};
					_showFastCart(modalOptions);
				}
				else if (data.redirect) {
					window.location.href = data.redirect;
				}
			}
		});
	}

	return false;
}

function _showFastCart(modalOptions) {
	modalOptions = $.extend({
		width: 700,
		closeTxt: true,
		onShow: function() {
			$("#fastCartSuggestive a[href*='cart.php?action=add']").unbind('click');

			var itemTxt = $('#fastCartNumItemsTxt').html();
			if (itemTxt) {
				// update the view cart item count on top menu
				$('.CartLink .item').html(itemTxt);	
				var e = itemTxt.replace(/[^\d.]/g, '');
				$("#cart-amount .total").html(e);
				
				if(e.length > 0) {
					$(".CartLink").addClass("CartBorder");
				}
				else {
					$(".CartLink").removeClass("CartBorder");
				}
			}
			setProductListHeights(null, '.fastCartContent');
			//$('.fastCartContent .ProductList:not(.List) li').width(ThumbImageWidth);
		},
		onClose: function() {
			if (window.location.href.match(config.ShopPath + '/cart.php')) {
				// reload if we are on the cart page
				$('#ModalContainer').remove();
				window.location = window.location.href
			} else {
				$('#ModalContainer').remove();
			}
		}
	}, modalOptions);

	$.iModal.close();
	$.iModal(modalOptions);
}

/**
* Adds a script tag to the DOM that forces a hit to tracksearchclick. Should be called by a mousedown event as calling it by a click event can sometimes be cancelled by the browser navigating away from the page.
*/
function isc_TrackSearchClick (searchId) {
	if (!searchId) {
		return;
	}

	$('#SearchTracker').remove();

	var trackurl = 'search.php?action=tracksearchclick&searchid=' + encodeURIComponent(searchId) + '&random=' + Math.random();

	var script = document.createElement('script');
	script.type = "text/javascript";
	script.src = trackurl;
	script.id = "SearchTracker";

	window.document.body.appendChild(script);
}

$(document).ready(function() {
	if($('.Rating img').length > 0) {
		$('.Rating img').each(function() {
			if($(this).height() == 0) {
				$(this).load(function() {
					// Load rating img and find the tallest product.
					var imgName = $(this).attr('src').split('/');
					var imgKey = imgName.length-1;
					setProductListHeights(imgName[imgKey]);
				});
			} else {
				setProductListHeights();
				return false;
			}
		});
	} else {
		setProductListHeights();
	}

	$('.InitialFocus').focus();
	$('table.Stylize tr:first-child').addClass('First');
	$('table.Stylize tr:last-child').addClass('Last');
	$('table.Stylize tr td:odd').addClass('Odd');
	$('table.Stylize tr td:even').addClass('Even');
	$('table.Stylize tr:even').addClass('Odd');
	$('table.Stylize tr:even').addClass('Even');

	$('.TabContainer .TabNav li').click(function() {
		$(this).parent('.TabNav').find('li').removeClass('Active');
		$(this).parents('.TabContainer').find('.TabContent').hide();
		$(this).addClass('Active');
		$(this).parents('.TabContainer').find('#TabContent'+this.id).show();
		$(this).find('a').blur();
		return false;
	});

	$('html').ajaxStart(function() {
		ShowLoadingIndicator();
	});

	$('html').ajaxComplete(function() {
		HideLoadingIndicator();
	});

	// generic checkbox => element visibility toggle based on id of checkbox and class names of other elements
	$('.CheckboxTogglesOtherElements').live('change', function(event){
		if (!this.id) {
			return;
		}

		var className = 'ShowIf_' + this.id + '_Checked';
		var elements = $('.' + className);

		if (this.checked) {
			// easy, show matching elements
			elements.show();
			return;
		}

		// if not checked it's a little more tricky -- only hide elements if they are not showing for multiple check boxes
		var classExpression = /^ShowIf_(.+)_Checked$/;
		elements.each(function(){
			var $$ = $(this);

			// before hiding this element, check its classes to see if it has another ShowIf_?_Checked - if it does, see if that class points to a checked box
			var classes = $$.attr('class').split(/\s+/);
			var checked = false;
			$.each(classes, function(key,value){
				if (value === className) {
					// we're processing this class already so we know it's unchecked - ignore it
					return;
				}

				var result = classExpression.exec(value);
				if (result === null) {
					// not a ShowIf_?_Class
					return;
				}

				var id = result[1];
				if ($('#' + id ).attr('checked')) {
					// found a checked box
					checked = true;
					return false;
				}
			});

			if (!checked) {
				// found no checkbox that should be keeping this element visible
				$$.hide();
			}
		});

	}).change();
});

var config = {};

/**
 * Add a method to the Date object prototype to set the full
 * year using an ISO 8601 format string.
 *
 * Usage:
 * var d = new Date();
 * d.setISO('1980-01-08');
 */
if (typeof Date.prototype.setISO == 'undefined') {
	Date.prototype.setISO = function (isoFmt) {
		var dtparts = isoFmt.split('-');
		this.setFullYear(dtparts[0], dtparts[1] - 1, dtparts[2]);
	};
}

/**
 * This disables the process payment button. It's here because otherwise it'd require a template
 * change to about 20 files.
 */
$('form[action$="process_payment"]').live('submit', function(ev){
	if (ev.isDefaultPrevented()) {
		return;
	}

    var submitFunc = this.onsubmit;
    if(submitFunc && submitFunc() == false){
        ev.preventDefault();
        return;
    }

	var self = this,
		disabler = function () {
			$('input[type="submit"]', self)
				.val("Processing Your Order...")
				.attr('disabled', 'disabled');
		};

	// for opera, just submit straight away. opera doesn't process the timeout (ie. js/events) after navigation.
	if ($.browser.opera) {
		disabler();
	} else {
		// IE flavours need a timeout to allow submit button disabling.
		setTimeout(disabler, 1);
	}
});

// TODO: rewirte this
$('#OrderConfirmationForm').live('submit', function(ev){
	if (ev.isDefaultPrevented()) {
		return;
	}
    var submitFunc = this.onsubmit;
    if(submitFunc && submitFunc() == false){
        ev.preventDefault();
        return;
    }
	var self = this,
	disabler = function () {
		$('#bottom_payment_button', self)
		.attr('disabled', 'disabled');
	};

	// for opera, just submit straight away. opera doesn't process the timeout (ie. js/events) after navigation.
	if ($.browser.opera) {
		disabler();
	} else {
		// IE flavours need a timeout to allow submit button disabling.
		setTimeout(disabler, 1);
	}
});

function htmlspecialchars_decode (string, quote_style) {
    // http://kevin.vanzonneveld.net
    // +   original by: Mirek Slugen
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Mateusz "loonquawl" Zalega
    // +      input by: ReverseSyntax
    // +      input by: Slawomir Kaniecki
    // +      input by: Scott Cariss
    // +      input by: Francois
    // +   bugfixed by: Onno Marsman
    // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // +      input by: Ratheous
    // +      input by: Mailfaker (http://www.weedem.fr/)
    // +      reimplemented by: Brett Zamir (http://brett-zamir.me)
    // +    bugfixed by: Brett Zamir (http://brett-zamir.me)
    // *     example 1: htmlspecialchars_decode("<p>this -&gt; &quot;</p>", 'ENT_NOQUOTES');
    // *     returns 1: '<p>this -> &quot;</p>'
    // *     example 2: htmlspecialchars_decode("&amp;quot;");
    // *     returns 2: '&quot;'
    var optTemp = 0,
        i = 0,
        noquotes = false;
    if (typeof quote_style === 'undefined') {
        quote_style = 2;
    }
    string = string.toString().replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    var OPTS = {
        'ENT_NOQUOTES': 0,
        'ENT_HTML_QUOTE_SINGLE': 1,
        'ENT_HTML_QUOTE_DOUBLE': 2,
        'ENT_COMPAT': 2,
        'ENT_QUOTES': 3,
        'ENT_IGNORE': 4
    };
    if (quote_style === 0) {
        noquotes = true;
    }
    if (typeof quote_style !== 'number') { // Allow for a single string or an array of string flags
        quote_style = [].concat(quote_style);
        for (i = 0; i < quote_style.length; i++) {
            // Resolve string input to bitwise e.g. 'PATHINFO_EXTENSION' becomes 4
            if (OPTS[quote_style[i]] === 0) {
                noquotes = true;
            } else if (OPTS[quote_style[i]]) {
                optTemp = optTemp | OPTS[quote_style[i]];
            }
        }
        quote_style = optTemp;
    }
    if (quote_style & OPTS.ENT_HTML_QUOTE_SINGLE) {
        string = string.replace(/&#0*39;/g, "'"); // PHP doesn't currently escape if more than one 0, but it should
        // string = string.replace(/&apos;|&#x0*27;/g, "'"); // This would also be useful here, but not a part of PHP
    }
    if (!noquotes) {
        string = string.replace(/&quot;/g, '"');
    }
    // Put this in last place to avoid escape being double-decoded
    string = string.replace(/&amp;/g, '&');

    return string;
}

/**
 * Converts price in string format back to numeric value
 * eg. '$99.99 AUD' -> 99.99
 * @param string price -- price in the string format with possible currency
 * indicators and separators
 */
function convertPriceStringToNumber(price){
	return Number(price.replace(/[^0-9\.]+/g,""));
}

/**
 * Parses a csv string of ids (eg, 1,2,3) into a array containing numeric
 * value of each id
 * @param ids
 * @param delimeter
 */
function parseCsvIdsToNumericArray(ids,delimeter){
	return ids.split(delimeter).map(Number);
}


function createCookie(name,value,days)
{
	var expires = '';
	if (days) {
		var date = new Date();
		date.setDate(date.getDate() + days);
		expires = "; expires=" + date.toGMTString();
	}
	document.cookie = name + "=" + value + expires+"; path=/";
}

function acceptCookieUsage()
{
	if (config.ShowCookieWarning && document.cookie.indexOf('ACCEPT_COOKIE_USAGE') == -1) {
		$.ajax({
			url: config.ShopPath + '/remote.php?w=getCookieNotification',
			type: 'GET',
			dataType: 'JSON',
			success: function(response){
				if(response.html != ''){
					$('body').prepend(response.html);
				}
			}
		});
	}
}

/**
 * Changes social sharing tabs and content within sharing widget
 * @param {String} serviceId The ID of the sharing service to be used.
 * @param {Number} productId The ID of the product to be shared.
 */
function switchSocialSharingTabs(serviceId, productId) {
	$('.sharingTab').removeClass('active');
	$('.' + serviceId).addClass('active');

	updateShareButton(serviceId, productId);
	updateSocialSharingPanel(productId);
}

/**
 * Get the currently active social sharing tab.
 * @return {String} The ID of the currently active social sharing service.
 */
function activeSocialSharingServiceId()
{
	return $('.sharingTab.active').attr('id').replace('tab', '');
}

/**
 * Update the share button to share the given product on the given service.
 * @param {String} serviceId The service on which to share the given product.
 * @param {Number} productId The ID of the product to share.
 */
function updateShareButton(serviceId, productId) {
	$('.sharebutton a').attr('href', sharingData[productId][serviceId]['sharingLink']);
}

/**
 * Preload images and build the social sharing panel.
 * @param {Number} shareProductId
 */
function initSocialSharingPanel(shareProductId)
{
	var productCount = objectLength(sharingData);
	var loadedProductCount = 0;
	$.each(sharingData, function(productId, services) {
		var serviceCount = objectLength(services);
		var loadedServiceCount = 0;
		$.each(services, function(serviceId, productSharingDetails) {
			loadedServiceCount++;
			productSharingDetails['imageElement'] = $("<img/>")
					.attr("src", productSharingDetails['image'])
					.attr("alt", "");
			if (loadedServiceCount == serviceCount) {
				loadedProductCount++;
				if (loadedProductCount == productCount) {
					switchSocialSharingTabs(activeSocialSharingServiceId(), shareProductId);
				}
			}
		});
	});
}

/**
 * Calculate the number of owned properties of an object.
 * @param object
 * @return {Number}
 */
function objectLength(object)
{
	if (typeof object != "object") {
		return 0;
	}
	var count = 0;
	for (i in object) {
		if (object.hasOwnProperty(i)) {
			count++;
		}
	}
	return count;
}

/**
 * Updates sharing panel with new product details.
 * Used when multiple products exist (eg orders) to swap the product to be shared
 * @param productId
 */
function updateSocialSharingPanel(productId) {
	shareProductId = productId;
	var activeTab = activeSocialSharingServiceId();
	$('#tabcontent .photo').empty().append(sharingData[productId][activeTab]['imageElement']);
	$('#shareDescription').text(sharingData[productId][activeTab]['description']);
	updateShareButton(activeTab, productId);
	$('#shareText').text(sharingData[productId][activeTab]['shareText']);

	updateSharingDataChoices(productId);

	$.iModal.close();
}

function updateSharingDataChoices(productId) {
	$('#SharingDataChoices #productlist').empty();
	$.each(sharingData, function(index, value) {
		if (index != productId) {
			var productAnchor = $("<a/>").attr("href", "javascript:updateSocialSharingPanel("+index+")");
			productAnchor.append(value[activeSocialSharingServiceId()]['imageElement']);
			var productListItem = $("<li/>").append(productAnchor);
			$('#SharingDataChoices #productlist').append(productListItem);
		}
	});
}

/**
 * View modal overlay of product image choices
 */
function showProductChoices() {
	$.iModal({
		type: 'inline',
		inline: '#ChooseAnotherProduct',
		width: 620,
		height: 200,
		title: getLang('ChooseAnotherProduct')
	});

	updateSharingDataChoices(shareProductId);

	var productCount = objectLength(sharingData);
	var sharingDataWrapper = $("#SharingDataWrapper");
	var sharingDataChoices = $("#SharingDataChoices");
	$("#SharingDataWrapper").parent('div').parent('div').parent('div').parent('div').addClass('ProductShareModal');
	if (productCount < 6) {
		$('#SharingDataWrapper #ImageScrollPrev').hide();
		$('#SharingDataWrapper #ImageScrollNext').hide();
		sharingDataWrapper.addClass('no-scroll');
	} else {
		sharingDataChoices.jCarouselLite({
			btnNext: ".next",
			btnPrev: ".prev",
			visible: 4,
			scroll: 2,
			circular: false,
			speed: 200
		});
	}

}


function triggerStorefrontEvent(name, data, complete) {
  var payload = {
    name: name,
    data: data
  };

  $.ajax(config.ShopPath + '/remote.php?w=event', {
    data: JSON.stringify(payload),
    contentType: "application/json",
    type: "POST",
    dataType: "json",
    accepts: {
      json: 'application/json'
    },
    complete: complete
  });
}

function toggleSearchPanel(){
		$('#SearchForm').fadeToggle();
}

(function($) {
	if ('undefined' !== typeof $) {
		$.ajaxSetup({ cache: true });
	}
})($);

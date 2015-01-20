/**
 * All functions have been moved to product.functions.js
 * This is because this file was used in the control panel as well as the front end, but the
 * below initialization code is only meant for the frontend.
 */
$(document).ready(function() {
	initiateImageCarousel();
	initiateImageZoomer();

	/**
	 * ISC-3635 Force the mouseover event on the first image.
	 * It was causing some issues on Chrome where mouse over the main image then first tiny image was breaking.
	 * This is not ideal, but it works.
	 */
	$(".ProductTinyImageList a:first").trigger('mouseover');

	if(typeof(HideProductTabs) != 'undefined' && HideProductTabs == 0) {
		GenerateProductTabs();
		if (CurrentProdTab && CurrentProdTab != "") {
			ActiveProductTab(CurrentProdTab);
			document.location.href = '#ProductTabs';
		}
	} else {
		$('.ProductSectionSeparator').show();
	}

	// are there any videos in the middle column?
	if($('.videoRow').size() > 0) {
		$('.videoRow').bind('click', function () {
			var videoId = $(this).attr('id').replace('video_', '');
			$('#FeaturedVideo').html('<object width="398" height="330">'
				+ '<param name="movie" value="//www.youtube.com/v/' + videoId + '?fs=1"></param>'
				+ '<param name="allowFullScreen" value="true"></param>'
				+ '<param name="allowscriptaccess" value="always"></param>'
				+ '<embed src="//www.youtube.com/v/'  + videoId + '?&fs=1&autoplay=1" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" width="398" height="330"></embed>'
				+ '</object>'
			);
			selectCurrentVideo(videoId);
		});
	}

	// are there any videos in the left or right columns?
	if($('.sideVideoRow').size() > 0) {
		$('.sideVideoRow a').bind('click', function () {
			// grab the video id out of the tag id
			var videoId = $(this).attr('id').replace('sidevideo_', '');

			if(config.ProductImageMode == 'lightbox') {
				// we need to hide any objects on the page as they appear onto of our modal window
				$('#VideoContainer object').css('visibility', 'hidden');

				$.iModal({
					data: '<object width="398" height="330">'
						+ '<param name="movie" value="//www.youtube.com/v/' + videoId + '?fs=1"></param>'
						+ '<param name="allowFullScreen" value="true"></param>'
						+ '<param name="allowscriptaccess" value="always"></param>'
						+ '<embed src="//www.youtube.com/v/'  + videoId + '?&fs=1&autoplay=1" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" width="398" height="330"></embed>'
						+ '</object>',
					title: $(this).find('img').attr('title'),
					width: 510,
					buttons: '<input type="button" onclick="$.iModal.close();" value="  ' + lang.Close +'  " />',
					onBeforeClose: function() {
						// reshow any objects that were hidden
						$('#VideoContainer object').css('visibility', 'visible');
					}
				});
			} else {
				showVideoPopup(videoId);
			}
			return false;
		});
	}

	// disable all but the first variation box
	$(".VariationSelect:gt(0)").attr('disabled', 'disabled');

	var prodVarSelectionMap = {}
	$(".VariationSelect").change(function() {
		// cache a map of currently selected values.
		var mapIndex = 0;
		$('.VariationSelect').each(function() {
			prodVarSelectionMap[mapIndex] = this.value;
			mapIndex++;
		});

		// get the index of this select
		var index = $('.VariationSelect').index($(this));

		// deselected an option, disable all select's greater than this
		if (this.selectedIndex == 0) {
			$('.VariationSelect:gt(' + index + ')').attr('disabled', 'disabled')
			updateSelectedVariation($('body'));
			return;
		}
		else {
			// disable selects greater than the next
			$('.VariationSelect:gt(' + (index + 1) + ')').attr('disabled', 'disabled')
		}

		//serialize the options of the variation selects
		var optionIds = '';
		$('.VariationSelect:lt(' + (index + 1) + ')').each(function() {
			if (optionIds != '') {
				optionIds += ',';
			}

			optionIds += $(this).val();
		});
		// request values for this option
		$.getJSON(
			'/remote.php?w=GetVariationOptions&productId=' + productId + '&options=' + optionIds,
			function(data) {
				// were options returned?
				if (data.hasOptions) {
					// load options into the next select, disable and focus it
					$('.VariationSelect:eq(' + (index + 1) + ') option:gt(0)').remove();
					$('.VariationSelect:eq(' + (index + 1) + ')').append(data.options).attr('disabled', false).focus();

					// auto select previously selected option, and cascade down, if possible
					var preVal = prodVarSelectionMap[(index + 1)];
					if (preVal != '') {
						var preOption = $('.VariationSelect:eq(' + (index + 1) + ') option[value=' +preVal+']');
						if (preOption) {
							preOption.attr('selected', true);
							$('.VariationSelect:eq(' + (index + 1) + ')').trigger('change');
						}
					}
				}
				else if (data.comboFound) { // was a combination found instead?
					// display price, image etc
					updateSelectedVariation($('body'), data, data.combinationid);
				}
			}
		);
	});

	//radio button variations
	$('.ProductOptionList input[type=radio]').click(function() {
		//current selected option id
		var optionId = $(this).val();
		// request values for this option
		$.getJSON(
			'/remote.php?w=GetVariationOptions&productId=' + productId + '&options=' + optionId,
			function(data) {
				if (!data) {
					return;
				}

				if (data.comboFound) { // was a combination found instead?
					// display price, image etc
					updateSelectedVariation($('body'), data, data.combinationid);
				}
			}
		);
	});
});

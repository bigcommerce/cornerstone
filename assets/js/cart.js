var Cart = {
	ToggleShippingEstimation: function()
	{
		$('.EstimatedShippingMethods').hide();
		
		$('.EstimateShipping').slideToggle(300);
		$('.EstimateShippingLink').toggle();
		$('.EstimateShipping select:eq(0)').focus();
		$('#shippingZoneState').uniform();
		if ($('#shippingZoneState').is(':hidden')) {
			$('#uniform-shippingZoneState').hide();
		}
		
		
	},

	EstimateShipping: function()
	{
		if ($('#shippingZoneCountry').val() == 0) {
			alert(lang.SelectCountry);
			$('#shippingZoneCountry').focus();
			return;
		}

		if ($('#shippingZoneState').is(':visible') && $('#shippingZoneState').val() == 0) {
			alert(lang.SelectState);
			$('#shippingZoneState').focus();
			return;
		}

		if ($.trim($('#shippingZoneZip').val()) == '') {
			alert(lang.EnterZip);
			$('#shippingZoneZip').focus();
			return;
		}

		$('.EstimatedShippingMethods').hide();
		$('.EstimateShipping .EstimateShippingButtons span').hide();
		$('.EstimateShipping .EstimateShippingButtons input')
			.data('oldVal', $('.EstimateShipping .EstimateShippingButtons input').val())
			.val(lang.Calculating)
			.attr('disabled', true)
		;
		$.ajax({
			url: 'remote.php',
			type: 'post',
			data: {
				w: 'getShippingQuotes',
				countryId: $('#shippingZoneCountry').val(),
				stateId: $('#shippingZoneState').val(),
				stateName: escape($('#shippingZoneStateName').val()),
				zipCode: $('#shippingZoneZip').val()
			},
			success: function(data)
			{
				$('.EstimatedShippingMethods .ShippingMethodList').html(data);
				$('.EstimatedShippingMethods').show();
				$('.EstimateShipping .EstimateShippingButtons span').show();
				$('.EstimateShipping .EstimateShippingButtons input')
					.val($('..EstimateShipping .EstimateShippingButtons input').data('oldVal'))
					.attr('disabled', false)
				;
			}
		});
	},

	ToggleShippingEstimateCountry: function()
	{
		var countryId = $('#shippingZoneCountry').val();
		$.ajax({
			url: 'remote.php',
			type: 'post',
			data: 'w=countryStates&c='+countryId,
			success: function(data)
			{
				$('#shippingZoneState option:gt(0)').remove();
				var states = data.split('~');
				var numStates = 0;
				for(var i =0; i < states.length; ++i) {
					vals = states[i].split('|');
					if(!vals[0]) {
						continue;
					}
					$('#shippingZoneState').append('<option value="'+vals[1]+'">'+vals[0]+'</option>');
					++numStates;
				}

				if(numStates == 0) {
					$('#shippingZoneState').hide();
					$('#shippingZoneStateName').show();
					$('#shippingZoneStateRequired').hide();
					
					$('#uniform-shippingZoneState').hide();
				}
				else {
					$('#shippingZoneState').show();
					$('#shippingZoneStateName').hide();
					$('#shippingZoneStateRequired').show();
					
					$.uniform.update(); 
					$('#uniform-shippingZoneState').show();
					
					
					
				}
				$('#shippingZoneState').val('0');
			}
		});
	},

	UpdateShippingCost: function()
	{
		var returnVal = true;
		var method = $('.EstimatedShippingMethods table').each(function() {
			var method = $('input[type=radio]:checked', this).val();
			if(typeof(method) == 'undefined' || method == '') {
				alert(lang.ChooseShippingMethod);
				$('input[type=radio]:eq(0)', this).focus();
				returnVal = false;
				return returnVal;
			}
		});

		if(returnVal == false) {
			return returnVal;
		}

		$('#cartForm').submit();
	},

	RemoveItem: function(itemId)
	{
		if(confirm(lang.CartRemoveConfirm)) {
			document.location.href = "cart.php?action=remove&item="+itemId;
		}
	},

	UpdateQuantity: function()
	{
		$('#cartForm').submit();
	},

	ValidateQuantityForm: function(form)
	{
		var valid = true;
		var qtyInputs = $(form).find('input.qtyInput');
		qtyInputs.each(function() {
			if(isNaN($(this).val()) || $(this).val() < 0) {
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

		return true;
	},

	CheckCouponCode: function()
	{
		if($('#couponcode').val() == '') {
			alert(lang.EnterCouponCode);
			$('#couponcode').focus();
			return false;
		}
	},

	CheckGiftCertificateCode: function()
	{
		if($('#giftcertificatecode').val() == '') {
			alert(lang.EnterGiftCertificateCode);
			$('#giftcertificatecode').focus();
			return false;
		}
	},

	ManageGiftWrapping: function(itemId)
	{
		$.iModal({
			type: 'ajax',
			url: 'remote.php?w=selectGiftWrapping&itemId='+itemId
		});
	},

	ToggleGiftWrappingType: function(option)
	{
		if($(option).hasClass('HasPreview')) {
			$('.GiftWrappingPreviewLinks').hide();
			$('#GiftWrappingPreviewLink'+$(option).val()).show();
		}
		else {
			$('.GiftWrappingPreviewLinks').hide();
		}

		if($(option).hasClass('AllowComments')) {
			$(option).parents('.WrappingOption').find('.WrapComments').show();
		}
		else {
			$(option).parents('.WrappingOption').find('.WrapComments').hide();
		}
	},

	ToggleMultiWrapping: function(value)
	{
		if(value == 'same') {
			$('.WrappingOptionsSingle').show();
			$('.WrappingOptionsMultiple').hide();
		}
		else {
			$('.WrappingOptionsSingle').hide();
			$('.WrappingOptionsMultiple').show();
		}
	},

	RemoveGiftWrapping: function(itemId)
	{
		if(confirm(lang.ConfirmRemoveGiftWrapping)) {
			return true;
		}
		else {
			return false;
		}
	},

	ShowEditOptionsInCartForm: function(itemId)
	{
		var modalOptions = {
			type: 'ajax',
			url: 'remote.php?w=editconfigurablefieldsincart&itemid='+itemId
		};

		if (typeof config == 'object' && config.isMobile) {
			modalOptions.width = 300;
		}

		$.iModal(modalOptions);
	},

	saveItemCustomizations: function()
	{
		if (!CheckProductConfigurableFields($('#CartEditProductFieldsForm'))) {
			return false;
		}

		// validate the attributes
		var attributesValidated = $('#CartEditProductFieldsForm')
			.validate()
			.form();

		if (!attributesValidated) {
			return false;
		}

		return true;
	},

	DeleteUploadedFile: function(fieldid, itemid)
	{
		if(confirm(lang.DeleteProductFieldFileConfirmation)) {
			$.ajax({
				url: 'remote.php',
				type: 'post',
				data: 'w=deleteuploadedfileincart&field='+fieldid+'&item='+itemid,
				success: function(data) {
					document.getElementById('CurrentProductFile_'+fieldid).value = '';
					$('#CartFileName_'+fieldid).hide();
				}
			});
		}
		return;
	},

	ReloadCart: function()
	{
		window.location = "cart.php";
	}

};
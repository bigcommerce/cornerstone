
var FormField = {
	'GetField':
		function(fieldId)
		{
			if (isNaN(fieldId) && typeof(fieldId) == 'object') {
				fieldId = parseInt(($(fieldId).attr('id')).substr(10));
			}

			if (fieldId == '' || isNaN(fieldId)) {
				return false;
			}

			var field = $('#FormField_' + fieldId);
			var length = $(field).length;

			if (length == 0) {
				return false;
			} else if (length > 1) {
				field = $(field).get(length-1);
			}

			return $(field);
		},

	'GetFieldByPrivateId':
		function(formId, privateId)
		{
			if (isNaN(formId) || formId < 1 || privateId == '') {
				return false;
			}

			var field = $('.FormFieldPrivateId[value=' + privateId + ']').parent('*:has(.FormFieldFormId[value=' + formId + '])').find('.FormField');
			if (!field.length) {
				return false;
			}

			return field[0];
		},

	'GetFieldByLabel':
		function(formId, label)
		{
			if (isNaN(formId) || formId < 1 || label == '') {
				return false;
			}

			var formfield = false;

			$('.FormField').each(
				function()
				{
					if (FormField.GetFieldFormId(this) == formId && FormField.GetLabel(this) == label) {
						formfield = $(this);
					}
				}
			);

			return formfield;
		},

	'GetFieldType':
		function(field)
		{
			var dd = FormField.GetFieldDefinitionData(field);

			if (!dd) {
				return '';
			}

			return $('.FormFieldType', dd).val();
		},

	'GetFieldId':
		function(field)
		{
			var dd = FormField.GetFieldDefinitionData(field);

			if (!dd) {
				return '';
			}

			return $('.FormFieldId', dd).val();
		},

	'GetFieldFormId':
		function(field)
		{
			var dd = FormField.GetFieldDefinitionData(field);

			if (!dd) {
				return '';
			}

			return $('.FormFieldFormId', dd).val();
		},

	'GetSelectorChoosePrefix':
		function(field)
		{
			var dd = FormField.GetFieldDefinitionData(field);

			if (!dd) {
				return '';
			}

			if ($('.FormFieldChoosePrefix', dd).length) {
				return $('.FormFieldChoosePrefix', dd).val();
			}

			return '';
		},

	'GetFieldPrivateId':
		function(field)
		{
			var dd = FormField.GetFieldDefinitionData(field);

			if (!dd) {
				return '';
			}

			return $('.FormFieldPrivateId', dd).val();
		},

	'GetFieldDefinitionData':
		function(field)
		{
			// Try by definition data first
			var dd = $(field).parents('dd');

			// If nothing, fall back to the new form layout
			if (!dd.length) {
				dd = $(field).parent('div.value');
			}

			if (!dd.length) {
				return false;
			}

			return dd;
		},

	'GetFieldDefinitionTag':
		function(field)
		{
			var dd = FormField.GetFieldDefinitionData(field);
			if (!dd) {
				return false;
			}

			var dt = dd.prev('dt');

			// Could be a new form style?
			if (!dt.length) {
				dt = dd.prev('label');
			}

			if(!dt) {
				return false;
			}

			return dt;
		},

	'GetValue':
		function(fieldId)
		{
			var field = FormField.GetField(fieldId);

			if (!field) {
				return '';
			}

			switch (FormField.GetFieldType(field).toLowerCase()) {
				case 'radioselect':
				case 'checkboxselect':
					var options = [];
					$('.FormFieldOption:checked', field).each(function() {
						options[options.length] = $(this).val();
					});

					if (options.length == 0) {
						if (FormField.GetFieldType(field).toLowerCase() == 'radioselect') {
							return '';
						} else {
							return [];
						}
					}

					if (FormField.GetFieldType(field).toLowerCase() == 'radioselect') {
						options = options[0];
					}

					return options;
					break;

				case 'datechooser':
					var day = $('.FormFieldDay', field).val();
					var month = $('.FormFieldMonth', field).val();
					var year = $('.FormFieldYear', field).val();

					if (day == '' || month == '' || year == '') {
						return '';
					}

					if (day.length == 1) {
						day = '0' + day;
					}

					if (month.length == 1) {
						month = '0' + month;
					}

					return year + '-' + month + '-' + day;
					break;

				default:
					return $(field).val();
					break;
			}
		},

	'GetValues':
		function(formIdx, privateOnly)
		{
			var values = [];

			if (typeof(privateOnly) == 'undefined' || privateOnly !== true) {
				privateOnly = false;
			}

			if (!isNaN(formIdx)) {
				formIdx = [formIdx];
			}

			for (var i = formIdx.length; i--;) {
				var fieldFormId = formIdx[i];

				$('.FormFieldFormId[value=' + fieldFormId + ']').parent('dd, div.value').find('.FormField').each(
					function()
					{
						if (privateOnly && FormField.GetFieldPrivateId(this) == '') {
							return;
						}

						for (var i=0; i<formIdx.length; i++) {
							values[values.length] = {
								'field': $(this),
								'fieldId': FormField.GetFieldId(this),
								'formId': fieldFormId,
								'privateId': FormField.GetFieldPrivateId(this),
								'label': FormField.GetLabel(this),
								'value': FormField.GetValue(this)
							};
						}
					}
				);
			}

			return values;
		},

	'SetValue':
		function(fieldId, val, options)
		{
			var field = FormField.GetField(fieldId);

			if (!field) {
				return false;
			}

			if (typeof(options) == 'undefined') {
				options = {};
			}

			switch (FormField.GetFieldType(field).toLowerCase()) {
				case 'selectortext':
					if (typeof(options.display) == 'undefined') {
						options.display = 'select';
					}
					if (options.display != field.get(0).tagName.toLowerCase()) {
						if (options.display == 'select') {
							var input = $('<select />');
						} else {
							var input = $('<input type="text" />');
						}

						$(input).attr('name', $(field).attr('name'));
						$(input).attr('class', $(field).attr('class'));
						$(input).attr('id', $(field).attr('id'));
						$(input).attr('style', $(field).attr('style'));
						$(field).replaceWith(input);

						if (options.display !== 'select') {
							var fieldId = FormField.GetFieldId(fieldId);
							var formId = FormField.GetFieldFormId(fieldId);

							$(input).after('<input type="hidden" name="FormFieldIsText[' + formId + '][' + fieldId + ']" value="1" />');
						}
					}
					else {
						var input = field;
					}

					if (typeof(options.options) !== 'undefined') {
						FormField.SetOptions(fieldId, options.options);
					}

					$(input).val(val);

					break;

				case 'radioselect':
				case 'checkboxselect':
					if (typeof(options.options) !== 'undefined') {
						FormField.SetOptions(fieldId, options.options);
					}

					if (typeof(val) == 'string') {
						val = [val];
					} else if (FormField.GetFieldType(field).toLowerCase() == 'radioselect' && val.length > 1) {
						val.length = 1;
					}

					$('.FormFieldOption', field).each(
						function()
						{
							var checked = false;

							for (var i=0; i<val.length; i++) {
								if ($(this).attr('value') == val[i]) {
									checked = true;
									break;
								}
							}
							$(this).attr('checked', checked);
						}
					);

					break;

				case 'datechooser':
					if (val.indexOf('-') == -1) {
						return false;
					}

					var tmpDate = val.split('-');

					if (tmpDate.length !== 3) {
						return false;
					}

					var year = parseInt(tmpDate[0], 10);
					var month = parseInt(tmpDate[1], 10);
					var day = parseInt(tmpDate[2], 10);

					if (isNaN(day) || isNaN(month) || isNaN(year)) {
						return false;
					}

					$('.FormFieldYear', field).val(year);
					$('.FormFieldMonth', field).val(month);
					$('.FormFieldDay', field).val(day);

					break;

				default:
					if (FormField.GetFieldType(field).toLowerCase() == 'singleselect' && typeof(options.options) !== 'undefined') {
						FormField.SetOptions(fieldId, options.options);
					}

					$(field).val(val);
			}
		},

	'SetValueByIndex':
		function(fieldId, indexes, checked)
		{
			var field = FormField.GetField(fieldId);

			if (!field) {
				return false;
			}

			if (FormField.GetFieldType(field).toLowerCase() !== 'checkboxselect' || FormField.GetFieldType(field).toLowerCase() == 'radioselect') {
				return true;
			}

			if (typeof(indexes) !== 'object') {
				indexes = [indexes];
			}

			if (indexes.length == 0) {
				return true;
			}

			if (typeof(checked) == 'undefined') {
				checked = true;
			}

			if (checked !== true) {
				checked = false;
			} else {
				checked = true;
			}

			var i=0;

			$('input', field).each(
				function()
				{
					for (var n=0; n<indexes.length; n++) {
						if (indexes[n] == i) {
							$(this).attr('checked', checked);
							break;
						}
					}

					i++
				}
			);
		},

	'GetOptions':
		function(fieldId, selectedOnly)
		{
			var field = FormField.GetField(fieldId);

			if (!field) {
				return false;
			}

			if (typeof(selectedOnly) == 'undefined' || selectedOnly !== true) {
				selectedOnly = false;
			}

			switch (FormField.GetFieldType(field).toLowerCase()) {
				case 'selectortext':
				case 'singleselect':
					if($(field).get(0).tagName == 'input') {
						return [];
					}

					var options = [];

					$('option', field).each(
						function()
						{
							if ($(this).val() !== '') {
								options[options.length] = $(this).val();
							}
						}
					);

					return options;
					break;

				case 'radioselect':
				case 'checkboxselect':
					var options = [];

					$('input', field).each(
						function()
						{
							if ($(this).val() !== '') {
								options[options.length] = $(this).val();
							}
						}
					);

					return options;
					break;

				default:
					return [];
			}
		},

	'SetOptions':
		function(fieldId, options)
		{
			var field = FormField.GetField(fieldId);

			if (!field) {
				return false;
			}

			if (typeof(options) == 'string') {
				options = [options];
			}

			switch (FormField.GetFieldType(field).toLowerCase()) {
				case 'selectortext':
				case 'singleselect':
					var chooseOption = FormField.GetSelectorChoosePrefix(field);

					$(field).empty();

					if (chooseOption !== '') {
						$(field).append('<option value="">' + chooseOption + '</option>');
					}

					for (var i=0; i<options.length; i++) {
						$(field).append('<option value="' + options[i] + '">' + options[i] + '</option>');
					}

					break;

				case 'radioselect':
				case 'checkboxselect':
					field.empty();

					var id = $(select).attr('id');
					var name = $(select).attr('name');

					if (FormField.GetFieldType(field).toLowerCase() == 'radioselect') {
						var shell = '<input type="radio" />';
					} else {
						var shell = '<input type="checkbox" />';
					}

					for (var i=0; i<options.length; i++) {
						if (i > 0) {
							$(select).append('<br />');
						}

						var label = $(select).append('<label>');
						$(label).attr('for', id + '_' + i);

						var option = $(label).append(shell);
						$(option).attr('id', id + '_' + i);
						$(option).attr('name', name + '_[' + i + ']');
						$(option).val(options[i]);

						$(label).append(' ' + options[i]);
					}

					break;
			}
		},

	'GetLabel':
		function(field)
		{
			var dt = FormField.GetFieldDefinitionTag(field);

			if (!dt) {
				return false;
			}

			var label = $('.FormFieldLabel', dt).text();
			label = label.replace(/:/, '');

			return label;
		},

	'IsRequired':
		function(field)
		{
			var dt = FormField.GetFieldDefinitionTag(field);

			if (!dt) {
				return false;
			}

			var span = $('.FormFieldRequired', dt);

			if ($(span).css('visibility') == 'hidden') {
				return false;
			}

			return true;
		},

	'SetRequired':
		function(fieldId, status)
		{
			var field = FormField.GetField(fieldId);

			dt = FormField.GetFieldDefinitionTag(field);

			if (!dt) {
				return false;
			}

			var span = $('.FormFieldRequired', dt);

			if (typeof(status) == 'undefined' || status !== true) {
				status = false;
			}

			if (status) {
				$(span).css('visibility', 'visible');
			} else {
				$(span).css('visibility', 'hidden');
			}

			return true;
		},

	'SetDisabled':
		function(field, disabled)
		{
			field = FormField.GetField(field);

			if (!field) {
				return false;
			}

			if (typeof(disabled) == 'undefined' || disabled !== true) {
				status = false;
			}

			switch (FormField.GetFieldType(field).toLowerCase()) {
				case 'radioselect':
				case 'checkboxselect':
					$('input', field).each(
						function()
						{
							$(this).attr('disabled', disabled);
						}
					);

					break;

				default:
					$(field).attr('disabled', disabled);
					break;
			}

			return true;
		},

	'BindEvent':
		function(field, event, func, args)
		{
			field = FormField.GetField(field);

			if (!field || typeof(event) == 'undefined' || event == '' || typeof(func) !== 'function') {
				return false;
			}

			if (typeof(args) == 'undefined') {
				args = {'fieldId': FormField.GetFieldId(field)};
			}

			switch (FormField.GetFieldType(field).toLowerCase()) {
				case 'radioselect':
				case 'checkboxselect':
					$('input', field).each(
						function()
						{
							$(this).bind(event, args, func);
						}
					);

					break;

				default:
					$(field).bind(event, args, func);
					break;
			}

			return true;
		},

	'UnBindEvent':
		function(field, event, func)
		{
			field = FormField.GetField(field);

			if (!field || typeof(event) == 'undefined' || event == '') {
				return false;
			}

			switch (FormField.GetFieldType(field).toLowerCase()) {
				case 'radioselect':
				case 'checkboxselect':
					$('input', field).each(
						function()
						{
							$(this).unbind(event, func);
						}
					);

					break;

				default:
					$(field).unbind(event, func);
					break;
			}

			return true;
		},

	'Focus':
		function(field)
		{
			field = FormField.GetField(field);

			if (!field) {
				return;
			}

			var selected = null;
			var doSelect = true;

			switch (FormField.GetFieldType(field).toLowerCase()) {
				case 'radioselect':
				case 'checkboxselect':
					selected = $('input:first', field);
					doSelect = false;
					break;

				case 'datechooser':
					selected = $('.FormFieldMonth', field);
					break;

				default:
					selected = field;
			}

			if (selected == null) {
				return;
			}

			if (doSelect) {
				$(selected).select();
			}

			$(selected).focus();
		},

	'Hide':
		function(field)
		{
			var dd = FormField.GetFieldDefinitionData(field);
			var dt = FormField.GetFieldDefinitionTag(field);

			if (!dd || !dt) {
				return false;
			}

			$(dd).hide();
			$(dt).hide();
		},

	'Show':
		function(field)
		{
			var dd = FormField.GetFieldDefinitionData(field);
			var dt = FormField.GetFieldDefinitionTag(field);

			if (!dd || !dt) {
				return false;
			}

			$(dd).show();
			$(dt).show();
		},

	'Validate':
		function(field)
		{
			field = FormField.GetField(field);

			if (!field) {
				return false;
			}

			var rtn = {'status': true, 'msg': ''};
			var val = FormField.GetValue(field);
			var type = FormField.GetFieldType(field).toLowerCase();

			if (FormField.IsRequired(field) && val == '') {
				if (type == 'selectortext' && $(field).attr('type') && $(field).attr('type').toLowerCase() == 'text') {
					// Do nothing
				} else if (type == 'password') {
					// same here
				} else if (type == 'checkboxselect' || type == 'radioselect') {
					rtn.msg = lang.CustomFieldsValidationOptionRequired;
				} else {
					rtn.msg = lang.CustomFieldsValidationRequired;
				}
			}

			if (rtn.msg == '') {
				switch (type) {
					case 'numberonly':

						if (isNaN(val)) {
							rtn.msg = lang.CustomFieldsValidationNumbersOnly;
						} else {

							var dd = FormField.GetFieldDefinitionData(field);
							var limitfrom = $('.FormFieldLimitFrom', dd);
							var limitto = $('.FormFieldLimitTo', dd);

							if ($(limitfrom).length > 0 && parseInt(val, 10) < parseInt($(limitfrom).val(), 10)) {
								rtn.msg = lang.CustomFieldsValidationNumbersToLow;
								rtn.msg = rtn.msg.replace(/%d/, $(limitfrom).val());
							} else if ($(limitto).length > 0 && parseInt(val, 10) > parseInt($(limitto).val(), 10)) {
								rtn.msg = lang.CustomFieldsValidationNumbersToHigh;
								rtn.msg = rtn.msg.replace(/%d/, $(limitto).val());
							}
						}

						break;

					case 'datechooser':

						var day = $('.FormFieldDay', field).val();
						var month = $('.FormFieldMonth', field).val();
						var year = $('.FormFieldYear', field).val();

						if (day+''+month+''+year !== '' && (day == '' || month == '' || year == '')) {
							rtn.msg = lang.CustomFieldsValidationDateInvalid;
						}

						var dd = FormField.GetFieldDefinitionData(field);
						var limitfrom = $('.FormFieldLimitFrom', dd);
						var limitto = $('.FormFieldLimitTo', dd);

						if ($(limitfrom).length == 0 || $(limitto).length == 0) {
							break;
						}

						var thisValBits = val.split('-');
						var limitFromBits = $(limitfrom).val().split('-');
						var limitToBits = $(limitto).val().split('-');

						jQuery.each(thisValBits, function(i) { thisValBits[i] = parseInt(thisValBits[i], 10); });
						jQuery.each(limitFromBits, function(i) { limitFromBits[i] = parseInt(limitFromBits[i], 10); });
						jQuery.each(limitToBits, function(i) { limitToBits[i] = parseInt(limitToBits[i], 10); });

						var thisDate = new Date(thisValBits[0], thisValBits[1]-1, thisValBits[2]);
						var limitFromDate = new Date(limitFromBits[0], limitFromBits[1]-1, limitFromBits[2]);
						var limitToDate = new Date(limitToBits[0], limitToBits[1]-1, limitToBits[2]);

						if (thisDate.getTime() < limitFromDate.getTime()) {
							rtn.msg = lang.CustomFieldsValidationDateToLow;
							rtn.msg = rtn.msg.replace(/%s\./, limitFromDate.toLocaleDateString() + '.');
						} else if (thisDate.getTime() > limitToDate.getTime()) {
							rtn.msg = lang.CustomFieldsValidationDateToHigh;
							rtn.msg = rtn.msg.replace(/%s\./, limitToDate.toLocaleDateString() + '.');
						}

						break;

					case 'password':
						if (FormField.IsRequired(field)) {
							if ($(field).attr('type') == 'text' && val == '') {
								rtn.msg = lang.CustomFieldsValidationRequired;
							} else {
								var dd = FormField.GetFieldDefinitionData(field);
								var alreadySet = $('.FormFieldAlreadySet', dd);

								if (($(alreadySet).length == 0 || $(alreadySet).val() == '') && val == '') {
									rtn.msg = lang.CustomFieldsValidationRequired;
								}
							}
						}

						break;
				}
			}

			if (rtn.msg !== '') {
				rtn.msg = rtn.msg.replace(/'%s'/, "'" + FormField.GetLabel(field) + "'");
				rtn.status = false;
			}

			return rtn;
		}
}

var FormFieldEvent = {
	'SingleSelectPopulateStates':
		function(event)
		{
			var countryId = event.data.countryId;
			var countryName = FormField.GetValue(countryId);
			var stateId = event.data.stateId;
			var selectedState = '';
			var inOrdersAdmin = false;

			if (typeof(event.data.selectedState) !== 'undefined') {
				selectedState = event.data.selectedState;
			}

			if (typeof(event.data.inOrdersAdmin) !== 'undefined') {
				inOrdersAdmin = event.data.inOrdersAdmin;
			}

			if (countryName == '') {
				var options = {
					'display': 'option'
				};

				FormField.SetValue(stateId, '', options);
				return;
			}

			$.ajax({
				'url': 'remote.php',
				'type': 'post',
				'data': {
						'w': 'getStates',
						'countryName': countryName
					},
				'success':
					function(data)
					{
						if ($('status', data).text() == '0') {
							return;
						}

						var states = [];

						$('options option', data).each(
							function()
							{
								states[states.length] = $('name', this).text();
							}
						);

						if (states.length == 0) {
							var options = {
								'display': 'option'
							};

							// make the state field not required
							FormField.SetRequired(stateId, false);
						} else {
							var options = {
								'display': 'select',
								'options': states
							};

							// make the state field required
							FormField.SetRequired(stateId, true);
							
							
							// $('select.JSHidden.UniApplied').prev('span').remove();  
							// $('select.JSHidden.UniApplied').unwrap().removeClass('.UniApplied');
							// $('select.JSHidden.UniApplied').parent('.selector').after().removeClass('.UniApplied');
							// $('select.JSHidden').not('.UniApplied').uniform();
							 
							
							
						}

						FormField.SetValue(stateId, selectedState, options);

						if (inOrdersAdmin && typeof(OrderManager) !== 'undefined') {
							var orderArgs = {
								'data': {
									'fieldId': stateId
								}
							};

							OrderManager.BindAddressSyncEventsCallback(orderArgs);
						}
					}
			});
		},

	'CheckBoxShipToAddress':
		function(event)
		{
			if (typeof(event.data.fieldId) == 'undefined') {
				return;
			}

			if (FormField.GetValue(event.data.fieldId).length > 0) {
				$('.billingButton').val(lang.BillAndShipToAddress);
				$('.shippingButton').val(lang.ShipToThisAddress);
				$('#ship_to_billing_existing').attr('checked', true);
			}
			else {
				$('.billingButton').val(lang.BillToThisAddress);
				$('.shippingButton').val(lang.ShipToThisAddress);
				$('#ship_to_billing_existing').attr('checked', false);
			}
		}
}

$(document).ready(function() {
	$('.FormField.JSHidden').show();
});

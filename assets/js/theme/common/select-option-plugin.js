/**
 * Visually hides the option from user by moving option to an invisible
 * and disabled select placeholder element.
 *
 * This approach is required rather than simply hiding the option because
 * hidden option can still be included when serializeArray() is called and
 * cause wrong value to be submitted.
 * (eg. if you have option 1, 2, 3 and 2 is hidden, when you select 3,
 * serializeArray() will use the value of 2 instead of 3)
 */
function toggleOption(show) {
    const currentSelectElement = $(this).closest('select'); // the select containing this
    let disabledSelectElement; // the disabled select element
    let selectElement; // the real select element

    if (currentSelectElement.is(':disabled')) {
        disabledSelectElement = currentSelectElement;
        selectElement = disabledSelectElement.data('linkedSelectElement');
    } else {
        selectElement = currentSelectElement;
        disabledSelectElement = currentSelectElement.data('linkedSelectElement');
        if (!disabledSelectElement) {
            // create the disabled placeholder select element
            disabledSelectElement = $('<select>')
                .prop('disabled', true)
                .hide()
                .attr('name', currentSelectElement.attr('name'))
                .addClass(currentSelectElement.attr('class'))
                .data('linkedSelectElement', selectElement)
                .insertAfter(selectElement);

            selectElement.data('linkedSelectElement', disabledSelectElement);
        }
    }

    // save the selected option
    const selectedOption = selectElement.find('option:selected');

    // move the option to the correct select element if required
    if (currentSelectElement.is(':disabled') && show) {
        const previousIndex = this.data('index');
        const $elementNowAtPreviousIndex = selectElement.find('option').eq(previousIndex);

        if ($elementNowAtPreviousIndex.length) {
            this.insertBefore($elementNowAtPreviousIndex);
        } else {
            $(this).appendTo(selectElement);
        }
    } else if (!currentSelectElement.is(':disabled') && !show) {
        this.data('index', currentSelectElement.find('option').index(this));
        $(this).prependTo(disabledSelectElement);
    }

    // make sure the option is still selected
    selectedOption.prop('selected', true);
}

$.fn.toggleOption = toggleOption;

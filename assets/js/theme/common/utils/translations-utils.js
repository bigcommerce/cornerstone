const TRANSLATIONS = 'translations';
const isTranslationDictionaryNotEmpty = (dictionary) => !!Object.keys(dictionary[TRANSLATIONS]).length;
const chooseActiveDictionary = (...dictionaryJsonList) => {
    for (let i = 0; i < dictionaryJsonList.length; i++) {
        const dictionary = JSON.parse(dictionaryJsonList[i]);
        if (isTranslationDictionaryNotEmpty(dictionary)) {
            return dictionary;
        }
    }
};

/**
 * defines Translation Dictionary to use
 * @param context provides access to 3 validation JSONs from en.json:
 * validation_messages, validation_fallback_messages and default_messages
 * @returns {Object}
 */
export const createTranslationDictionary = (context) => {
    const { validationDictionaryJSON, validationFallbackDictionaryJSON, validationDefaultDictionaryJSON } = context;
    const activeDictionary = chooseActiveDictionary(validationDictionaryJSON, validationFallbackDictionaryJSON, validationDefaultDictionaryJSON);
    const localizations = Object.values(activeDictionary[TRANSLATIONS]);
    const translationKeys = Object.keys(activeDictionary[TRANSLATIONS]).map(key => key.split('.').pop());

    return translationKeys.reduce((acc, key, i) => {
        acc[key] = localizations[i];
        return acc;
    }, {});
};

const defaultPageBuilderValues = {
    pdp_sale_badge_label: 'On Sale!',
    pdp_sold_out_label: 'Sold Out',
    'pdp-sale-price-label': 'Now:',
    'pdp-non-sale-price-label': 'Was:',
    'pdp-retail-price-label': 'MSRP:',
    'pdp-custom-fields-tab-label': 'Additional Information',
};

/**
 * defines Translation for values from page builder (locally could be found in config.json)
 */
export const translatePageBuilderValues = () => {
    $('[data-page-builder-key]').each((_, selector) => {
        const $item = $(selector);
        const itemText = $item.text().trim();
        const itemDefaultTranslation = $item.data('default-translation');

        if (itemText === defaultPageBuilderValues[$item.data('page-builder-key')] && itemText !== itemDefaultTranslation) {
            $item.text(itemDefaultTranslation);
        }
    });
};

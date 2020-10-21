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

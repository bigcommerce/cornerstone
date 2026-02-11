/**
 * Language Selector - renders native language names using Intl.DisplayNames API
 */

export default function languageSelector() {
    $('[data-locale-code]').each((index, element) => {
        const $element = $(element);
        const languageCode = $element.data('locale-code');

        if (typeof Intl !== 'undefined' && typeof Intl.DisplayNames !== 'undefined') {
            try {
                const displayNames = new Intl.DisplayNames([languageCode], {
                    type: 'language',
                });
                const nativeName = displayNames.of(languageCode);
                const $activeLanguage = $element.find('strong');

                if ($activeLanguage.length > 0) {
                    $activeLanguage.text(nativeName);
                } else {
                    $element.text(nativeName);
                }

                if ($element.attr('aria-label')) {
                    $element.attr('aria-label', nativeName);
                }
            } catch (error) {
                // eslint-disable-next-line no-console
                console.warn(`Failed to get language name for ${languageCode}:`, error);
            }
        }
    });
}

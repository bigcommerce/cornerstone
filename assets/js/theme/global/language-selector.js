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

const updateCartLocaleMutation = `
    mutation UpdateCartLocale($input: UpdateCartLocaleInput!) {
        cart {
            updateCartLocale(input: $input) {
                cart { entityId locale }
            }
        }
    }
`;

function updateCartLocale(cartId, locale, token) {
    return fetch('/graphql', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
            query: updateCartLocaleMutation,
            variables: { input: { cartEntityId: cartId, data: { locale } } },
        }),
    });
}

/**
 * Updates the active cart's locale before following a language switch link
 */
export function cartLocaleSwitcher(cartId, token) {
    if (!cartId) return;

    $('a[data-locale-code][data-warning]').on('click', (event) => {
        if (event.ctrlKey || event.metaKey || event.shiftKey) return;

        event.preventDefault();

        const { href } = event.currentTarget;
        const locale = $(event.currentTarget).data('locale-code');

        // Navigate regardless of the outcome so a failed update never blocks the switch
        updateCartLocale(cartId, locale, token)
            .catch(() => null)
            .then(() => {
                window.location.href = href;
            });
    });
}
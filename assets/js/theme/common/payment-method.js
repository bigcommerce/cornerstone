import creditcards from 'creditcards';

/**
 * Omit null or empty string properties of object
 * @param {Object} object
 * @returns {Object}
 */
const omitNullString = obj => {
    const refObj = obj;

    $.each(refObj, (key, value) => {
        if (value === null || value === '') {
            delete refObj[key];
        }
    });

    return refObj;
};

/**
 * Get credit card type from credit card number
 * @param {string} value
 */
export const creditCardType = value => creditcards.card.type(creditcards.card.parse(value), true);

/**
 * Wrapper for ajax request to store a new instrument in bigpay
 * @param {object} Representing the data needed for the header
 * @param {object} Representing the data needed for the body
 * @param {function} done Function to execute on a successful response
 * @param {function} fail Function to execute on a unsuccessful response
 */
export const storeInstrument = ({
    // Hostname, Ids & Token
    paymentsUrl,
    shopperId,
    storeHash,
    vaultToken,
}, {
    /* eslint-disable */
    // Provider Name
    provider_id,

    // Instrument Details
    credit_card_number,
    expiration,
    name_on_card,
    cvv,
    default_instrument,

    // Billing Address
    address1,
    address2,
    city,
    postal_code,
    state_or_province_code,
    country_code,
    company,
    first_name,
    last_name,
    email,
    phone,
    /* eslint-enable */
}, done, fail) => {
    const expiry = expiration.split('/');

    $.ajax({
        url: `${paymentsUrl}/stores/${storeHash}/customers/${shopperId}/stored_instruments`,
        dataType: 'json',
        method: 'POST',
        cache: false,
        headers: {
            Authorization: vaultToken,
            Accept: 'application/vnd.bc.v1+json',
            'Content-Type': 'application/vnd.bc.v1+json',
        },
        data: JSON.stringify({
            instrument: {
                type: 'card',
                cardholder_name: name_on_card,
                number: creditcards.card.parse(credit_card_number),
                expiry_month: creditcards.expiration.month.parse(expiry[0]),
                expiry_year: creditcards.expiration.year.parse(expiry[1], true),
                verification_value: cvv,
            },
            billing_address: omitNullString({
                address1,
                address2,
                city,
                postal_code,
                state_or_province_code,
                country_code,
                company,
                first_name,
                last_name,
                email,
                phone,
            }),
            provider_id,
            default_instrument,
        }),
    })
        .done(done)
        .fail(fail);
};

export const Formatters = {
    /**
     * Sets up a format for credit card number
     * @param field
     */
    setCreditCardNumberFormat: field => {
        if (field) {
            $(field).on('keyup', ({ target }) => {
                const refTarget = target;
                refTarget.value = creditcards.card.format(creditcards.card.parse(target.value));
            });
        }
    },

    /**
     * Sets up a format for expiration date
     * @param field
     */
    setExpirationFormat: field => {
        if (field) {
            $(field).on('keyup', ({ target, which }) => {
                const refTarget = target;
                if (which === 8 && /.*(\/)$/.test(target.value)) {
                    refTarget.value = target.value.slice(0, -1);
                } else if (target.value.length > 4) {
                    refTarget.value = target.value.slice(0, 5);
                } else if (which !== 8) {
                    refTarget.value = target.value
                        .replace(/^([1-9]\/|[2-9])$/g, '0$1/')
                        .replace(/^(0[1-9]|1[0-2])$/g, '$1/')
                        .replace(/^([0-1])([3-9])$/g, '0$1/$2')
                        .replace(/^(0[1-9]|1[0-2])([0-9]{2})$/g, '$1/$2')
                        .replace(/^([0]+)\/|[0]+$/g, '0')
                        .replace(/[^\d\/]|^[\/]*$/g, '')
                        .replace(/\/\//g, '/');
                }
            });
        }
    },
};

export const Validators = {
    /**
     * Sets up a validation for credit card number
     * @param validator
     * @param field
     * @param errorMessage
     */
    setCreditCardNumberValidation: (validator, field, errorMessage) => {
        if (field) {
            validator.add({
                selector: field,
                validate: (cb, val) => {
                    const result = val.length && creditcards.card.isValid(creditcards.card.parse(val));

                    cb(result);
                },
                errorMessage,
            });
        }
    },

    /**
     * Sets up a validation for expiration date
     * @param validator
     * @param field
     * @param errorMessage
     */
    setExpirationValidation: (validator, field, errorMessage) => {
        if (field) {
            validator.add({
                selector: field,
                validate: (cb, val) => {
                    const expiry = val.split('/');
                    let result = val.length && /^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(val);
                    result = result && !creditcards.expiration.isPast(creditcards.expiration.month.parse(expiry[0]), creditcards.expiration.year.parse(expiry[1], true));

                    cb(result);
                },
                errorMessage,
            });
        }
    },

    /**
     * Sets up a validation for name on card
     * @param validator
     * @param field
     * @param errorMessage
     */
    setNameOnCardValidation: (validator, field, errorMessage) => {
        if (field) {
            validator.add({
                selector: field,
                validate: (cb, val) => {
                    const result = !!val.length;

                    cb(result);
                },
                errorMessage,
            });
        }
    },

    /**
     * Sets up a validation for cvv
     * @param validator
     * @param field
     * @param errorMessage
     * @param {any} cardType The credit card number type
     */
    setCvvValidation: (validator, field, errorMessage, cardType) => {
        if (field) {
            validator.add({
                selector: field,
                validate: (cb, val) => {
                    const type = typeof cardType === 'function' ? cardType() : cardType;
                    const result = val.length && creditcards.cvc.isValid(val, type);

                    cb(result);
                },
                errorMessage,
            });
        }
    },
};

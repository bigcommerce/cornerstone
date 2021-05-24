const forms = {
    email(value) {
        const re = /^\S+@\S+\.\S+/;
        return re.test(value);
    },

    /**
     * Validates a password field
     * @param value
     * @returns {boolean}
     */
    password(value) {
        return this.notEmpty(value);
    },

    /**
     * validates if a field is empty
     * @param value
     * @returns {boolean}
     *
     */
    notEmpty(value) {
        return value.length > 0;
    },

    /**
     * validates a field like product quantity
     * @param value
     * @returns {boolean}
     *
     */
    numbersOnly(value) {
        const re = /^\d+$/;
        return re.test(value);
    },

    /**
     * validates increase in value does not exceed max
     * @param {number} value
     * @param {number} max
     * @returns {number}
     *
     */
    validateIncreaseAgainstMaxBoundary(value, max) {
        const raise = value + 1;

        if (!max || raise <= max) return raise;
        return value;
    },

    /**
     * validates decrease in value does not fall below min
     * @param {number} value
     * @param {number} min
     * @returns {number}
     *
     */
    validateDecreaseAgainstMinBoundary(value, min) {
        const decline = value - 1;

        if (!min || decline >= min) return decline;
        return value;
    },
};

export default forms;

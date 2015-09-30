const forms = {
    email(value) {
        const re = /^.+@.+\..+/;
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
};

export default forms;

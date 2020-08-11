const forms = {
    email(value) {
        const re = /^.+@.+\..+/;
        return re.test(value);
    },

    /**
     * Validates a phone number field
     * @param value
     * @returns {boolean}
     */
    isPhoneNumberValid(value) {
        const phoneRegExp = /^\+?[1-9]\d{2,14}$/;
        const specialCharsRegexp = /[-"_()/:#.,'*\s]/g;

        return phoneRegExp.test(value.replace(specialCharsRegexp, ''));
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

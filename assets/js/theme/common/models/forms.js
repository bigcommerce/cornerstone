export default {
    email(value) {
        var re = /^.+@.+\..+/;
        return re.test(value);
    },

    /**
     * Validates a password field
     * @param value
     * @returns {boolean}
     */
    password(value) {
        return value.length > 0;
    }
}

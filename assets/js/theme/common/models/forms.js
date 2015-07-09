export default {
    email(value) {
        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
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

module.exports = {
    target: [
        'assets/js/**/*.js',
        '!assets/js/**/*.spec.js',
        '!assets/js/dependency-bundle.js'
    ],
    options: {
        quiet: true
    }
};

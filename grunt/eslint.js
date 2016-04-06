module.exports = {
    target: [
        'assets/js/**/*.js',
        '!assets/js/bundle.js',
        '!assets/js/**/*.spec.js',
    ],
    options: {
        quiet: true
    }
};

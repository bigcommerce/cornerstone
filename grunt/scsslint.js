module.exports = {
    options: {
        bundleExec: true,
        compact: true,
        colorizeOutput: true
    },

    allFiles: [
        'assets/scss/**/*.scss',
        '!assets/scss/vendor/**/*.scss',
        '!assets/scss/invoice.scss',
        '!assets/scss/maintenance.scss'
    ]
};

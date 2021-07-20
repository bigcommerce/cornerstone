module.exports = {
    options: {
        configFile: '.stylelintrc',
        formatter: 'string',
        ignoreDisables: false,
        failOnError: true,
        outputFile: '',
        reportNeedlessDisables: false,
        fix: false,
        syntax: '',
    },
    src: [
        'assets/scss/**/*.scss',
        '!assets/scss/vendor/**/*.scss',
        '!assets/scss/invoice.scss',
        '!assets/scss/maintenance.scss',
    ],
};


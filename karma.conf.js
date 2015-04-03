module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jspm', 'jasmine'],

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'verbose'],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        //singleRun: true,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // list of files / patterns to load in the browser
        files: [],

        jspm: {
            // Edit this to your needs
            config: 'assets/config.js',
            loadFiles: ['assets/js/test-unit/**/*.js'],
            serveFiles: [
                'assets/**/*.js',
                'assets/jspm_packages/*'
            ]
        },

        //proxies: {
        //    '/base/client/': '/client/assets/',
        //    '/base/jspm_packages/': '/base/public/assets/jspm_packages/'
        //},

        // list of files to exclude
        exclude: [],

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'js/test-unit/**/*.js': ['babel']
        }

    });
};

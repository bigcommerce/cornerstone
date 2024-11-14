var webpack = require('webpack');

/**
 * Watch options for the core watcher
 * @type {{files: string[], ignored: string[]}}
 */
var watchOptions = {
    // If files in these directories change, reload the page.
    files: [
        '/templates',
        '/lang',
    ],

    //Do not watch files in these directories
    ignored: [
        '/assets/scss',
        '/assets/less',
        '/assets/css',
        '/assets/dist',
    ]
};

/**
 * Watch any custom files and trigger a rebuild
 */
function development() {
    var devConfig = require('./webpack.dev.js');

    // Rebuild the bundle once at bootup
    webpack(devConfig).watch({}, (err, stats) => {
        if (err) {
            console.error(err.message, err.details);
        }

        if (stats.hasErrors()) {
            console.error(stats.toString({ all: false, errors: true, colors: true }));
        }

        if (stats.hasWarnings()) {
            console.error(stats.toString({ all: false, warnings: true, colors: true }));
        }

        process.send('reload');
    });
}

/**
 * Hook into the `stencil bundle` command and build your files before they are packaged as a .zip
 */
function production() {
    var prodConfig = require('./webpack.prod.js');

    webpack(prodConfig).run((err, stats) => {
        if (err) {
            console.error(err.message, err.details);
            process.exit(1);
            return;
        }

        if (stats.hasErrors()) {
            console.error(stats.toString({ all: false, errors: true, colors: true }));
            process.exit(1);
            return;
        }

        if (stats.hasWarnings()) {
            console.error(stats.toString({ all: false, warnings: true, colors: true }));
        }

        process.send('done');
    });
}

if (process.send) {
    // running as a forked worker
    process.on('message', message => {
        if (message === 'development') {
            development();
        }

        if (message === 'production') {
            production();
        }
    });

    process.send('ready');
}

module.exports = { watchOptions };

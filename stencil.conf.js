var webpack = require('webpack');
var devConfig = require('./webpack.dev.js');
var prodConfig = require('./webpack.prod.js');

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
    // Rebuild the bundle once at bootup
    webpack(devConfig).watch({}, err => {
        if (err) {
            console.error(err.message, err.details);
        }

        process.send('reload');
    });
}

/**
 * Hook into the `stencil bundle` command and build your files before they are packaged as a .zip
 */
function production() {
    webpack(prodConfig).run(err => {
        if (err) {
            console.error(err.message, err.details);
            process.exit(1);
            return;
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

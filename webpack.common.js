const CleanPlugin = require('clean-webpack-plugin'),
      LodashPlugin = require('lodash-webpack-plugin'),
      path = require('path'),
      webpack = require('webpack');

// Common configuration, with extensions in webpack.dev.js and webpack.prod.js.
module.exports = {
    bail: true,
    context: __dirname,
    entry: {
        main: './assets/js/app.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: /(assets\/js|assets\\js|stencil-utils)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        plugins: [
                            'dynamic-import-webpack', // Needed for dynamic imports.
                            'lodash', // Automagically tree-shakes lodash.
                            'transform-regenerator', // Transforms async and generator functions.
                        ],
                        presets: [
                            ['env', {
                                loose: true, // Enable "loose" transformations for any plugins in this preset that allow them.
                                modules: false, // Don't transform modules; needed for tree-shaking.
                                useBuiltIns: true, // Tree-shake babel-polyfill.
                            }],
                        ],
                    },
                },
            },
            {
                test: /jquery-migrate/,
                use: 'imports-loader?define=>false',
            },
        ],
    },
    output: {
        chunkFilename: 'theme-bundle.chunk.[name].js',
        filename: 'theme-bundle.[name].js',
        path: path.resolve(__dirname, "assets/dist"),
    },
    plugins: [
        new CleanPlugin(['assets/dist'], {
            verbose: false,
            watch: false,
        }),
        new LodashPlugin, // Complements babel-plugin-lodash by shrinking its cherry-picked builds further.
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
        }),
    ],
    resolve: {
        alias: {
            'jquery-migrate': path.resolve(__dirname, 'node_modules/jquery-migrate/dist/jquery-migrate.min.js'),
            jstree: path.resolve(__dirname, 'node_modules/jstree/dist/jstree.min.js'),
            'lazysizes': path.resolve(__dirname, 'node_modules/lazysizes/lazysizes.min.js'),
            'pace': path.resolve(__dirname, 'node_modules/pace/pace.min.js'),
            'slick-carousel': path.resolve(__dirname, 'node_modules/slick-carousel/slick/slick.min.js'),
            'svg-injector': path.resolve(__dirname, 'node_modules/svg-injector/dist/svg-injector.min.js'),
            sweetalert2: path.resolve(__dirname, 'node_modules/sweetalert2/dist/sweetalert2.min.js'),
        },
    },
};

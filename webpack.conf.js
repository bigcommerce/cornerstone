var CleanWebpackPlugin = require('clean-webpack-plugin'),
    config = require('./config.json'),
    LodashModuleReplacementPlugin = require('lodash-webpack-plugin'),
    path = require('path'),
    webpack = require('webpack');

module.exports = {
    bail: true,
    context: __dirname,
    devtool: 'source-map',
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
                        cacheDirectory: true,
                        compact: true,
                        minified: true,
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
                    }
                }
            }
        ],
    },
    output: {
        chunkFilename: 'theme-bundle.chunk.[name].js',
        filename: 'theme-bundle.[name].js',
        path: path.resolve(__dirname, "assets/dist"),
    },
    plugins: [
        new CleanWebpackPlugin(['assets/dist'], {
            verbose: false,
            watch: false,
        }),
        new webpack.LoaderOptionsPlugin({
             minimize: true,
        }),
        new LodashModuleReplacementPlugin, // Complements 'babel-plugin-lodash by shrinking it's cherry-picked builds further.
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
        }),
        new webpack.optimize.CommonsChunkPlugin({
            children: true,
            minChunks: 2,
        }),
    ],
    resolve: {
        alias: {
            'html5-history-api': path.resolve(__dirname, 'node_modules/html5-history-api/history.min.js'),
            jquery: path.resolve(__dirname, 'node_modules/jquery/dist/jquery.min.js'),
            jstree: path.resolve(__dirname, 'node_modules/jstree/dist/jstree.min.js'),
            'slick-carousel': path.resolve(__dirname, 'node_modules/slick-carousel/slick/slick.min.js'),
        },
    },
    watch: false,
};

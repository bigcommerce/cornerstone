var CleanWebpackPlugin = require('clean-webpack-plugin'),
    config = require('./config.json'),
    LodashModuleReplacementPlugin = require('lodash-webpack-plugin'),
    path = require('path'),
    webpack = require('webpack');

module.exports = {
    watch: false,
    devtool: 'source-map',
    context: __dirname,
    entry: {
        main: './assets/js/app.js',
    },
    output: {
        filename: 'theme-bundle.[name].js',
        path: path.resolve(__dirname, "assets/dist"),
    },
    bail: true,
    module: {
        rules: [
            {
                test: /\.js$/,
                include: /(assets\/js|assets\\js|stencil-utils)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        compact: false,
                        cacheDirectory: true,
                        presets: [
                            ['latest', {
                                "es2015": {
                                    loose: true, // Enable "loose" transformations for any plugins in this preset that allow them.
                                    modules: false, // Don't transform modules; needed for tree-shaking.
                                },
                                "es2016": false, // Only includes the transform-exponentiation-operator plugin, which we don't use.
                                "es2017": true, // Needed for async/await.
                            }]
                        ],
                        plugins: [
                            'dynamic-import-webpack', // Needed for dynamic imports.
                            'lodash', // Automagically tree-shakes lodash.
                            'transform-regenerator', // Transforms async and generator functions.
                        ]
                    }
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['assets/dist'], {
            verbose: true,
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
            name: 'vendor',
            minChunks: function (module) {
                // this assumes your vendor imports exist in the node_modules directory
                return module.context && module.context.indexOf('node_modules') !== -1;
            },
        }),
    ],
};

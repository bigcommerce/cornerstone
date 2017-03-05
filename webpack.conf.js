var CleanWebpackPlugin = require('clean-webpack-plugin'),
    config = require('./config.json'),
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
        path: path.resolve(__dirname, "assets/dist")
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
                        presets: [['es2015', {loose: true, modules: false}]],
                        plugins: [
                            'dynamic-import-webpack',
                            'syntax-dynamic-import',
                            'transform-async-to-generator',
                            'transform-regenerator'
                        ]
                    }
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['assets/dist'], {
            verbose: true,
            watch: false
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function (module) {
                // this assumes your vendor imports exist in the node_modules directory
                return module.context && module.context.indexOf('node_modules') !== -1;
            }
        })
    ],
};

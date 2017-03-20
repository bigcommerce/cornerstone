var webpack = require('webpack');

module.exports = {
    watch: false,
    devtool: 'source-map',
    context: __dirname,
    entry: {
        'theme-bundle': './assets/js/app.js',
    },
    output: {
        path: `./assets/dist`,
        filename: '[name].js',
    },
    bail: true,
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                include: /(assets\/js|assets\\js|stencil-utils)/,
                query: {
                    compact: false,
                    cacheDirectory: true,
                    presets: ['es2015-loose'],
                }
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
        })
    ],
};

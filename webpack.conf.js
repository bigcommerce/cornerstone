var webpack = require('webpack');

module.exports = {
    devtool: 'source-map',
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
            'window.jQuery': 'jquery'
        })
    ],
    watch: false
};

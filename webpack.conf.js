var webpack = require('webpack');

module.exports = {
    devtool: 'eval-cheap-module-source-map',
    bail: true,
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                include: /(assets\/js|assets\\js|node_modules\/@bigcommerce\/stencil-utils|node_modules\\@bigcommerce\\stencil-utils)/,
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

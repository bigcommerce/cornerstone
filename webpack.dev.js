var webpack = require('webpack');
var merge = require('webpack-merge');
var commonConfig = require('./webpack.common.js');

module.exports = merge(commonConfig, {
    mode: 'development',
    devtool: 'source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': 'development',
        }),
    ],
});

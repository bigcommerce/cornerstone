const webpack = require('webpack'),
      merge = require('webpack-merge'),
      commonConfig = require('./webpack.common.js');

module.exports = merge(commonConfig, {
    devtool: 'inline-source-map',
    mode: 'development',
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
        }),
    ],
});

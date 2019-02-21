const webpack = require('webpack'),
      merge = require('webpack-merge'),
      commonConfig = require('./webpack.common.js');

module.exports = merge(commonConfig, {
    devtool: 'inline-source-map',
    mode: 'development',
    performance: {
        hints: false,
    },
});

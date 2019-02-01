const webpack = require('webpack'),
      merge = require('webpack-merge'),
      commonConfig = require('./webpack.common.js');

module.exports = merge(commonConfig, {
    devtool: 'source-map',
    mode: 'production',
    optimization: {
        noEmitOnErrors: true,
    },
});

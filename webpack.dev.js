/* eslint-disable import/no-extraneous-dependencies */
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common');

module.exports = merge(commonConfig, {
    devtool: 'inline-source-map',
    mode: 'development',
    performance: {
        hints: false,
    },
});

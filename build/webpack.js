const path           = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack        = require('webpack');
const webpackMerge   = require('webpack-merge');
const appConfig      = require('./webpack/config_app');
const app2Config     = require('./webpack/config_app_2');
const commonConfig   = require('./webpack/config_common');
const PATHS          = require('./webpack/paths');
const getPlugins     = require('./webpack/plugins');

module.exports = function (grunt) {
    const common_config = commonConfig(grunt);

    const app   = webpackMerge.smart(common_config, appConfig(grunt));
    const app_2 = webpackMerge.smart(common_config, app2Config(grunt));

    const all   = [app, app_2];

    const watch = all.map(config => webpackMerge(config, {
        watch: true,
        optimization: {
            minimize: false,
        },
    }));

    return {
        app,
        app_2,
        all,
        watch,
    };
};

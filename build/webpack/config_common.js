const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const PATHS          = require('./paths');

const commonConfig = (grunt) => ({
    devtool: false, // handled by SourceMapDevToolPlugin
    mode   : global.is_release ? 'production' : 'development',
    stats  : {
        chunks    : false,
        maxModules: 0,
        warnings  : false,
    },
    output: {
        filename     : '[name].js',
        chunkFilename: '[name].min.js',
        publicPath   : () => (
            (global.is_release || grunt.file.exists(PATHS.ROOT, 'scripts/CNAME') ? '' : '/binary-static') +
            (global.branch ? `/${global.branch_prefix}${global.branch}` : '') +
            '/js/'
        ),
    },
    optimization: {
        namedChunks: true,
        minimize   : true,
        minimizer  : [
            new UglifyJsPlugin({
                test     : /\.min\.js/,
                exclude  : /(vendors~|smartcharts)/,
                parallel : true,
                sourceMap: true,
            }),
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    module: {
        rules: [
            {
                test   : /\.jsx?$/,
                exclude: /node_modules/,
                loader : 'babel-loader',
                options: {
                    presets: ['env', 'stage-1', 'react'],
                    plugins: [
                        'transform-decorators-legacy',
                        'transform-object-rest-spread',
                        'transform-class-properties',
                    ],
                },
            },
        ],
    },
    watch       : false,
    watchOptions: {
        ignored: /node_modules/,
    },
});

module.exports = commonConfig;

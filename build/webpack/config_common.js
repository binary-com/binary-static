const UglifyJsPlugin    = require('uglifyjs-webpack-plugin');
const publicPathFactory = require('./helpers').publicPathFactory;

const commonConfig = (grunt) => ({
    devtool: false, // handled by SourceMapDevToolPlugin
    mode   : global.is_production ? 'production' : 'development',
    stats  : {
        chunks    : false,
        maxModules: 0,
        warnings  : false,
    },
    output: {
        filename     : '[name].js',
        chunkFilename: '[name].min.js',
        publicPath   : publicPathFactory(grunt),
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

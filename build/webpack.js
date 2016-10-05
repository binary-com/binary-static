var webpack = require('webpack');

module.exports = function (grunt) {
    return {
        all: {
            node: {
                fs: "empty"
            },
            devtool: 'source-map',
            entry: {
                'binary.js': './src/javascript',
                'binary.min.js': './src/javascript',
            },
            output: {
                path: global.dist + '/js/',
                filename: '[name]',
            },
            plugins: [
                new webpack.optimize.UglifyJsPlugin({
                    include: /\.min\.js$/,
                    minimize: true,
                    sourceMap: true,
                    compress: {
                        warnings: false,
                    },  
                }), 
            ],  
        }
    }
};

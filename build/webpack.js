var webpack = require('webpack');

module.exports = function (grunt) {
    return {
        all: {
            node: {
                fs: "empty"
            },
            devtool: 'source-map',
            entry: {
                binary: './src/javascript',
                'binary.min': './src/javascript',
            },
            output: {
                path: global.dist + 'js',
                filename: '[name].js',
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

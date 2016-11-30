var webpack = require('webpack');
var CircularDependencyPlugin = require('circular-dependency-plugin');

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
            module: {
                loaders: [
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        loader: 'babel-loader',
                        query: {
                            presets: ['es2015'],
                            compact: false,
                        }
                    }
                ]
            },
            plugins: [
                new CircularDependencyPlugin({
                    failOnError: true,
                }),
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

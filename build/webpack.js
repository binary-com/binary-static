var webpack = require('webpack');
var CircularDependencyPlugin = require('circular-dependency-plugin');

module.exports = function (grunt) {
    var isProduction = grunt.cli.tasks[0] === 'release',
        plugins = [
            new CircularDependencyPlugin({
                failOnError: true,
            }),
        ];
    if (isProduction) {
        plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                include: /\.min\.js$/,
                minimize: true,
                sourceMap: true,
                compress: {
                    warnings: false,
                },
            })
        );
    }

    return {
        all: {
            node: {
                fs: "empty"
            },
            devtool: isProduction ? 'source-map' : 'cheap-source-map',
            watch: !isProduction,
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
                        loader: 'babel',
                        query: {
                            presets: ['es2015'],
                            compact: false,
                        }
                    }
                ]
            },
            plugins: plugins,
        }
    }
};

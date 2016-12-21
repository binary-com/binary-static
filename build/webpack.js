var webpack = require('webpack');
var CircularDependencyPlugin = require('circular-dependency-plugin');
// var UnusedFilesWebpackPlugin = require('unused-files-webpack-plugin')["default"];

module.exports = function (grunt) {
    var isProduction = grunt.cli.tasks[0] === 'release',
        plugins = [
            new CircularDependencyPlugin({
                failOnError: true,
            }),
            // new UnusedFilesWebpackPlugin({
            //     pattern: 'src/javascript/**/*.*',
            //     globOptions: {
            //         ignore: 'src/javascript/**/__tests__/*.*',
            //     }
            // }),
        ];
    if (isProduction) {
        plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                include  : /\.min\.js$/,
                minimize : true,
                sourceMap: true,
                compress : {
                    warnings: false,
                },
            })
        );
    } else {
        plugins.push(
            function() {
                this.plugin('watch-run', function(watching, callback) {
                    console.log('');
                    grunt.log.ok('Compile started at ' + new Date());
                    callback();
                });
            }
        );
    }

    return {
        all: {
            node: {
                fs: 'empty',
            },
            devtool: isProduction ? 'source-map' : 'cheap-source-map',
            watch  : !isProduction,
            entry  : {
                'binary.js'    : './src/javascript',
                'binary.min.js': './src/javascript',
            },
            output: {
                path    : global.dist + '/js/',
                filename: '[name]',
            },
            module: {
                loaders: [
                    {
                        test   : /\.js$/,
                        exclude: /node_modules/,
                        loader : 'babel',
                        query  : {
                            presets: ['es2015'],
                            compact: false,
                        },
                    },
                ],
            },
            plugins: plugins,
        },
    };
};

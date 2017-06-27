var path = require('path');
var webpack = require('webpack');
var CircularDependencyPlugin = require('circular-dependency-plugin');
// var UnusedFilesWebpackPlugin = require('unused-files-webpack-plugin')["default"];

module.exports = function (grunt) {
    var isProduction = grunt.cli.tasks[0] === 'release',
        plugins = [
            new CircularDependencyPlugin({
                failOnError: true,
            }),
            new webpack.SourceMapDevToolPlugin({
                filename: '[file].map',
                exclude: [/^(?!(binary)).*$/],
            }),
            new webpack.ContextReplacementPlugin(/moment[\/\\]locale/, /nothing/),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor',
                filename: 'vendor.min.js',
                minChunks: function (module) {
                    return module.context && module.context.indexOf('node_modules') !== -1;
                }
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'manifest',
                minChunks: Infinity,
            }),
            new webpack.optimize.UglifyJsPlugin({
                include  : /\.min\.js$/,
                minimize : true,
                sourceMap: true,
                compress : {
                    warnings: false,
                },
            }),
            // new UnusedFilesWebpackPlugin({
            //     pattern: 'src/javascript/**/*.*',
            //     globOptions: {
            //         ignore: 'src/javascript/**/__tests__/*.*',
            //     }
            // }),
        ];

    if (!isProduction) {
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

    var common_options = {
        node: {
            fs: 'empty',
        },
        // devtool: isProduction ? 'source-map' : 'cheap-source-map',
        cache: true,
        stats: {
            chunks: false,
        },
        entry: {
            [isProduction ? 'binary.min' :'binary']: './src/javascript',
        },
        output: {
            path         : path.resolve(__dirname, '../' + global.dist + '/js/'),
            filename     : '[name].js',
            chunkFilename: '[name]_[chunkhash].min.js',
            publicPath   : (isProduction ? '' : '/binary-static') +
                           (global.branch ? `/${global.branch_prefix}${global.branch}` : '') + '/js/',
        },
        module: {
            loaders: [
                {
                    test   : /\.js$/,
                    exclude: /node_modules/,
                    loader : 'babel-loader',
                    query  : {
                        presets: ['es2015'],
                        compact: false,
                    },
                },
            ],
        },
        plugins: plugins,
    };

    var watch_options = Object.assign({ watch: true }, common_options);

    return {
        build: common_options,
        watch: watch_options,
    }
};

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
            new webpack.ContextReplacementPlugin(/moment[\/\\]locale/, /ja/),
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
                include  : /(vendor|binary)\.min\.js$/,
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
                this.plugin('watch-run', (watching, callback) => {
                    console.log('\n');
                    grunt.log.ok('Build started at:', new Date().toString().grey);

                    const changed_files = Object.keys(watching.compiler.watchFileSystem.watcher.mtimes);
                    if (changed_files.length) {
                        grunt.log.ok(`Changed file${changed_files.length > 1 ? 's' : ''}:`);
                        changed_files.forEach((file) =>{
                            const file_path = file.replace(process.cwd(), '.').match(/(.*\/)(.*(?!\/))$/);
                            grunt.log.write('   -'.green, file_path[1].grey, `\b${file_path[2]}\n`);
                        });
                    }

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

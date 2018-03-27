const path = require('path');
const webpack = require('webpack');
const CircularDependencyPlugin = require('circular-dependency-plugin');
// const UnusedFilesWebpackPlugin = require('unused-files-webpack-plugin')['default'];

module.exports = function (grunt) {
    const isProduction = grunt.cli.tasks[0] === 'release';
    const plugins = [
        new CircularDependencyPlugin({
            failOnError: true,
        }),
        new webpack.SourceMapDevToolPlugin({
            filename: '[file].map',
            exclude : [/^(?!(binary)).*$/],
        }),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale/, /ja/),
        new webpack.optimize.CommonsChunkPlugin({
            name     : 'vendor',
            filename : 'vendor.min.js',
            minChunks: (module) => module.context && module.context.indexOf('node_modules') !== -1,
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name     : 'manifest',
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
        //     patterns: [
        //         'src/javascript/**/*.*',
        //         '!src/javascript/**/__tests__/*.*',
        //     ],
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

    const common_options = {
        node: {
            fs: 'empty',
        },
        // devtool: isProduction ? 'source-map' : 'cheap-source-map',
        cache: true,
        stats: {
            chunks: false,
        },
        entry: {
            [isProduction ? 'binary.min'     :'binary']    : './src/javascript',
            [isProduction ? 'binary_app.min' :'binary_app']: './src/javascript/app_2',
        },
        output: {
            path         : path.resolve(__dirname, `../${global.dist}/js/`),
            filename     : '[name].js',
            chunkFilename: '[name]_[chunkhash].min.js',
            publicPath   : `${isProduction ? '' : '/binary-static'}${global.branch ? `/${global.branch_prefix}${global.branch}` : ''}/js/`,
        },
        resolve: {
            extensions: ['.js', '.jsx'],
        },
        module: {
            loaders: [
                {
                    test   : /\.jsx?$/,
                    exclude: /node_modules/,
                    loader : 'babel-loader',
                    query  : {
                        plugins: ['transform-decorators-legacy' ],
                        presets: ['es2015', 'stage-1', 'react'],
                        compact: false,
                    },
                },
            ],
        },
        plugins,
    };

    const watch_options = Object.assign({ watch: true }, common_options);

    return {
        build: common_options,
        watch: watch_options,
    };
};

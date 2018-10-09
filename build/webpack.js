const path = require('path');
const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CircularDependencyPlugin = require('circular-dependency-plugin');
// const UnusedFilesWebpackPlugin = require('unused-files-webpack-plugin')['default'];

module.exports = function (grunt) {
    const is_production = grunt.cli.tasks[0] === 'release';
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
        ...(!grunt.option('analyze') ? [] : [
            new BundleAnalyzerPlugin({
                analyzerMode  : 'static',
                reportFilename: path.resolve(__dirname, '../../report.html'),
                openAnalyzer  : false,
            }),
        ]),
        // new UnusedFilesWebpackPlugin({
        //     patterns: [
        //         'src/javascript/**/*.*',
        //         '!src/javascript/**/__tests__/*.*',
        //     ],
        // }),
    ];

    if (is_production) {
        plugins.push(
            new webpack.DefinePlugin({
                '__REACT_DEVTOOLS_GLOBAL_HOOK__': '({ isDisabled: true })'
            }),
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('production'),
                },
            }),
        );
    } else {
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
            },
        );
    }

    const common_options = {
        node: {
            fs: 'empty',
        },
        // devtool: is_production ? 'source-map' : 'cheap-source-map',
        cache: true,
        stats: {
            chunks: false,
        },
        entry: {
            [is_production ? 'binary.min' :'binary']: './src/javascript',
        },
        output: {
            path         : path.resolve(__dirname, `../${global.dist}/js/`),
            filename     : '[name].js',
            chunkFilename: '[name]_[chunkhash].min.js',
            publicPath   : `${is_production || grunt.file.exists(`${process.cwd()}/scripts/CNAME`) ? '' : '/binary-static'}${global.branch ? `/${global.branch_prefix}${global.branch}` : ''}/js/`,
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
                        presets: ['env', 'react'],
                        plugins: [
                            'transform-object-rest-spread',
                            'transform-class-properties',
                        ],
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

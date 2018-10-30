const CircularDependencyPlugin = require('circular-dependency-plugin');
const ManifestPlugin           = require('webpack-manifest-plugin');
const path                     = require('path');
const SWPrecachedWebpackPlugin = require('sw-precache-webpack-plugin');
const webpack                  = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const PATHS                    = require('./paths');

const getPlugins = (app, grunt) => ([
    new CircularDependencyPlugin({
        failOnError: true,
    }),

    new webpack.SourceMapDevToolPlugin({
        filename: '[file].map',
        test    : /binary/,
    }),

    new webpack.ContextReplacementPlugin(/moment[\/\\]locale/, /ja/),

    ...(app === 'app_2'
        ? [
            new ManifestPlugin({
                fileName  : 'asset-manifest.json',
                publicPath: 'js/app_2/',
            }),

            new SWPrecachedWebpackPlugin({
                cachedId                     : 'app_2',
                dontCacheBustUrlsMatching    : /\.\w{8}\./,
                filename                     : 'service-worker.js',
                minify                       : false,
                navigateFallback             : '/',
                publicPath                   : '/js/app_2/',
                staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
            }),
        ]
        : []
    ),

    ...(global.is_production
        ? [
            new webpack.DefinePlugin({
                '__REACT_DEVTOOLS_GLOBAL_HOOK__': '({ isDisabled: true })',
            }),

            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('production'),
                },
            }),
        ]
        : [
            function() {
                this.plugin('watch-run', (watching, callback) => {
                    console.log('\n');
                    grunt.log.ok('Build started at:', new Date().toString().grey);

                    const changed_files = Object.keys(watching.watchFileSystem.watcher.mtimes);
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

            ...(!grunt.option('analyze') ? [] : [
                new BundleAnalyzerPlugin({
                    analyzerMode  : 'static',
                    reportFilename: path.resolve(PATHS.ROOT, `../report_${app}.html`),
                    openAnalyzer  : false,
                }),
            ]),
        ]
    ),
]);

module.exports = getPlugins;

const rewrite     = require('connect-modrewrite');
const serveIndex  = require('serve-index');
const serveStatic = require('serve-static');

module.exports = function (grunt) {
    return {
        livereload: {
            options: {
                hostname  : '127.0.0.1',
                port      : 443,
                protocol  : 'https',
                base      : 'dist',
                open      : 'https://localhost.localdomain',
                middleware: (connect, options) => {
                    const middlewares = [
                        require('connect-livereload')(),
                    ];

                    const rules = [
                        '^/binary-static/(.*)$ /$1',
                    ];
                    middlewares.push(rewrite(rules));

                    if (!Array.isArray(options.base)) {
                        options.base = [options.base];
                    }

                    options.base.forEach((base) => {
                        middlewares.push(serveStatic(base));
                    });

                    const directory = options.directory || options.base[options.base.length - 1];
                    middlewares.push(serveIndex(directory));

                    return middlewares;
                }
            }
        },
    };
};

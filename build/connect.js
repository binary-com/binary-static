module.exports = function (grunt){
    var rewrite = require('connect-modrewrite');
    var serveStatic = require('serve-static');
    var serveIndex  = require('serve-index');

    return {
        livereload: {
            options: {
                hostname: '127.0.0.1',
                port    : 443,
                protocol: 'https',
                base    : 'dist',
                open    : 'https://localhost.localdomain',
                middleware: function (connect, options) {
                    var middlewares = [
                        require('connect-livereload')()
                    ];

                    var rules = [
                        '^/binary-static/(.*)$ /$1'
                    ];
                    middlewares.push(rewrite(rules));

                    if (!Array.isArray(options.base)) {
                        options.base = [options.base];
                    }

                    var directory = options.directory || options.base[options.base.length - 1];
                    options.base.forEach(function (base) {
                        middlewares.push(serveStatic(base));
                    });

                    middlewares.push(serveIndex(directory));

                    return middlewares;
                }
            }
        },
        all: {
            options: {
                hostname : '127.0.0.1',
                port     : 443,
                protocol : 'https',
                base     : 'dist',
                keepalive: true,
                open     : 'https://localhost.localdomain',
                middleware: function (connect, options) {
                    var middlewares = [];

                    var rules = [
                        '^/binary-static/(.*)$ /$1'
                    ];
                    middlewares.push(rewrite(rules));

                    if (!Array.isArray(options.base)) {
                        options.base = [options.base];
                    }

                    var directory = options.directory || options.base[options.base.length - 1];
                    options.base.forEach(function (base) {
                        middlewares.push(serveStatic(base));
                    });

                    middlewares.push(serveIndex(directory));

                    return middlewares;
                }
            }
        }
    };
};

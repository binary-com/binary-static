var path = require('path');
module.exports = {
    // todo: actually implement this
    entry: './src/javascript/entry-point.js',
    resolve: {
        root: [
            path.resolve('./src/javascript'),
        ],
        alias: {
            common_functions: path.resolve('./src/javascript/binary/common_functions'),
            attach_dom:       path.resolve('./src/javascript/binary/common_functions/attach_dom'),
            components:       path.resolve('./src/javascript/binary/components'),
            static_pages:     path.resolve('./src/javascript/binary/static_pages'),
            websocket_pages:  path.resolve('./src/javascript/binary/websocket_pages'),
            binary_japan:     path.resolve('./src/javascript/binary_japan'),
        },
    },
    output: {
        filename: 'dist.js',
    },
};

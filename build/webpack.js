module.exports = function (grunt) {
    return {
        all: {
            devtool: 'source-map',
            entry: {
                app: './src/javascript/index.js',
            },
            output: {
                path: global.dist + '/js/',
                filename: 'binary_pack.js',
            },
        }
    }
};

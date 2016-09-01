module.exports = function (grunt) {
    return {
        all: {
            devtool: 'source-map',
            entry: {
                app: './src/javascript/index.js',
            },
            output: {
                path: './src/javascript',
                filename: 'binary_pack.js',
            },
        }
    }
};

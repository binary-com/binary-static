module.exports = function (grunt) {
    return {
        all: {
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

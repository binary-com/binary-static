module.exports = {
    all: {
        options: {
            reporter         : 'spec',
            quiet            : false, // Optionally suppress output to standard out (defaults to false)
            clearRequireCache: false, // Optionally clear the require cache before running tests (defaults to false)
            require: [
                'babel-register',
                'jsdom-global/register',
                'mock-local-storage',
            ],
        },
        src: [
            '!src/javascript/**/__tests__/*.js',
            'src/javascript/app_2/**/__tests__/*.js',
            '!scripts/__tests__/*.js',
        ],
    },
};

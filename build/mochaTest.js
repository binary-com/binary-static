module.exports = {
    all: {
        options: {
            reporter         : 'spec',
            quiet            : false, // Optionally suppress output to standard out (defaults to false)
            clearRequireCache: false, // Optionally clear the require cache before running tests (defaults to false)
            require: [
                'babel-register',
                'babel-polyfill',
                'jsdom-global/register',
                'mock-local-storage',
                'url-polyfill',
            ],
        },
        src: [
            'src/javascript/app_2/Utils/URL/__tests__/*js',
        ],
    },
};

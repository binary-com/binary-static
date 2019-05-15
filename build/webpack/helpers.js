const PATHS = require('./paths');

const makeCacheGroup = (name, priority, ...matches) => ({
    [name]: {
        name,
        priority,
        chunks  : 'initial',
        enforce : true,
        filename: '[name].min.js',
        test    : new RegExp(`^${matches.map(m => `(?=.*${m})`).join('')}`),
    },
});

const publicPathFactory = (grunt) => () => (
    (global.is_release || grunt.file.exists(PATHS.ROOT, 'scripts/CNAME') ? '' : '/binary-static') +
    (global.branch ? `/${global.branch_prefix}${global.branch}` : '') +
    '/js/'
);

module.exports = {
    makeCacheGroup,
    publicPathFactory,
};

module.exports = function (grunt) {
    return {
        all: {
            options: {
                base: 'dist',
                add: (grunt.option('cleanup') ? false : true),
                message: 'Auto-generated commit',
            },
            src: global.branch ? [global.branch_prefix + global.branch + '/**'] : ['**', '!' + global.branch_prefix + '*/**']
        }
    }
};

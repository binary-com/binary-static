module.exports = function (grunt) {
    return {
        main: {
            options: {
                add    : (grunt.option('cleanup') ? false : true),
                base   : 'dist',
                branch : 'gh-pages',
                message: global.release_target ? 'Release to ' + global.release_target : 'Auto-generated commit',
            },
            src: global.branch ? [global.branch_prefix + global.branch + '/**'] : ['**', '!' + (global.branch_prefix || 'br_') + '*/**']
        },
        trigger_tests: {
            options: {
                add    : true,
                base   : 'dist',
                branch : 'master',
                repo   : 'git@github.com:binary-com/binary-static-ci.git',
                message: 'Trigger tests',
            },
            src: grunt.cli.tasks[0] === 'release' && global.release_target === 'staging' ? 'version' : '',
        },
    }
};

module.exports = function (grunt) {
    // map release parameters to the required branch, origin, and target gh-pages sub-folder
    global.release_config = {
        production  : { branch: 'master',       target_folder: '',             origin: 'git@github.com:binary-static-deployed/binary-static.git', CNAME: 'www.binary.com' },
        staging     : { branch: 'master',       target_folder: '',             origin: 'git@github.com:binary-com/binary-static.git',             CNAME: 'staging.binary.com' },
        translations: { branch: 'translations', target_folder: 'translations', origin: 'git@github.com:binary-com/binary-static.git',             CNAME: 'staging.binary.com' },
    };

    if (grunt.cli.tasks[0] === 'release') {
        Object.keys(global.release_config).forEach(function (target) {
            if (grunt.option(target)) {
                global.release_target = target;
            }
        });
    }

    if (global.release_target) {
        global.release_info  = global.release_config[global.release_target];
        global.branch_prefix = '';
        global.branch        = global.release_info.target_folder;
    } else {
        global.branch_prefix = 'br_';
        global.branch        = grunt.option('branch');
    }

    global.dist = `dist${global.branch ? `/${global.branch_prefix}${global.branch}` : ''}`;
    global.path = grunt.option('path');

    global.compileCommand = function(params) {
        return 'cd ' + process.cwd() + '/scripts && carton exec perl compile.pl ' + params + (global.branch ? ' -b ' + global.branch_prefix + global.branch : '') + (global.path ? ' -p ' + global.path : '') + ' && cd ..';
    };

    require('time-grunt')(grunt);

    require('load-grunt-config')(grunt, {
        configPath: process.cwd() + '/build',
        loadGruntTasks: {
            pattern: 'grunt-*',
            config : require('./package.json'),
            scope  : 'devDependencies',
        },
    });
};

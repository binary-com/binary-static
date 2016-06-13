module.exports = function (grunt) {
    return {
        compile_dev: {
            command: global.compileCommand('-f -d'),
            options: {
                stdout: true
            }
        },
        compile_production: {
            command: global.compileCommand('-f'),
            options: {
                stdout: true
            }
        },
        sitemap: {
            command: 'cd ' + process.cwd() + '/scripts && carton exec perl sitemap.pl',
            options: {
                stdout: true
            }
        },
        make_cname: {
            command: 'git config --get remote.origin.url',
            options: {
                callback: function (err, stdout, stderr, cb) {
                    if(!err) {
                        if(grunt.option('cleanup')) {
                            var origin = stdout.replace('\n', ''),
                                CNAME;
                            if (origin === 'git@github.com:binary-com/binary-static.git') {
                                CNAME = 'staging.binary.com';
                            } else if (origin === 'git@github.com:binary-static-deployed/binary-static.git') {
                                CNAME = 'www.binary.com';
                            }
                            if (CNAME) {
                                grunt.file.write(global.dist + '/CNAME', CNAME);
                                grunt.log.ok('CNAME file created: ' + CNAME);
                            } else {
                                grunt.log.error('CNAME file is not created: remote origin does not match.');
                            }
                        }
                    }
                    cb();
                },
                stdout: false
            }
        },
        all: {
            nightwatch: {
                command: 'nightwatch',
                options: {
                    stderr: false,
                    execOptions: {
                        cwd: 'test/integration'
                    }
                }
            },
            browserstack: {
                command: 'nightwatch -c browserstack.json',
                options: {
                    stderr: false,
                    execOptions: {
                        cwd: 'test/integration'
                    }
                }
            },
            smoke: {
                command: 'nightwatch -g tests/smoke-tests',
                options: {
                    stderr: false,
                    execOptions: {
                        cwd: 'test/integration'
                    }
                }
            },
            continuous: {
                command: 'nightwatch -t test',
                options: {
                    stderr: false,
                    execOptions: {
                        cwd: 'test/continuous'
                    }
                }
            }
        }
    }
};
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
                            if (origin === global.repos.staging.origin) {
                                CNAME = global.repos.staging.CNAME;
                            } else if (origin === global.repos.production.origin) {
                                CNAME = global.repos.production.CNAME;
                            }
                            if (CNAME) {
                                grunt.file.write(global.dist + '/CNAME', CNAME + "\n");
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
        check_origin: {
            command: 'git config --get remote.origin.url',
            options: {
                callback: function (err, stdout, stderr, cb) {
                    if(!err) {
                        var origin = stdout.replace('\n', '');
                        grunt.log.ok('origin: ' + origin);
                        if (grunt.option('staging')) {
                            if (origin !== global.repos.staging.origin) {
                                grunt.fail.fatal('Your remote origin does not match the STAGING repository.');
                            }
                        } else if (grunt.option('production')) {
                            if (origin !== global.repos.production.origin) {
                                grunt.fail.fatal('Your remote origin does not match the PRODUCTION repository.');
                            }
                        } else {
                            grunt.fail.fatal('Target is required: use --staging or --production to do a release.');
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

module.exports = {
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
};
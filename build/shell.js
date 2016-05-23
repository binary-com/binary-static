module.exports = {
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
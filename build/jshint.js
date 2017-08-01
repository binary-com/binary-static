module.exports = {
    all: {
        options: {
            jshintrc: true,
            ignores: ['src/javascript/lib/**/*.js', 'src/javascript/binary/**/__tests__/*.js'],
            reporterOutput: ''
        },
        src: 'src/javascript/**/*.js'
    }
};

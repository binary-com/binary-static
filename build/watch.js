module.exports = {
    css: {
        files: ['src/sass/**/*.scss'],
        tasks: ['css']
    },
    js: {
        files: ['src/javascript/**/*.js'],
        tasks: ['js']
    },
    options: {
        spawn: false,
        interrupt: true,
        debounceDelay: 250
    }
};

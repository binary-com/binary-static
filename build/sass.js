module.exports = {
    all: {
        options: {
            style: 'expanded'
        },
        files: [{
            expand: true,
            cwd   : 'src/sass',
            src   : ['*.scss'],
            dest  : global.dist + '/css',
            ext   : '.css',
        }]
    }
};
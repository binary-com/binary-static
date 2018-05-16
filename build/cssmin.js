module.exports = {
    all: {
        options: {
            inline: ['none'],
        },
        files: [
            {
                src: [
                    global.dist + '/css/common.css',
                    process.cwd() + '/node_modules/@binary-com/binary-style/binary.css',
                    process.cwd() + '/node_modules/@binary-com/binary-style/binary.more.css',
                ],
                dest: global.dist + '/css/common.min.css',
            },
            {
                expand: true,
                cwd   : global.dist + '/css',
                src   : ['app.css', 'static.css', 'app_2.css'],
                dest  : global.dist + '/css',
                ext   : '.min.css',
            },
        ],
    },
};

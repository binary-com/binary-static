module.exports = {
    all: {
        options: {
            inline: ['none'],
        },
        files: [
            {
                src: [
                    global.dist + '/css/binary.css',
                    process.cwd() + '/node_modules/binary-style/binary.css',
                    process.cwd() + '/node_modules/binary-style/binary.more.css',
                ],
                dest: global.dist + '/css/binary.min.css',
            },
        ],
    },
};

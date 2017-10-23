module.exports = {
    all: {
        options: {
            inline: ['none'],
        },
        files: [
            {
                src: [global.dist + '/css/binary.css'],
                dest: global.dist + '/css/binary.min.css',
            },
        ],
    },
};

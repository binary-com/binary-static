module.exports = {
    all: {
        options: {
            separator: '\n;',
        },
        files: [
            {
                dest: global.dist + '/js/binary.js',
                src: [
                    global.dist + '/js/binary_pack.js',
                    'src/javascript/lib/guide.enjoyhint.js',
                ]
            }
        ]
    }
};

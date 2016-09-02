module.exports = {
    all: {
        options: {
            sourceMap: true,
            sourceMapIncludeSources: true,
        },
        files: [
            {dest: global.dist + '/js/binary.min.js', src: global.dist + '/js/binary.js'}
        ]
    }
};

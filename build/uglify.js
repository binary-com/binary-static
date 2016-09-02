module.exports = {
    all: {
        options: {
            sourceMap: true,
            sourceMapIncludeSources: true,
        },
        files: [
            {dest: global.dist + '/js/binary.min.js', src: global.dist + '/js/binary.js'},
            {dest: global.dist + '/js/binary_pack.min.js', src: global.dist + '/js/binary_pack.js'}
        ]
    }
};

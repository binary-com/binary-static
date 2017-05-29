module.exports = {
    all: {
        files: [
            { src: ['src/css/external/**/*.css', global.dist + '/css/binary.css'], dest: global.dist + '/css/binary.min.css' },
            //{dest: global.dist + '/css/binary_rtl.min.css', src: ['src/css/external/**/*.css', global.dist + '/css/binary_rtl.css']}
        ]
    }
};

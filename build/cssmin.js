module.exports = {
    all: {
        files: [
            {dest: global.dist + '/css/binary.min.css', src: ['src/css/external/**/*.css', global.dist + '/css/binary.css']},
            {dest: global.dist + '/css/binary_rtl.min.css', src: ['src/css/external/**/*.css', global.dist + '/css/binary_rtl.css']}
        ]
    }
};

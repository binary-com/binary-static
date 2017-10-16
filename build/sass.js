module.exports = {
    all: {
        options: {
            style: 'expanded'
        },
        files: [
            { src: 'src/sass/binary.scss',    dest: global.dist + '/css/binary.css' },
            { src: 'src/sass/ico.scss',       dest: global.dist + '/css/ico.css' },
            { src: 'src/sass/hackathon.scss', dest: global.dist + '/css/hackathon.css' },
            { src: 'src/sass/signup-landing.scss', dest: global.dist + '/css/signup-landing.css' },
            //{dest: global.dist + '/css/binary_rtl.css', src: 'src/sass/binary_rtl.scss'}
        ]
    }
};

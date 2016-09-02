module.exports = {
    all: {
        options: {
            separator: '\n;',
        },
        files: [
            {
                dest: global.dist + '/js/binary.js',
                src: [
                    'src/javascript/lib/jquery.js',
                    'src/javascript/lib/highstock/highstock.js',
                    'src/javascript/lib/highstock/highstock-exporting.js',
                    'src/javascript/lib/moment/moment.js',
                    'src/javascript/lib/**/*.js',
                    global.dist + '/js/binary_pack.js',
                ]
            }
        ]
    }
};

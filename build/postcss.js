module.exports = {
    options: {
        processors: [
            require('autoprefixer-core')({browsers: ['last 2 version']})
        ]
    },
    dist: {
        src: global.dist + '/css/binary.css'
    }
};

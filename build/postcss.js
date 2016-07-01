module.exports = {
    options: {
        processors: [
            require('autoprefixer-core')({browsers: ['last 2 version', 'last 5 iOS versions', 'last 3 Safari versions']})
        ]
    },
    dist: {
        src: global.dist + '/css/binary.css'
    }
};

module.exports = {
    all: {
        options: {
            syntax: require('postcss-scss') // work with SCSS directly
        },
        src: [
            'src/sass/**/*.scss',
            '!src/sass/external/**/*.scss',
            '!src/sass/_constants.scss',
            '!src/sass/mixin.scss',
            '!src/sass/reset.scss'
        ]
    }
};

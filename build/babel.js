module.exports = {
    landing_pages: {
        options: {
            minified  : true,
            plugins   : ['transform-remove-strict-mode'],
            presets   : ['env'],
            sourceMap : true,
            sourceType: 'script',
        },
        files: [
            {
                expand: true,
                cwd   : 'src/javascript/landing_pages/',
                src   : ['*.js'],
                dest  : global.dist + '/js/landing_pages/'
            },
        ],
    }
};

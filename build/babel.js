module.exports = {
    landing_pages: {
        options: {
            minified  : true,
            plugins   : ['transform-remove-strict-mode'],
            presets   : ['es2015'],
            sourceMap : true,
            sourceType: 'script',
        },
        files: [
            {
                expand: true,
                cwd   : 'src/javascript/lib/landing_pages/',
                src   : ['*.js'],
                dest  : global.dist + '/js/landing_pages/'
            },
        ],
    },
};

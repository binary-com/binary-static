module.exports = {
    landing_pages: {
        options: {
            minified  : true,
            sourceMap : true,
            sourceType: 'script',
            presets   : ['es2015'],
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

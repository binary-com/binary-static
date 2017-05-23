module.exports = {
    all: {
        files: [
            {
                expand: true,
                src: [
                    'index.html',
                    '404.html',
                    'sitemap.xml',
                    'robots.txt'
                ],
                dest: global.dist
            },
            { expand: true, cwd: 'src/config/', src: ['**'], dest: global.dist + '/config/' },
            { expand: true, cwd: 'src/images/', src: ['**'], dest: global.dist + '/images/', },
            { expand: true, cwd: 'src/download/', src: ['**'], dest: global.dist + '/download/' },
            { expand: true, cwd: 'src/css/external/jquery-ui-custom-theme/images/', src: ['**'], dest: global.dist + '/css/images' },
            { expand: true, cwd: 'src/css/external/jquery-ui-custom-theme/', src: ['*.css'], dest: global.dist + '/css/' },
            { expand: true, cwd: 'src/javascript/lib/pushwooshSDK/', src: ['**'], dest: global.dist }, /* serves pushwoosh sdks from root */
            { expand: true, cwd: 'src/javascript/lib/ico/', src: ['**'], dest: global.dist + '/js/ico/' },
        ]
    }
};

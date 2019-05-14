const sass = require('node-sass');

module.exports = {
    app: {
        options:  {
            style: 'expanded',
            implementation: sass,
        },
        files: [{
            cwd   : 'src/sass',
            dest  : `${global.dist}/css`,
            expand: true,
            ext   : '.css',
            src   : ['*.scss'],
        }]
    }
};

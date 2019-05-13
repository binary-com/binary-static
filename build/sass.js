const sass = require('node-sass');

module.exports = function (grunt) {
    const options = {
        style: 'expanded',
        implementation: sass,
    };

    const generateConfig = (src, dest) => ({
        options,
        files: [{
            expand: true,
            cwd   : 'src/sass',
            src,
            dest,
            ext   : '.css',
        }]
    });

    const config = {
        app: generateConfig(['*.scss'], `${global.dist}/css`),
        get all() {
            return {
                options,
                files: [
                    ...this.app.files,
                ],
            };
        },
    };

    return { [global.section]: config[global.section] };
};

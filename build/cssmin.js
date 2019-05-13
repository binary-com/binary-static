module.exports = function (grunt) {
    const files = {
        app: [
            {
                src: [
                    `${global.dist}/css/common.css`,
                    `${global.node_modules_paths.binary_style}/binary.css`,
                    `${global.node_modules_paths.binary_style}/binary.more.css`,
                ],
                dest: `${global.dist}/css/common.min.css`,
            },
            { src: `${global.dist}/css/app.css`,    dest: `${global.dist}/css/app.min.css` },
            { src: `${global.dist}/css/static.css`, dest: `${global.dist}/css/static.min.css` },
        ],
        get all() {
            return [
                ...this.app,
            ];
        },
    };

    return {
        [global.section]: {
            options: {
                inline: ['none'],
            },
            files: files[global.section],
        },
    };
};

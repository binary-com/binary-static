module.exports = {
    app: {
        options: {
            inline: ['none'],
        },
        files: [
            {
                src: [
                    `${global.dist}/css/common.css`,
                    `${global.node_modules_paths.binary_style}/binary.css`,
                    `${global.node_modules_paths.binary_style}/binary.more.css`,
                ],
                dest: `${global.dist}/css/common.min.css`,
            },
            { src: `${global.dist}/css/app.css`,                                dest: `${global.dist}/css/app.min.css` },
            { src: `${global.node_modules_paths.deriv_p2p}/lib/main.css`,       dest: `${global.dist}/css/p2p.min.css` },
            { src: `${global.node_modules_paths.deriv_dashboard}/lib/main.css`, dest: `${global.dist}/css/dashboard.min.css` },
            { src: `${global.dist}/css/static.css`,                             dest: `${global.dist}/css/static.min.css` },
        ],
    },
};

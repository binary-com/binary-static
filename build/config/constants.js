const targets_config = {
    production: {
        origin: 'git@github.com:binary-static-deployed/binary-static.git',
        CNAME : 'www.binary.com',
    },
    staging: {
        origin: 'git@github.com:binary-com/binary-static.git',
        CNAME : 'staging.binary.com',
    },
};

// map release parameters to the required branch, origin, CNAME, and target gh-pages sub-folder
const release_config = {
    production  : { branch: 'master',       target_folder: '',             origin: targets_config.production.origin, CNAME: targets_config.production.CNAME },
    staging     : { branch: 'master',       target_folder: '',             origin: targets_config.staging.origin,    CNAME: targets_config.staging.CNAME },
    translations: { branch: 'translations', target_folder: 'translations', origin: targets_config.staging.origin,    CNAME: targets_config.staging.CNAME },
};

const node_modules_paths = {
    binary_style: 'node_modules/@binary-com/binary-style',
    smartcharts : 'node_modules/@binary-com/smartcharts',
};

const config = {
    branch_prefix  : 'br_',
    valid_sections : ['all', 'app', 'app_2'],
    default_section: 'all',
    app_2_folder   : 'app',
};

module.exports = {
    release_config,
    node_modules_paths,
    config,
};

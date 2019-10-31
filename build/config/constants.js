const release_targets = {
    production: {
        repo : 'git@github.com:binary-static-deployed/binary-static.git',
        CNAME: 'www.binary.com',
    },
    staging: {
        repo : 'git@github.com:binary-com/binary-static.git',
        CNAME: 'staging.binary.com',
    },
};

/**
 * branch        : the required branch that should be checked out when releasing
 * target_folder : the folder name in gh-pages to release to
 * origin        : the required origin that local clone should point to (also the target repo to release to, when `target_repo` not available)
 * target_repo   : the target repo to release to
 * CNAME         : creates a CNAME file based on this entry to push alongside the release when needed
 */
const release_config = {
    production: {
        branch       : 'master',
        target_folder: '',
        origin       : release_targets.production.repo,
        CNAME        : release_targets.production.CNAME,
    },
    staging: {
        branch       : 'master',
        target_folder: '',
        origin       : release_targets.staging.repo,
        CNAME        : release_targets.staging.CNAME,
    },
    translations: {
        branch       : 'master',
        target_folder: 'translations',
        origin       : release_targets.staging.repo,
        CNAME        : release_targets.staging.CNAME,
    },
};

const node_modules_paths = {
    binary_style: 'node_modules/@binary-com/binary-style',
};

const config = {
    branch_prefix: 'br_',
    section      : 'app',
};

module.exports = {
    release_config,
    node_modules_paths,
    config,
};

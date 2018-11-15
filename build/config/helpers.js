const Constants = require('./constants');

const isRelease = (grunt) => grunt.cli.tasks[0] === 'release';

const getReleaseTarget = (grunt) => Object.keys(global.release_config).find(grunt.option);

const getSection = (grunt) => {
    const section = grunt.option('section') || Constants.config.default_section;

    if (!Constants.config.valid_sections.includes(section)) {
        grunt.fail.fatal(`Unknown section: '${section}'.\nValid sections are: ${Constants.config.valid_sections.join(', ')}.`);
    }

    return section;
};

const checkSection = (grunt) => {
    if (!grunt.option('section')) {
        grunt.fail.fatal(`It is mandatory to specify the section when releasing.\nValid sections are: ${Constants.config.valid_sections.join(', ')}`);
    }
};

const getDistPath = () => `dist${global.branch ? `/${global.branch_prefix}${global.branch}` : ''}`;

const generateCompileCommand = (params) => (
    [
        `cd ${process.cwd()}`,
        '&& ./scripts/render.js',
        ...[ // parameters
            params || '',
            global.branch ? `-b ${global.branch_prefix}${global.branch}` : '',
            global.path ? `-p ${global.path}` : '',
            `-s ${global.section}`,
        ],
    ].join(' ')
);

module.exports = {
    isRelease,
    getReleaseTarget,
    getSection,
    checkSection,
    getDistPath,
    generateCompileCommand,
};

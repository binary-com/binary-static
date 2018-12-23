const path             = require('path');
const common           = require('../../scripts/common');
const {
    getDefaultPath,
    gitIgnoreToArray,
    flatten,
    fetchFiles,
    renameFiles,
    validateFilename,
    convertToSnakeCase } = require('../utils/cli');

const ignored_files = gitIgnoreToArray();

module.exports = function(grunt) {
    grunt.initConfig({
        checkImagesNamingConvention: {},
    });

    grunt.registerTask('check_image_naming_convention', 'Check naming convention for images', () => {
        const default_path  = getDefaultPath(grunt.option('section'));
        const where_to_look = path.resolve(common.root_path, `src/images/${default_path}/`);
        grunt.log.writeln(`Searching for images with bad naming.\nSearching: src/images/${default_path}`);
        // Actual test is running from here. if in the future, the naming convention has changed
        // you can update validateFilename function with a new regex. We also used camelCase
        // function from lodash, that should be changed as well.
        const images = fetchFiles(where_to_look);

        const flattened = flatten(images)
            .filter(item => !!item &&
                !ignored_files.some(ignored => path.resolve(common.root_path, ignored) === item.path));

        const bad_file_names = {};
        flattened.forEach(item => {
            Object.assign(bad_file_names,
                validateFilename(item.filename.split('.')[0]) ? null : { [item.filename]: item.relative_path },
            );
        });

        Object.keys(bad_file_names).forEach((key) => (bad_file_names[key] == null) && delete bad_file_names[key]);
        if (!bad_file_names) {
            grunt.log.subhead(`${flattened.length} files check for naming convention. Searching inside src/images/${default_path}/`.green);
            return true;
        }
        grunt.log.error(`${Object.keys(bad_file_names).length} files found with bad naming, issue a fix: `);
        Object.keys(bad_file_names).forEach(item => {
            const error_message = `${bad_file_names[item]} >> ${`${convertToSnakeCase(item, grunt)}`.bold}`;
            grunt.log.writeln(error_message);
        });

        grunt.log.writeln('\n'.repeat(2));
        if (grunt.option('auto-fix')) {
            grunt.log.ok('Attempting to rename the files...');
            renameFiles(bad_file_names, grunt.option('dry-run'), grunt.log.writeln);
            return true;
        }

        grunt.log.error('Use --auto-fix option to fix automatically.');
        grunt.log.error('Use --dry-run in combination with --auto-fix, if you are not sure that you want to rename all the files.');
        grunt.fail.warn(`Found ${Object.keys(bad_file_names).length} invalid files. please resolve this issue or use another asset.`);
        return false;

    });
};

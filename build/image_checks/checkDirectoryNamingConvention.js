const path                    = require('path');
const fs                      = require('fs');
const common                  = require('../../scripts/common');
const {
    getDefaultPath,
    getDirectoryReferences,
    gitIgnoreToArray,
    flatten,
    fetchDirectories,
    renameFiles,
    validateFilename,
    convertToSnakeCase }      = require('../utils/cli');

const ignored_files = gitIgnoreToArray();

const renameReferences = (files, search, is_dry_run, logger) => {
    getDirectoryReferences(search)
        .forEach(item => {

            item.map(found => {
                if (found.reference != null) {
                    let filename  = found.reference.split('/');
                    filename.pop();
                    filename = filename.join('/');
                    const converted = convertToSnakeCase(filename);
                    if (filename !== converted) {
                        if (!is_dry_run) {
                            // we should update
                            const file     = fs.readFileSync(path.resolve(common.root_path, found.path),
                                'utf8',
                            );
                            const replaced = file.replace(filename, converted);
                            if (replaced !== file) {
                                fs.writeFileSync(path.resolve(common.root_path, found.path), replaced, 'utf8');
                            }
                        }
                        let message = '';
                        if (is_dry_run) {
                            message = 'dry-run >>';
                        }
                        logger(`${message} ${filename} in ${found.path}:${found.line} to ${converted}`);
                    }
                }
            });
        });
};

module.exports = function(grunt) {
    grunt.initConfig({
        checkImagesNamingConvention: {},
    });

    grunt.registerTask('check_directory_naming_convention', 'Check naming convention for image directories', () => {
        const default_path  = getDefaultPath(grunt.option('section'));
        const where_to_look = path.resolve(common.root_path, `src/images/${default_path}/`);
        grunt.log.writeln(`Searching for directories with bad naming.\nSearching: src/images/${default_path}`);
        // Actual test is running from here. if in the future, the naming convention has changed
        // you can update validateFilename function with a new regex. We also used camelCase
        // function from lodash, that should be changed as well.
        const directories = fetchDirectories(where_to_look);

        const flattened = flatten(directories)
            .filter(item => !!item &&
                !ignored_files.some(ignored => ignored === item.filename));

        const bad_file_names = {};
        flattened.forEach(item => {
            Object.assign(bad_file_names, validateFilename(item.filename) ? null : {
                [item.filename]: {
                    relative_path: item.relative_path,
                    path         : item.path,
                },
            });
        });

        Object.keys(bad_file_names).forEach((key) => (bad_file_names[key] == null) && delete bad_file_names[key]);
        if (!bad_file_names || (bad_file_names && Object.keys(bad_file_names).length === 0)) {
            grunt.log.subhead(`${flattened.length} directories check for naming convention. Searching inside src/images/${default_path}/`.green);
            return true;
        }
        grunt.log.error(`${Object.keys(bad_file_names).length} directories found with bad naming, issue a fix: `);
        Object.keys(bad_file_names).forEach(item => {
            const error_message = `${bad_file_names[item].relative_path} >> ${`${convertToSnakeCase(item,
                grunt,
            )}`.bold}`;
            grunt.log.writeln(error_message);
        });

        grunt.log.writeln('\n'.repeat(2));
        if (grunt.option('auto-fix')) {
            const source_directory = [
                path.resolve(common.root_path, `src/javascript/${default_path}`),
                path.resolve(common.root_path, `src/sass/${default_path}`),
            ];
            grunt.log.ok('Attempting to rename the files...');
            renameFiles(bad_file_names, grunt.option('dry-run'), grunt.log.writeln);

            grunt.log.ok('Attempting to fix the source files to match renamed files...');
            renameReferences(bad_file_names,
                source_directory,
                !!grunt.option('dry-run'),
                grunt.log.writeln
            );
            return true;
        }

        grunt.log.error('Use --auto-fix option to fix automatically.');
        grunt.log.error(
            'Use --dry-run in combination with --auto-fix, if you are not sure that you want to rename all the files.');
        grunt.fail.warn(`Found ${Object.keys(bad_file_names).length} invalid files. please resolve this issue or use another asset.`);
        return false;

    });
};

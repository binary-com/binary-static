const path   = require('path');
const fs     = require('fs');
const common = require('../scripts/common');
const prompt = require('./utils/cli').prompt;
const snakeCase = require('lodash').snakeCase;

const ignored_files = [];

module.exports = function(grunt) {
    prompt('Checking for images with bad naming...');
    grunt.initConfig({
        checkImagesNamingConvention: {},
    });

    grunt.registerTask('image_naming_convention', 'Check naming convention for images', () => {
        const default_path = grunt.option('all') ? '' : 'app_2';
        const where_to_look = path.resolve(common.root_path, `src/images/${default_path}/`);

        /**
         * Recursively fetches all the files.
         * @param dir
         * @returns {any[]}
         */
        const fetchFiles = dir => {
            const directory = fs.readdirSync(dir);
            return directory.map(file => {
                if (fs.statSync(path.join(dir, file)).isDirectory()) {
                    return fetchFiles(path.join(dir, file));
                }
                return {
                    filename    : file,
                    path        : dir,
                };
            });
        };

        const validateFilename = (name) => {
            const validations = [
                (name) => /^_{0}([a-z0-9]+[_]*)+(?<!_)$/.test(name),
            ];

            return validations.every(validation => {
                return validation(name);
            });
        };

        const convertToSnakeCase = (item) => {
            let correct_name = snakeCase(item.split('.')[0]);
            correct_name += `.${item.split('.')[1]}`;
            return correct_name;
        };

        const renameFiles = (bad_file_names) => {
            Object.keys(bad_file_names).forEach(item => {
                const converted = convertToSnakeCase(item);
                if (!grunt.option('dry-run')) {
                    fs.renameSync(
                        path.join(bad_file_names[item], item),
                        path.join(bad_file_names[item], converted)
                    );
                }

                grunt.log.ok(`${grunt.option('dry-run')? 'dry-run >> ': ''}${bad_file_names[item]}/${item} converted to ${converted}.`)
            });
        };

        /**
         * Flatten any depth of array.
         * @param arr
         * @returns {*}
         */
        const flatten = arr => {
            const index = arr.findIndex(el => Array.isArray(el));
            if (index > -1) {
                arr.splice(index, 1, ...arr[index]);
                return flatten(arr);
            }

            return arr;
        };

        // Actual test is running from here. We can check for other directories as well, but it is highly unlikely that
        // someone put a duplicate in other folders. This grunt task will accept a --all option. --all option will try
        // to check every single file inside images directory. if no option is provided, only the images inside
        // app_2 will be processed.
        const images = fetchFiles(where_to_look);

        const flattened  = flatten(images)
            .filter(item => !!item)
            .filter(item => !ignored_files.some(ignored => path.resolve(common.root_path, ignored) === item.path));

        const bad_file_names = {};
        flattened.forEach(item => {
            Object.assign(bad_file_names, validateFilename(item.filename.split('.')[0]) ? null : {[item.filename]: item.path});
        });

        Object.keys(bad_file_names).forEach((key) => (bad_file_names[key] == null) && delete bad_file_names[key]);
        if (!bad_file_names) {
            grunt.log.subhead(`${flattened.length} files check for naming convention.`.green);
            return true;
        } else {
            grunt.log.subhead(`${flattened.length} files found with bad naming, issue a fix: `);
            Object.keys(bad_file_names).forEach(item => {
                const error_message = `file ${bad_file_names[item]}/${item} should be changed to ${convertToSnakeCase(item)}`.bold;
                grunt.log.ok(error_message);
            });

            grunt.log.writeln('\n'.repeat(2));
            if (grunt.option('auto-fix')) {
                grunt.log.ok('Attempting to rename the files...')
                renameFiles(bad_file_names)
                return true;
            }

            grunt.log.ok(`Use --auto-fix option to fix automatically.`);
            grunt.log.ok(`Use --dry-run in combination with --auto-fix, if you are not sure that you want to rename all the files.`);
            grunt.fail.warn(`Found ${Object.keys(bad_file_names).length} invalid files. please resolve this issue or use another asset.`);
            return false;
        }
    });
};

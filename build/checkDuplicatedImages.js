const path   = require('path');
const fs     = require('fs');
const md5    = require('md5');
const common = require('../scripts/common');
const prompt = require('./utils/cli').prompt;

const ignored_files = [];

module.exports = function(grunt) {
    prompt('Checking for duplicates...');
    grunt.initConfig({
        checkDuplicatedImages: {},
    });

    grunt.registerTask('duplicated_images', 'Check for duplicate images based on their content. ', () => {
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
                    hash    : md5(fs.readFileSync(path.join(dir, file))),
                    filename: path.join(dir, file),
                };
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
            .filter(item => !ignored_files.some(ignored => path.resolve(common.root_path, ignored) === item.filename));
        const hashes = {};
        flattened.forEach(item => {
            hashes[item.hash] = [...(hashes[item.hash] || []), item.filename];
        });

        // loop over values of the hashes, report those with more than 1 value
        const duplicated = Object.keys(hashes).filter(hash => {
            return Object.values(hashes[hash]).length > 1;
        });
        if (!duplicated.length) {
            grunt.log.subhead(`Found no duplicate among ${flattened.length} files.`.green);
            return true;
        } else {
            grunt.log.subhead(`Duplicates are found. refer below: `);
            duplicated.forEach((item, index) => {
                const errorMessage = `Hash: ${index+1}: ${item}`.bold;
                grunt.log.writeln(errorMessage);
                grunt.log.error('Files: ');
                grunt.log.writeln(hashes[item].join('\r\n'));
                grunt.log.writeln('\n')
            });

            grunt.log.writeln('\n'.repeat(2));
            grunt.fail.warn(`Found ${duplicated.length} duplicated file. please resolve this issue or use another asset.`);
            return false;
        }
    });
};



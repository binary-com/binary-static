const path   = require('path');
const fs     = require('fs');
const expect = require('chai').expect;
const md5    = require('md5');
const common = require('../scripts/common');
const colors = {
    error: '\\033[0;31m',
    info : '\\033[0;32m',
    warn : '\\033[1;33m',
    reset: '\\033[0m',
};
const prompt = (message, type) => (`echo "${colors[type || 'info']}>>${colors.reset} ${message}"`);

const ignored_files = [];

module.exports = function(grunt) {
    prompt('Checking for duplicates...');
    grunt.initConfig({
        duplicate_check: {},
    });

    grunt.registerTask('duplicate_check', 'Yeah', () => {
        const defaultPath = grunt.option('all') ? '' : 'app_2';
        const whereToLook = path.resolve(common.root_path, `src/images/${defaultPath}/`);

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
        const images = fetchFiles(whereToLook);

        const flattened  = flatten(images)
            .filter(item => !!item)
            .filter(item => !ignored_files.some(ignored => path.resolve(common.root_path, ignored) === item.filename));
        const uniqued    = [];
        const duplicated = [];
        flattened.forEach(item => {
            const found = uniqued.filter(unique => unique.hash === item.hash);
            if (found.length > 0) {
                duplicated.push({
                    original_item  : found[0],
                    duplicated_item: item,
                });
            } else {
                uniqued.push(item);
            }
        });
        if (duplicated.length <= 0) {
            grunt.log.subhead(`Found no duplicate among ${flattened.length} files.`.green);
            return true;
        } else {
            grunt.log.subhead(`Duplicates are found. refer below: `);
            duplicated.forEach((item, index) => {
                const errorMessage = `${index+1}: ${item.original_item.filename}`.bold;
                grunt.log.writeln(errorMessage);
                grunt.log.writeln(`MD5 Hash: ${item.original_item.hash}`.cyan);
                grunt.log.error('Duplicated: ');
                grunt.log.writeln(item.duplicated_item.filename);
                grunt.log.writeln('\n')
            });

            grunt.log.writeln('\n'.repeat(2));
            grunt.fail.warn(`Found ${duplicated.length} duplicated file. please resolve this issue or use another asset.`);
            return false;
        }
    });
};



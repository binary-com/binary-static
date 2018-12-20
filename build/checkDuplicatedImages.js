const path      = require('path');
const common    = require('../scripts/common');
const {
    prompt,
    fetchFiles,
    flatten } = require('./utils/cli');

const ignored_files = [];

module.exports = function(grunt) {
    prompt('Checks for duplicate images based on their content');
    grunt.initConfig({
        checkDuplicatedImages: {},
    });

    grunt.registerTask('duplicated_images', 'Check for duplicate images based on their content. ', () => {
        const default_path  = grunt.option('all') ? '' : 'app_2';
        const where_to_look = path.resolve(common.root_path, `src/images/${default_path}/`);

        // Actual test is running from here. We can check for other directories as well, but it is highly unlikely that
        // someone put a duplicate in other folders. This grunt task will accept a --all option. --all option will try
        // to check every single file inside images directory. if no option is provided, only the images inside
        // app_2 will be processed.
        const images    = flatten(fetchFiles(where_to_look));
        const flattened = flatten(images)
            .filter(item => !!item)
            .filter(item => !ignored_files.some(ignored => path.resolve(common.root_path, ignored) === item.filename));
        const hashes    = {};

        flattened.forEach(item => {
            hashes[item.hash] = [...(hashes[item.hash] || []), { ...item }];
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
                const errorMessage = `Hash: ${index + 1}: ${item}`.bold;
                grunt.log.writeln(errorMessage);
                grunt.log.error('Files: ');
                hashes[item].forEach(file => {
                    grunt.log.writeln(`${file.full_path}`);
                });
                grunt.log.writeln('\n');
            });

            grunt.log.writeln('\n'.repeat(2));
            grunt.fail.warn(`Found ${duplicated.length} duplicated file. please resolve this issue or use another asset.`);
            return false;
        }
    });
};



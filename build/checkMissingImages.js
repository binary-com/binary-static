const path         = require('path');
const fs           = require('fs');
const common       = require('../scripts/common');
const {
    prompt,
    flatten,
    fetchFiles } = require('./utils/cli');

const ignored_files            = [];

const ignored_language_directories = [];

module.exports = function(grunt) {
    prompt('Checking for missing images...');
    grunt.initConfig({
        checkMissingImages: {},
    });

    grunt.registerTask('check_missing_images', 'check missing images', () => {
        const default_path                = grunt.option('all') ? '' : 'app_2';
        const images_directory            = path.resolve(common.root_path, `src/images/${default_path}/`);
        const javascript_source_directory = [
            path.resolve(common.root_path, `src/javascript/${default_path}`),
            path.resolve(common.root_path, `src/sass/${default_path}`),
        ];

        // Actual test is running from here. Please note that due to the nature of the search we are performing,
        // This will produce errors for the images that are referenced statically. If there is a string
        // manipulation, this script cannot find the reference to it.
        const references = flatten(fetchFiles(javascript_source_directory))
            .filter(item => !!item)
            .filter(item => !ignored_files.some(ignored => path.resolve(common.root_path, ignored) === item.path))
            .map(item => {
                // Search for the occurrence of images, if found, remove the entry from that array.
                const file    = fs.readFileSync(path.resolve(item.path, item.filename), {
                    encoding: 'utf8',
                });
                const matched = file.match(/<img([^>]*)>|background: url([^-color][^;]*)/g);
                return matched;
            })
            .filter(item => !!item)
            .map(item => item.map(line => line.match(/(images)([\/\w\-_d.]+)/g)));

        // Check for existence of the images relative to images directory
        const not_found = [
            ...new Set(flatten(references)
                .filter(item => !!item)
                .filter(item => {
                    return !fs.existsSync(path.resolve(common.root_path, `src/${item}`));
                })),
        ].map(item => {
            grunt.log.ok(`Could not find image: ${item}`);
            return item;
        });
        if (not_found.length) {
            grunt.fail.warn(`Could not find ${not_found.length} images. Check the log above.`);
            return false;
        }
        return true;
    });
};

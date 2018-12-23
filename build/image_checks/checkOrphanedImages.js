const path      = require('path');
const fs        = require('fs');
const common    = require('../../scripts/common');
const {
    prompt,
    flatten,
    fetchFiles } = require('../utils/cli');

const ignored_files            = [];
const ignored_image_extensions = [
    'DS_Store', 'zip',
];

const ignored_language_directories = [
    'en', 'de', 'es', 'fr', 'id', 'it', 'pl', 'pt', 'ru', 'th', 'vi', 'zh_cn', 'zh_tw',
];

module.exports = function(grunt) {
    prompt('Checking for images with bad naming...');
    grunt.initConfig({
        checkOrphanedImages: {},
    });

    grunt.registerTask('check_orphaned_images', 'Check orphaned images', () => {
        const default_path                = grunt.option('all') ? '' : 'app_2';
        const images_directory            = path.resolve(common.root_path, `src/images/${default_path}/`);
        const javascript_source_directory = [
            path.resolve(common.root_path, `src/javascript/${default_path}`),
            path.resolve(common.root_path, `src/sass/${default_path}`),
        ];

        /**
         * Fetch images and its closest directory: e.g. common/close
         * @returns []
         */
        const fetchImagesAndClosestDirectory = (images_directory) => {
            const images               = fetchFiles(images_directory);
            const last_directory_regex = /.*\/([^\/]+)/gm;

            return flatten(images)
                .filter(item => !!item)
                .filter(item => !ignored_files.some(ignored => path.resolve(common.root_path, ignored) === item.path))
                .filter(item => !ignored_image_extensions.some(ignored => item.filename.split('.')[1] === ignored))
                .map(item => {
                    const matches = last_directory_regex.exec(item.path);
                    if (matches) {
                        return `${matches[1]}/${item.filename}`;
                    }
                    return false;
                })
                .filter(item => item)
                .filter(item => !ignored_language_directories.some(ignored => item.startsWith(ignored)));
        };

        // Actual test is running from here. Note that this scripts attempt to find the only absolute relative
        // directory and filename (to detect a broader range of files), this won't allow us to find references
        // that are made using string concatenations or template strings (mostly in app).
        let images_and_closest_directory = fetchImagesAndClosestDirectory(images_directory);
        grunt.log.ok(`Found ${images_and_closest_directory.length} files, looking for references.`);

        flatten(fetchFiles(javascript_source_directory))
            .filter(item => !!item)
            .filter(item => !ignored_files.some(ignored => path.resolve(common.root_path, ignored) === item.path))
            .map(item => {
                // if there is no image to look for, then bail out.
                if (images_and_closest_directory.length === 0) {
                    return false;
                }

                // Search for the occurrence of images, if found, remove the entry from that array.
                const file                   = fs.readFileSync(path.resolve(item.path, item.filename), {
                    encoding: 'utf8',
                });
                images_and_closest_directory = images_and_closest_directory.filter(dir => file.indexOf(dir) === -1);
            });
        if (images_and_closest_directory.length > 0) {
            grunt.log.ok(`Couldn't find references for ${images_and_closest_directory.length} files.`);
            grunt.log.ok('Consider finding usage for the following files: ');
            images_and_closest_directory.forEach(orphan => grunt.log.writeln(`File: ${orphan}`));
            grunt.log.writeln('\n\n\nNOTE: ').bold;
            grunt.log.writeln('='.repeat(80));
            grunt.log.ok(
                'Some of the files above could be used dynamically.\nIf you are going to delete some, proceed with caution.');
            grunt.log.writeln('='.repeat(80));
            return false;
        }
        grunt.log.ok(`Found no orphaned images in ${images_directory}`);
        return true;

    });
};

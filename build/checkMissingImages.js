const path                            = require('path');
const fs                              = require('fs');
const common                          = require('../scripts/common');
const { prompt, flatten, fetchFiles } = require('./utils/cli');

const ignored_files            = [];
const ignored_image_extensions = [
    'DS_Store', 'zip',
];

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

        // Actual test is running from here. We can check for other directories as well, but it is highly unlikely that
        // someone put a duplicate in other folders. This grunt task will accept a --all option. --all option will try
        // to check every single file inside images directory. if no option is provided, only the images inside
        // app_2 will be processed.
        // Since in app_2 we import svg statements, those missing links will be captured by eslint. so we don't
        // need to check that here.
        // we are looking for url($), src={$}, image={$}

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

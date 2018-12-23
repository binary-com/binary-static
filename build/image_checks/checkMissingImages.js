const path         = require('path');
const fs           = require('fs');
const common       = require('../../scripts/common');
const {
    getDefaultPath,
    gitIgnoreToArray,
    flatten,
    fetchFiles }   = require('../utils/cli');

const ignored_files = gitIgnoreToArray();

module.exports = function(grunt) {
    grunt.initConfig({
        checkMissingImages: {},
    });

    grunt.registerTask('check_missing_images', 'check missing images', () => {
        const default_path = getDefaultPath(grunt.option('section'));
        path.resolve(common.root_path, `src/images/${default_path}/`);
        grunt.log.writeln(`Searching for missing images.\nSearching:\nsrc/javascript/${default_path}\nsrc/sass/${default_path}`);
        const source_directories = [
            path.resolve(common.root_path, `src/javascript/${default_path}`),
            path.resolve(common.root_path, `src/sass/${default_path}`),
        ];

        // Actual test is running from here. Please note that due to the nature of the search we are performing,
        // This will produce errors for the images that are referenced statically. If there is a string
        // manipulation, this script cannot find the reference to it.
        const references = flatten(fetchFiles(source_directories))
            .filter(item => !!item &&
                !ignored_files.some(ignored => path.resolve(common.root_path, ignored) === item.path)
            )
            .map(item => {
                // Search for the occurrence of images, if found, remove the entry from that array.
                const file    = fs.readFileSync(path.resolve(item.full_path), {
                    encoding: 'utf8',
                });
                const lines = file.split('\n');
                const matches = [];
                lines.forEach((line, index) => {
                    if (!line) {
                        return;
                    }
                    const matched = line.match(/<img([^>]*)>|background: url([^-color][^;]*)/g);
                    if (matched && matched.length > 0) {
                        matches.push({
                            path   : item.relative_path,
                            line   : index + 1,
                            matched: matched[0],
                        });
                    }
                });

                return matches.length ? matches : null;
            })
            .filter(item => !!item &&
                item.filter(found => {
                    found.reference = /images\/([/\w\-_d.]+)/g.exec(found.matched);
                    if (found.reference) {
                        found.reference = found.reference[1];
                        return found;
                    }
                    return false;
                }));

        // Check for existence of the images relative to images directory
        const not_found = [
            ...new Set(flatten(references)
                .filter(item => !!item.reference &&
                    !(
                        fs.existsSync(
                            path.resolve(
                                common.root_path,
                                `src/images/${default_path}/${item.reference}`
                            )
                        ) ||
                        fs.existsSync(
                            path.resolve(
                                common.root_path,
                                `src/images/app_2/${item.reference}`
                            )
                        )
                    )
                )
            ),
        ].map(item => {
            grunt.log.error(`src/images/${default_path}${item.reference.bold} >> ${item.path}:${item.line}`);
            return item;
        });
        if (not_found.length) {
            grunt.fail.warn(`Could not find ${not_found.length} images. Check the log above.`);
            return false;
        }
        return true;
    });
};

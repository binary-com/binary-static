const path           = require('path');
const fs             = require('fs');
const common         = require('../../scripts/common');

const {
    flatten,
    fetchFiles,
    gitIgnoreToArray,
    getRelativeImagePath,
    getDefaultPath } = require('../utils/cli');

const ignored_files            = gitIgnoreToArray();
const ignored_image_extensions = [
    'DS_Store', 'zip',
];
const ignored_languages = common.languages.map(lng => lng.toLowerCase());

module.exports = function(grunt) {
    grunt.initConfig({
        checkOrphanedImages: {},
    });

    grunt.registerTask('check_orphaned_images', 'Check orphaned images', () => {
        const default_path = getDefaultPath(grunt.option('section'));
        const should_delete = grunt.option('delete');
        const dry_run = !!grunt.option('dry-run');
        const images_directory            = path.resolve(common.root_path, `src/images/${default_path}/`);
        const source_directory            = [
            path.resolve(common.root_path, `src/javascript/${default_path}`),
            path.resolve(common.root_path, `src/sass/${default_path}`),
        ];
        grunt.log.writeln(`Searching for orphaned images.\nSearching:\nsrc/javascript/${default_path}\nsrc/sass/${default_path}`);

        // Actual test is running from here. Note that this scripts attempt to find the only absolute relative
        // directory and filename (to detect a broader range of files), this won't allow us to find references
        // that are made using string concatenations or template strings (mostly in app).
        const images = fetchFiles(images_directory);
        let found = flatten(images)
            .filter(item => !!item &&
                !ignored_files.some(
                    ignored => path.resolve(common.root_path, ignored) === item.path
                ) &&
                !ignored_image_extensions.some(
                    ignored => {
                        const matchingGroups = item.filename.match(/\.[\w\d]{1,5}$/i);
                        return matchingGroups && matchingGroups[0].substring(1) === ignored;
                    }
                )
            );

        grunt.log.ok(`Found ${found.length} files, looking for references.`);

        flatten(fetchFiles(source_directory))
            .filter(
                item => !!item &&
                    !ignored_files.some(ignored => path.resolve(common.root_path, ignored) === item.path)
            )
            .forEach(item => {
                // if there is no image to look for, then bail out.
                if (found.length === 0) {
                    return false;
                }

                // Since language different images may be used dynamically, we remove that check from the list.
                ignored_languages.some(lang => {
                    found = found.filter(dir => {
                        const language_image_regex = new RegExp(`/${lang}/${dir.filename}`);
                        return !language_image_regex.test(dir.full_path);
                    });
                });

                // Search for the occurrence of images, if found, remove the entry from that array.
                const file                   = fs.readFileSync(item.full_path, {
                    encoding: 'utf8',
                });

                if (!file) {
                    return false;
                }

                found = found.filter(dir => file.indexOf(getRelativeImagePath(dir)) === -1);
                return true;
            });
        if (should_delete) {
            found.forEach(orphan => {
                grunt.log.writeln(`${orphan.relative_path} removed.`);
                if (!dry_run) {
                    fs.unlinkSync(orphan.relative_path);
                }
            });
        } else if (found.length > 0) {
            grunt.log.error(`Couldn't find references for ${found.length} files.`);
            grunt.log.writeln('>> Consider find a usage for the following files: ');
            found.forEach(orphan => grunt.log.writeln(`${orphan.relative_path}`));
            grunt.log.writeln('='.repeat(80));
            grunt.log.error(
                'Some of the files above could be used dynamically.\nIf you are going to delete some, proceed with caution.\n' +
                'You can delete all the files automatically by passing --delete option.');
            grunt.log.writeln('='.repeat(80));
            return false;
        }
        grunt.log.ok(`Found no orphaned images in ${images_directory}`);
        return true;
    });
};

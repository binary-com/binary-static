const path      = require('path');
const fs        = require('fs');
const md5       = require('md5');
const snakeCase = require('lodash').snakeCase;
const colors    = require('../config/constants').colors;
const common    = require('../../scripts/common');

const prompt = (message, type) => (`echo "${colors[type || 'info']}>>${colors.reset} ${message}"`);

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

/**
 * Recursively fetches all the files.
 * @returns {any[]}
 * @param location
 */
const fetchFilesFromPath = (location) => {
    const directory = fs.readdirSync(location);
    return directory.map(file => fs.statSync(path.join(location, file))
        .isDirectory() ? fetchFilesFromPath(path.join(location, file)) : {
            filename     : file,
            path         : location,
            hash         : md5(fs.readFileSync(path.join(location, file))),
            full_path    : path.join(location, file),
            relative_path: path.join(location, file).replace(common.root_path, '.'),
        });
};

/**
 * Fetch all files within the given directories
 * @returns {*}
 * @param dir
 */
const fetchFiles = dir => {
    const lookup = dir instanceof Array ? dir : [dir];
    return lookup.map(location => fetchFilesFromPath(location));
};

/**
 * Validate filenames (only lowercase with underscore in between).
 * @param name
 * @returns {*|boolean}
 */
const validateFilename = (name) => {
    const validations = [
        (v) => /^_{0}([a-z0-9]+[_]*)+(?<!_)$/.test(v),
    ];

    return validations.every(validation => validation(name));
};
const convertToSnakeCase = item => snakeCase(item).replace(/_([^_]*)$/, '.$1');

const renameFiles = (bad_file_names, is_dry_run, logger = () => {}) => {
    Object.keys(bad_file_names).forEach(item => {
        const converted = convertToSnakeCase(item);
        if (!is_dry_run) {
            fs.renameSync(
                path.resolve(
                    bad_file_names[item].relative_path
                ),
                path.join(
                    bad_file_names[item].path,
                    converted
                )
            );
        }
        logger(`${is_dry_run ? 'dry-run >>' : ''} ${bad_file_names[item].relative_path} converted to ${converted.bold}`);
    });
};

const gitIgnoreToArray = () => fs.readFileSync(path.resolve(common.root_path, '.gitignore'), 'utf8')
    .split('\n')
    .filter(line => /[^*][^/]$/gi.test(line));

const getDefaultPath = (section) => {
    switch (section) {
        case 'app_2':
            return 'app_2';
        default:
            return '';
    }
};
/**
 * Accept a flatten array of objects (see fetchFiles for return type)
 * @param found_file
 * @returns {string}
 */
const getRelativeImagePath = (found_file) => found_file.relative_path.substring(13).startsWith('app_2')
    ? found_file.relative_path.substring(19)
    : found_file.relative_path.substring(13);

/**
 * Extract references to images
 * @param source_directories
 * @param ignored_files
 * @returns {*}
 */
const getImageReferences = (source_directories, ignored_files = []) => flatten(fetchFiles(source_directories))
    .filter(item => !!item && !ignored_files.some(ignored => path.resolve(common.root_path, ignored) === item.path))
    .map(item => {
        // Search for the occurrence of images, if found, remove the entry from that array.
        const file    = fs.readFileSync(path.resolve(item.full_path), {
            encoding: 'utf8',
        });
        const lines   = file.split('\n');
        const matches = [];
        lines.forEach((line, index) => {
            if (!line) {
                return;
            }
            const matched = line.match(/Images\/app_2\/([^';]*)|<img([^>]*)>|background: url([^-color][^;]*)/g);
            if (matched && matched.length > 0) {
                matches.push({
                    path   : item.relative_path, line   : index + 1, matched: matched[0],
                });
            }
        });

        return matches.length ? matches : null;
    })
    .filter(item => !!item && item.filter(found => {
        found.reference = /images\/([\/\w\-_d.]+)|Images\/app_2\/([\/\w\-_d.]+)/g.exec(found.matched);
        if (found.reference) {
            found.reference = found.reference[2] || found.reference[1];
            return found;
        }
        return false;
    }));

module.exports = {
    prompt,
    flatten,
    fetchFiles,
    validateFilename,
    convertToSnakeCase,
    renameFiles,
    gitIgnoreToArray,
    getDefaultPath,
    getRelativeImagePath,
    getImageReferences,
};

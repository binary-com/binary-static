const path      = require('path');
const fs        = require('fs');
const md5       = require('md5');
const snakeCase = require('lodash').snakeCase;
const colors    = require('../config/constants').colors;

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
            filename : file,
            path     : location,
            hash     : md5(fs.readFileSync(path.join(location, file))),
            full_path: path.join(location, file),
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

const convertToSnakeCase = (item) => {
    let correct_name = snakeCase(item.split('.')[0]);
    correct_name += `.${item.split('.')[1]}`;
    return correct_name;
};

const renameFiles = (bad_file_names, grunt) => {
    Object.keys(bad_file_names).forEach(item => {
        const converted = convertToSnakeCase(item, grunt);
        if (!grunt.option('dry-run')) {
            fs.renameSync(path.join(bad_file_names[item], item), path.join(bad_file_names[item], converted));
        }

        grunt.log.ok(`${grunt.option('dry-run')
            ? 'dry-run >> '
            : ''}${bad_file_names[item]}/${item} converted to ${converted}.`);
    });
};

module.exports = {
    prompt, flatten, fetchFiles, validateFilename, convertToSnakeCase, renameFiles,
};

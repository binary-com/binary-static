#!/usr/bin/env node

/* eslint-disable no-console */
const BabelParser = require('@babel/parser');
const estraverse = require('estraverse');
const fs         = require('fs');
const Path       = require('path');
const common     = require('./common');

const config = {
    base_folder         : './src/javascript/',
    excluded_folders    : ['__tests__', '_common/lib'],
    supported_apps      : ['app', 'app_2'],
    localize_method_name: 'localize',
    ignore_comment      : 'localize-ignore', // put /* localize-ignore */ right after the first argument to ignore
    parser_options      : {
        sourceType: 'module',
        plugins   : [
            'classProperties',
            'decorators-legacy',
            'exportDefaultFrom',
            'exportNamespaceFrom',
            'jsx',
            'objectRestSpread',
        ],
    },
};

const source_strings = {};
const invalid_ranges = [];
const ignored_ranges = [];

const parse = (app_name) => {
    if (!config.supported_apps.includes(app_name)) {
        const error_msg = `The app name '${app_name}' is not supported. Supported apps are: ${config.supported_apps.join(', ')}`;
        throw new Error(error_msg);
    }

    process.stdout.write(common.messageStart('Extracting translation texts'));
    const start_time = Date.now();

    walker(`${config.base_folder}_common`); // common for all 'supported_apps'
    walker(`${config.base_folder}${app_name}`);

    process.stdout.write(common.messageEnd(Date.now() - start_time));

    console.log(
        '  strings:', Object.keys(source_strings).length,
        '  invalid:', invalid_ranges.length,
        '  ignored:', ignored_ranges.length,
    );
};

const walker = (path) => {
    const list = fs.readdirSync(path);
    list.forEach((f) => {
        const this_path = Path.resolve(path, f);
        if (fs.statSync(this_path).isDirectory()) {
            if (!(new RegExp(config.excluded_folders.join('|')).test(this_path))) {
                walker(this_path);
            }
        } else if (/^[^.].*jsx?$/.test(f)) {
            parseFile(this_path);
        }
    });
};

const parseFile = (path_to_js_file) => {
    if (!path_to_js_file) {
        throw new Error('Missing js file path!');
    }

    const js_source  = fs.readFileSync(path_to_js_file).toString();

    const parsed = BabelParser.parse(js_source, { ...config.parser_options, sourceFilename: path_to_js_file });
    estraverse.traverse(parsed, {
        enter: (node) => {
            extractor(node);
        },
        fallback: 'iteration',
    });
};

const extractor = (node) => {
    const is_function = (node.callee || {}).name === config.localize_method_name;

    if (node.type === 'CallExpression' && is_function) {
        const first_arg = node.arguments[0];

        if (first_arg.value) {
            source_strings[first_arg.value] = true;
        } else {
            (shouldIgnore(first_arg) ? ignored_ranges : invalid_ranges).push(first_arg.loc);
        }
    }
};

const shouldIgnore = (arg) => {
    const comments = (arg.trailingComments || []).map(c => c.value).join(' ');
    return new RegExp(`\\b${config.ignore_comment}\\b`).test(comments);
};

exports.parse    = parse;
exports.getTexts = () => Object.keys(source_strings).sort();

parse('app_2');

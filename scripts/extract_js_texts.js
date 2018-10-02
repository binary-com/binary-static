#!/usr/bin/env node

/* eslint-disable no-console */
const esprima = require('esprima');
const fs      = require('fs');
const Path    = require('path');
const common  = require('./common');

const localize_method_name = 'localize';

const source_strings = {};
const invalid_ranges = [];
const ignored_ranges = [];

const build = (path_to_js_file) => {
    if (!path_to_js_file) {
        throw new Error('Missing js file path!');
    }

    process.stdout.write(common.messageStart('Extracting translation texts'));

    const start_time = Date.now();
    const js_path    = Path.resolve(common.root_path, path_to_js_file);
    const js_source  = fs.readFileSync(js_path).toString();

    esprima.parseScript(
        js_source,
        {
            attachComment: true,
            range        : true,
            tolerant     : true,
        },
        extractor,
    );

    process.stdout.write(common.messageEnd(Date.now() - start_time));
};

const extractor = (node) => {
    const expressions   = (node.callee && node.callee.expressions) || [];
    const is_expression = expressions.length > 1 && expressions[1].property.name === localize_method_name;
    const is_function   = (node.callee || {}).name === localize_method_name;

    if (is_function || is_expression) {
        const first_arg = node.arguments[0];

        if (first_arg.value) {
            source_strings[first_arg.value] = true;
        } else {
            (shouldIgnore(first_arg) ? ignored_ranges : invalid_ranges).push(first_arg.range);
        }
    }
};

const shouldIgnore = (arg) => {
    const comments = (arg.trailingComments || []).map(c => c.value).join('');
    return /\blocalize-ignore\b/.test(comments); // pass /* localize-ignore */ right after the first argument to ignore
};

exports.build    = build;
exports.getTexts = () => Object.keys(source_strings).sort();

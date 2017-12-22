#!/usr/bin/env node

/* eslint-disable import/no-extraneous-dependencies, no-console */
const color      = require('cli-color');
const program    = require('commander');
const fs         = require('fs');
const HtmlDiffer = require('html-differ').HtmlDiffer;
const logger     = require('html-differ/lib/logger');
const path       = require('path');
const common     = require('./common');

program
    .version('0.1.0')
    .description('Get html diff between two files in /dist & /dist-perl folder')
    .option('-p, --path [save_as]', 'Diff only the template/s that match the regex save_as, REQUIRED')
    .option('-l, --lang [language]', 'Diff only for the language that matches the regex')
    .parse(process.argv);

if (!program.path) {
    console.log(color.red('validate.js --path option is required, try --help to see the options.'));
    process.exit(0);
}


const options = {
    ignoreAttributes         : [],
    compareAttributesAsJSON  : [],
    ignoreWhitespaces        : true,
    ignoreComments           : false,
    ignoreEndTags            : false,
    ignoreDuplicateAttributes: false,
};

const htmlDiffer = new HtmlDiffer(options);

const diff = (save_as) => {

    const impl = (p2, p1) => {
        console.warn('\n\n', color.white.bold(p1), color.yellow.bold(' <=====> '), color.white.bold(p2));
        const path1 = path.join(common.root_path, p1);
        const path2 = path.join(common.root_path, p2);
        if (!fs.existsSync(path1) || !fs.existsSync(path2)) {
            console.error(color.red('NOT FOUND '), path1, path2);
            return ;
        }

        const html1 = fs.readFileSync(path1, 'utf-8');
        const html2 = fs.readFileSync(path2, 'utf-8');

        const diffHTML = htmlDiffer.diffHtml(html1, html2);
        const isEqual  = htmlDiffer.isEqual(html1, html2);

        if (!isEqual) {
            logger.logDiffText(diffHTML, { charsAroundDiff: 40 });
        }
    };

    const reg_lang = new RegExp(program.lang, 'i');
    common.languages
        .filter(l => reg_lang.test(l))
        .forEach(lang => {
            const language = lang.toLowerCase();

            impl(
                `dist/${language}/${save_as}.html`,
                `dist-perl/${language}/${save_as}.html`
            );
            impl(
                `dist/${language}/pjax/${save_as}.html`,
                `dist-perl/${language}/pjax/${save_as}.html`
            );
        });
};

const regx = new RegExp(program.path, 'i');
common.pages
    .filter(p => regx.test(p.save_as))
    .map(p => p.save_as)
    .forEach(diff);

/* eslint-disable import/no-extraneous-dependencies, no-console */
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
    .parse(process.argv);

if (!program.path) {
    console.log('validate.js --path option is required, try --help to see the options.'.red);
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

    const impl = (p1, p2) => {
        console.warn(`${p1} VS ${p2}`);
        const path1 = path.join(common.root_path, p1);
        const path2 = path.join(common.root_path, p2);
        if (!fs.existsSync(path1) || !fs.existsSync(path2)) {
            console.error('NOT FOUND ', path1, path2);
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
    common.languages.forEach(lang => {
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

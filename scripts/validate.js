/* eslint-disable */
const fs = require('fs');
const HtmlDiffer = require('html-differ').HtmlDiffer;
const logger = require('html-differ/lib/logger');
const path = require('path');
const common = require('./common');
const program = require('commander');

program
    .version('0.1.0')
    .description('Get html diff between two files in /dist & /dist-perl folder')
    .option('-p, --path [save_as]', 'Template save_as url, REQUIRED')
    .parse(process.argv);

if(!program.path) {
    console.log("validate.js --path option is required, try --help to see the options.".red);
    process.exit(0);
}


const options = {
    ignoreAttributes: [],
    compareAttributesAsJSON: [],
    ignoreWhitespaces: true,
    ignoreComments: false,
    ignoreEndTags: false,
    ignoreDuplicateAttributes: false
};

const htmlDiffer = new HtmlDiffer(options);

const diff = (save_as) => {

    const impl = (p1, p2) => {
        console.warn(`${p1} VS ${p2}`);
        p1 = path.join(common.root_path, p1);
        p2 = path.join(common.root_path, p2);
        if(!fs.existsSync(p1) || !fs.existsSync(p2)) {
            console.error('NOT FOUND ', p1, p2);
            return ;
        }

        const html1 = fs.readFileSync(p1, 'utf-8');
        const html2 = fs.readFileSync(p2, 'utf-8');

        const diff = htmlDiffer.diffHtml(html1, html2);
        const isEqual = htmlDiffer.isEqual(html1, html2);
        const res = logger.getDiffText(diff, { charsAroundDiff: 40 });

        logger.logDiffText(diff, { charsAroundDiff: 40 });
    }
    common.languages.forEach(lang => {
        lang = lang.toLowerCase();

        impl(
            `dist/${lang}/${save_as}.html`,
            `dist-perl/${lang}/${save_as}.html`
        )
        impl(
            `dist/${lang}/pjax/${save_as}.html`,
            `dist-perl/${lang}/pjax/${save_as}.html`
        )
    });
}

diff(common.pages.find(p => p.save_as === program.path).save_as);
/* eslint-disable */
const fs = require('fs');
const HtmlDiffer = require('html-differ').HtmlDiffer;
const logger = require('html-differ/lib/logger');
const path = require('path');
const root_path = require('app-root-path').path;
const pages = require('./pages.js').map(p => ({
    save_as  : p[0],
    tpl_path : p[1],
    layout   : p[2],
    title    : p[3],
    excludes : p[4],
    only_ja  : p[4] && /^NOT-ja,en$/.test(p[4]),
    current_route: p[0].replace(/^(.+)\//, ''),
}));

let languages = ['EN', 'DE', 'ES', 'FR', 'ID', 'IT', 'PL', 'PT', 'RU', 'TH', 'VI', 'JA', 'ZH_CN', 'ZH_TW'];

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
        p1 = path.join(root_path, p1);
        p2 = path.join(root_path, p2);
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
    languages.forEach(lang => {
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

const pattern = process.argv[2] || 'home';
diff(pages.find(p => p.save_as === pattern).save_as);
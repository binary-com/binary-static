/* eslint-disable */
const fs = require('fs');
const HtmlDiffer = require('html-differ').HtmlDiffer;
const logger = require('html-differ/lib/logger');
const path = require('path');
const pages = require('./config/pages.json').map(p => ({
    save_as  : p[0],
    tpl_path : p[1],
    layout   : p[2],
    title    : p[3],
    excludes : p[4],
    only_ja  : p[4] && /^NOT-ja,en$/.test(p[4]),
    current_route: p[0].replace(/^(.+)\//, ''),
}));

let languages = ['EN', 'DE', 'ES', 'FR', 'ID', 'IT', 'PL', 'PT', 'RU', 'TH', 'VI', 'JA', 'ZH_CN', 'ZH_TW'];
languages = ['EN'];

const diff = (save_as) => {
    languages.forEach(lang => {
        const root_path = path.join(__dirname, '..');

        const p1 = path.join(root_path, `dist/${lang}/${save_as}.html`);
        const p2 = path.join(root_path, `pldist/${lang}/${save_as}.html`);
        if(!fs.existsSync(p1) || !fs.existsSync(p2)) {
            return ;
        }

        const html1 = fs.readFileSync(p1, 'utf-8');
        const html2 = fs.readFileSync(p2, 'utf-8');

        const options = {
            ignoreAttributes: [],
            compareAttributesAsJSON: [],
            ignoreWhitespaces: true,
            ignoreComments: false,
            ignoreEndTags: false,
            ignoreDuplicateAttributes: false
        };

        const htmlDiffer = new HtmlDiffer(options);

        const diff = htmlDiffer.diffHtml(html1, html2);
        const isEqual = htmlDiffer.isEqual(html1, html2);
        const res = logger.getDiffText(diff, { charsAroundDiff: 40 });

        logger.logDiffText(diff, { charsAroundDiff: 40 });
    });
}

diff(pages[0].save_as);
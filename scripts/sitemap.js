#!/usr/bin/env node

const color   = require('cli-color');
const Sitemap = require('sitemap');
const program = require('commander');
const fs      = require('fs');
const Path    = require('path');
const common  = require('./common');
const urls    = require('./config/sitemap_urls');

program
    .version('0.2.0')
    .description('Generate sitemap.xml')
    .parse(process.argv);

const config = [
    {
        url_prefix : 'https://www.binary.com/',
        filename   : 'src/root_files/app/sitemap.xml',
        lang_filter: '^(?!id$)',
    },
    {
        url_prefix : 'https://www.binary.me/',
        filename   : 'src/root_files/app/sitemap.id.xml',
        lang_filter: '^id$',
    },
];
let excluded;

const getApplicableLanguages = (lang_filter) => common.languages.filter(lang => new RegExp(lang_filter, 'i').test(lang));

const createSitemap = (conf) => {
    excluded = 0;

    const sitemap = Sitemap.createSitemap({
        hostname : conf.url_prefix,
        cacheTime: 600000,
    });

    getApplicableLanguages(conf.lang_filter)
        .map(lang => lang.toLowerCase())
        .forEach((lang) => {
            urls.forEach((entry) => {
                if (!common.isExcluded(entry[3], lang)) {
                    sitemap.add({
                        url       : `${conf.url_prefix}${lang}/${entry[0]}.html`,
                        changefreq: entry[1],
                        priority  : entry[2],
                    });
                } else {
                    excluded++;
                }
            });
        });

    fs.writeFileSync(Path.join(common.root_path, conf.filename), sitemap.toString());
};

config.forEach((conf) => {
    const start = Date.now();
    process.stdout.write(common.messageStart(`Generating ${conf.filename.split('/').slice(-2).join('/')}`));

    createSitemap(conf);

    process.stdout.write(common.messageEnd(Date.now() - start));

    // Report details
    const langs_count = getApplicableLanguages(conf.lang_filter).length;
    const total_count = langs_count * urls.length - excluded;
    console.log(`  ${color.green(total_count)} URL nodes total (${color.cyan(langs_count)} Languages ${color.yellowBright('*')} ${color.cyan(urls.length)} URLs ${color.yellowBright('-')} ${color.cyan(excluded)} Excluded)\n`); // eslint-disable-line no-console
});

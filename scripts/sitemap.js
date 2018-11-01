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

const url_prefix = 'https://www.binary.com/';
const filename   = 'sitemap.xml';
let excluded     = 0;

const createSitemap = () => {
    const sitemap = Sitemap.createSitemap({
        hostname : url_prefix,
        cacheTime: 600000,
    });

    common.languages
        .map(lang => lang.toLowerCase())
        .forEach((lang) => {
            urls.forEach((entry) => {
                if (!common.isExcluded(entry[3], lang)) {
                    sitemap.add({
                        url       : `${url_prefix}${lang}/${entry[0]}.html`,
                        changefreq: entry[1],
                        priority  : entry[2],
                    });
                } else {
                    excluded++;
                }
            });
        });

    fs.writeFileSync(Path.join(common.root_path, filename), sitemap.toString());
};

const start = Date.now();
process.stdout.write(common.messageStart(`Generating ${filename}`));
createSitemap();
process.stdout.write(common.messageEnd(Date.now() - start));

// Report details
const langs_count = common.languages.length;
const total_count = langs_count * urls.length - excluded;
console.log(`  ${color.green(total_count)} URL nodes total (${color.cyan(langs_count)} Languages ${color.yellowBright('*')} ${color.cyan(urls.length)} URLs ${color.yellowBright('-')} ${color.cyan(excluded)} Excluded)`); // eslint-disable-line no-console

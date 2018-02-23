#!/usr/bin/env node

const color   = require('cli-color');
const Sitemap = require('sitemap');
const program = require('commander');
const fs      = require('fs');
const Path    = require('path');
const common  = require('./common');

program
    .version('0.2.0')
    .description('Generate sitemap.xml')
    .parse(process.argv);


const urls = [
    // path (without .html),               changefreq, priority, exclude languages
    // ==================== Section: "static" ====================
    ['home',                               'monthly', 1.00, 'ja'],
    ['home-jp',                            'monthly', 1.00, 'NOT-ja'],
    ['tour',                               'monthly', 0.80, 'ja'],
    ['tour-jp',                            'monthly', 0.80, 'NOT-ja'],
    ['why-us',                             'monthly', 0.80, 'ja'],
    ['why-us-jp',                          'monthly', 0.80, 'NOT-ja'],
    ['platforms',                          'monthly', 0.80, 'ja'],

    ['about-us',                           'monthly', 0.80],
    ['binary-in-numbers',                  'monthly', 0.80],
    ['careers',                            'monthly', 0.80, 'ja'],
    ['careers-for-americans',              'monthly', 0.80, 'ja'],
    ['contact',                            'monthly', 0.80],
    ['group-history',                      'monthly', 0.80],
    ['open-positions',                     'monthly', 0.80],
    ['open-positions/job-details',         'monthly', 0.80],

    ['affiliate/signup',                   'monthly', 0.80, 'ja'],
    ['affiliate/signup-jp',                'monthly', 0.80, 'NOT-ja'],
    ['charity',                            'monthly', 0.8],
    ['company-profile',                    'monthly', 0.80, 'NOT-ja'],
    ['legal/us_patents',                   'monthly', 0.80, 'ja'],
    ['regulation',                         'monthly', 0.80, 'id'],
    ['responsible-trading',                'monthly', 0.80, 'ja'],
    ['service-announcements',              'monthly', 0.80, 'NOT-ja'],
    ['terms-and-conditions',               'monthly', 0.80, 'ja'],
    ['terms-and-conditions-jp',            'monthly', 0.80, 'NOT-ja'],
//    ['user/browser-support',               'monthly', 0.80],

    ['liquidity-solutions',                'monthly', 0.80, 'ja'],
    ['multiple-accounts-manager',          'monthly', 0.80, 'ja'],
    ['open-source-projects',               'monthly', 0.80, 'ja'],
    ['partners',                           'monthly', 0.80, 'ja'],
    ['payment-agent',                      'monthly', 0.80, 'ja'],
    ['security-testing',                   'monthly', 0.80, 'ja'],

    ['get-started',                        'monthly', 0.80, 'ja'],
    ['get-started/binary-options',         'monthly', 0.80, 'ja'],
    ['get-started/cfds',                   'monthly', 0.80, 'ja'],
    ['get-started/cryptocurrencies',       'monthly', 0.80, 'ja'],
    ['get-started/forex',                  'monthly', 0.80, 'ja'],
    ['get-started/metals',                 'monthly', 0.80, 'ja'],

    ['get-started-jp',                     'monthly', 0.80, 'NOT-ja'],

    ['metatrader/contract-specifications', 'monthly', 0.80],
    ['metatrader/download',                'monthly', 0.80],
    ['metatrader/how-to-trade-mt5',        'monthly', 0.80],
    ['metatrader/types-of-accounts',       'monthly', 0.80],

    // ==================== Section: "app" ====================
    ['cashier',                            'monthly', 0.80],
    ['cashier/payment_agent_listws',       'monthly', 0.80],
    ['cashier/payment_methods',            'monthly', 0.80, 'ja'],

    ['trading',                            'monthly', 0.80, 'ja'],
    ['multi_barriers_trading',             'monthly', 0.80],

    ['resources/asset_indexws',            'monthly', 0.80, 'ja'],
    ['resources/market_timesws',           'monthly', 0.80],

    // ==================== Section: "landing_pages" ====================
    ['graduates',                          'monthly', 0.80, 'NOT-en'],
    ['hackathon',                          'monthly', 0.80, 'NOT-en'],
    ['バイナリーオプション',                  'monthly', 0.80, 'NOT-ja'],
    ['bo_1',                               'monthly', 0.80, 'NOT-ja'],
];

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

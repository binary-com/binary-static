/* eslint-disable */
const Vash = require('vash');
const fs = require('fs');
const Path = require('path');
const Url = require('url');
const Gettext = require('./gettext');
const Colors = require('colors');
const Crypto = require('crypto');

const CONTENT_PLACEHOLDER = "CONTENT_PLACEHOLDER"; // used in layout.vash

const pages = require('./config/pages.json').map(p => ({
    save_as  : p[0],
    tpl_path : p[1],
    layout   : p[2],
    title    : p[3],
    excludes : p[4],
    only_ja  : p[4] && /^NOT-ja,en$/.test(p[4]),
    current_route: p[0].replace(/^(.+)\//, ''),
}));

/**********************************************************************
 * Vash helpers
 **********************************************************************/

global.view = { };
Vash.helpers.when = (condition, value) => {
    if(!condition) { return undefined; }
    return Vash.helpers.raw(value);
}
Vash.helpers.class = value =>  Vash.helpers.when(value, `class="${value}"`);
Vash.helpers.id    = value =>  Vash.helpers.when(value, `id="${value}"`);

/**********************************************************************
 * Common functions
 **********************************************************************/
function getConfig() {
    const config = {
        branch    : '',
        path      : '',
        is_dev    : true,
        languages : ['EN', 'DE', 'ES', 'FR', 'ID', 'IT', 'PL', 'PT', 'RU', 'TH', 'VI', 'JA', 'ZH_CN', 'ZH_TW'],
        root_path : Path.join(__dirname, '..'),
    }
    for (let i = 2; i < process.argv.length; i++) {
        const arg = process.argv[i];
        const [key, value] = arg.split('=');

        if (key && value) {
            const field = key.replace('--', '');
            config[field] = value;
        }
    }
    if (config.branch === 'translations') {
        config.languages = ['ACH'];
    }
    config.dist_path = Path.join(config.root_path, 'dist');
    config.root_url  = `/${config.is_dev ? 'binary-static/' : ''}${config.branch ? `${config.branch}/` : ''}`;
    return config;
}

function create_directories() {
    const config = getConfig();
    const mkdir = path => fs.existsSync(path) || fs.mkdirSync(path);

    console.log(`Target: ${config.dist_path}`.yellow);
    mkdir(Path.join(config.dist_path));
    config.languages.forEach(lang => {
        mkdir(Path.join(config.dist_path, lang));
        mkdir(Path.join(config.dist_path, `${lang}/pjax`));
    });
}

function should_compile(excludes, lang) {
    if (excludes && !/^ACH$/i.test(lang)) {

        excludes = excludes.toUpperCase();
        lang = lang.toUpperCase();

        if (/^NOT-/.test(excludes))
            return excludes.indexOf(lang) !== -1;
        return excludes.indexOf(lang) === -1;
    }
    return true;
}

const print = (text) => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(text);
};
function file_hash_async(path, cb) {
    return new Promise((res, rej) => {
        var fd = fs.createReadStream(path);
        var hash = Crypto.createHash('sha1');
        hash.setEncoding('hex');

        fd.on('end', function () {
            hash.end();
            res(hash.read());
        });

        fd.pipe(hash);
    });
};


/**********************************************************************
 * Factory functions
 **********************************************************************/

const gettext = Gettext.createGettextInstance({record: true});
const createTranslator = lang => {
    lang = lang.toLowerCase(lang);
    gettext.setLang(lang);
    return (text, ...args) => gettext.gettext(text, ...args);
}
const createUrlFinder  = lang => {
    default_lang = lang.toLowerCase();
    const config = getConfig();
    return (url, lang = default_lang) => {
        if(url === '' || url === '/') {
            url = '/home';
        }

        if(/^\/?(images|js|css|scripts|download)/.test(url)) {
            return Path.join(config.root_url, url);
        }

        const p = Url.parse(url, true);
        const pathname = p.pathname.replace(/^\//, '');
        if(pages.filter(p => p.save_as === pathname).length) {
            p.pathname = Path.join(config.root_url, `${lang}/${pathname}.html`)
            return Url.format(p);
        }

        throw new TypeError(`Invalid url ${url}`);
    }
}

const createBuilder = async () => {
    const config = getConfig();

    const static_hash = Math.random().toString(36).substring(2, 10);
    const vendor_hash = await file_hash_async(Path.join(config.dist_path, 'js/vendor.min.js'))
    fs.writeFileSync(Path.join(config.dist_path, 'version'), static_hash, 'utf8');

    const html = Vash.helpers;

    const extra = {
        js_files: [
            `${config.root_url}js/texts/{PLACEHOLDER_FOR_LANG}.js?${static_hash}`,
            `${config.root_url}js/manifest.js?${static_hash}`,
            `${config.root_url}js/vendor.min.js?${vendor_hash}`,
            `${config.root_url}js/binary.js?${static_hash}`,
            `${config.root_url}js/binary.min.js?${static_hash}`,
        ],
        css_files: [
            `${config.root_url}css/binary.min.css?${static_hash}`
        ],
        menu: [
            {
                id: 'topMenuTrading', url: '/trading', text: 'Trade',
                _class: 'ja-hide gr-hide-m gr-hide-p ico-only-hide',
            },
            {
                id: 'topMenuJPTrading', url: '/multi_barriers_trading', text: 'Trade',
                _class: 'invisible ja-show gr-hide-m gr-hide-p'
            },
            {
                id: 'topMenuPortfolio', url: '/user/portfoliows', text: 'Portfolio',
                class: 'client_logged_in invisible ico-only-hide',
            },
            {
                id: 'topMenuProfitTable', url: '/user/profit_tablews', text: 'Profit Table',
                _class: 'client_logged_in invisible ico-only-hide',
            },
            {
                id: 'topMenuStatement', url: '/user/statementws', text: 'Statement',
                _class: 'client_logged_in invisible',
            },
            { // cashier
                id: 'topMenuCashier', url: '/cashier', text: 'Cashier',
            },
            { // resources
                id: 'topMenuResources', url: '/resources', text: 'Resources',
                _class: 'client_logged_out client_logged_in invisible ico-only-hide',
                sub_items: [
                    {
                        id: 'topMenuAssetIndex', url: '/resources/asset_indexws', text: 'Asset Index',
                        _class: 'ja-hide'
                    },
                    {
                        id: 'topMenuTradingTimes', url: '/resources/market_timesws', text: 'Trading Times'
                    },
                ]
            },
            {
                id: 'topMenuShop', text: 'Shop', absolute_url: 'https://shop.binary.com',
                _class: 'ja-hide ico-only-hide', target: '_blank'
            },
            {
                id: 'topMenuPaymentAgent', url: '/paymentagent/transferws', text: 'Payment Agent',
                _class: 'invisible',
            },
            { // Link to ico-subscribe, ICO Bids.
                id: 'topMenuIcoBids', url: '/user/ico-subscribe', text: 'ICO Bids',
                _class: 'invisible ico-only-show',
            },
        ],
        languages: config.languages,
        broker_name: 'Binary.com',
        static_hash: static_hash
    }

    return {
        build_template_for: (input_file) => {
            const input_content = fs.readFileSync(input_file, 'utf8');
            const template = Vash.compile(input_content);
            return template
        },
        run_template: ({template, model}) => {
            const merged = Object.assign({ }, model, extra);
            const output_content = template(merged);

            return output_content;
        }
    }
}

/**********************************************************************
 * Compile
 **********************************************************************/

async function compile(page) {
    const config = getConfig();
    const languages = config.languages.filter(lang => should_compile(page.excludes, lang));
    const builder = await createBuilder();

    const layout = {
        file: Path.join(config.root_path, `src/templates/global/layout.vash`),
        model: null,
        template: null,
    };
    layout.template = builder.build_template_for(layout.file);


    console.time(page.save_as);
    languages.forEach(lang => {
        Vash.helpers.L = createTranslator(lang);
        Vash.helpers.rawL = (text, ...args) => Vash.helpers.raw(Vash.helpers.L(text, ...args));
        Vash.helpers.url_for = createUrlFinder(lang);

        const model = {
            website_name : 'Binary.com',
            browser_title: page.title ? `${Vash.helpers.L(page.title)} | ` : '',
            layout       : page.layout,
            language     : lang.toUpperCase(),
            root_url     : config.root_url,
            only_ja      : page.only_ja,
            current_path : page.save_as,
            current_route: page.current_route,
            affiliate_email : 'affiliates@binary.com',
            japan_docs_url  : 'https://japan-docs.binary.com',
            is_pjax_request : true,
        }

        const input = {
            file: Path.join(config.root_path, `src/templates/${page.tpl_path}.vash`),
            model: model,
            template: null,
            result: null
        };
        input.template = builder.build_template_for(input.file);
        input.result = builder.run_template({template: input.template, model: input.model});

        layout.model = model;
        layout.result = builder.run_template({template: layout.template, model: layout.model})

        const pjax = {
            file: Path.join(config.dist_path, `${lang}/pjax/${page.save_as}.html`),
            result: layout.result.replace(CONTENT_PLACEHOLDER, input.result)
        };
        fs.writeFileSync(pjax.file, pjax.result, 'utf8');

        layout.model.is_pjax_request = false;
        layout.result = builder.run_template({template: layout.template, model: layout.model})

        const normal = {
            file: Path.join(config.dist_path, `${lang}/${page.save_as}.html`),
            result: layout.result.replace(CONTENT_PLACEHOLDER, input.result)
        }
        fs.writeFileSync(normal.file, normal.result, 'utf8');

        print(`Compiling ${pjax.file.replace(config.root_path, '')}`.green);
    });
    process.stdout.write('\n');
    console.timeEnd(page.save_as);
}

create_directories();
(async () => {
    try {
        await compile(pages[0]);
    } catch(e) {
        console.log(e);
    }
})();
// var tpl = Vash.compile('<p>I am a @model.t!</p>');
// var out = tpl({ t: 'template' });

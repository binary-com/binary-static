/* eslint-disable */
const Vash = require('vash');
const fs = require('fs');
const Path = require('path');
const Url = require('url');
const Gettext = require('./gettext');
const Crypto = require('crypto');
const common = require('./common');
const generate_static_data = require('./generate-static-data');
const program = require('commander');

const CONTENT_PLACEHOLDER = "CONTENT_PLACEHOLDER"; // used in layout.vash

program
    .version('0.1.0')
    .description('Build .vash templates into /dist folder')
    .option('-d, --dev', 'Build for your gh-pages')
    .option('-b, --branch [branchname]', 'Build your changes to a sub-folder named: br_branchname')
    .option('-p, --path [save_as]', 'Re-compile only the template with save_as in its URL')
    .option('-t, --add-translations', 'Update messages.pot with new translations')
    .parse(process.argv);

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
Vash.config.debug  = true;
Vash.config.debugparser = true;
Vash.config.debugcompiler = true;
Vash.config.cache = true;
Vash.config.settings = {
    views: Path.join(common.root_path, 'src/templates')
}

/**********************************************************************
 * Common functions
 **********************************************************************/
function getConfig() {
    const config = {
        languages : common.languages,
        sections  : ['app', 'static'],
        root_path : common.root_path,
        add_translations: false,
    }
    if (program.branch === 'translations') {
        config.languages = ['ACH'];
    }
    config.dist_path = Path.join(config.root_path, 'dist');
    config.root_url  = `/${program.dev ? 'binary-static/' : ''}${program.branch ? `${program.branch}/` : ''}`;
    return config;
}

function createDirectories() {
    const config = getConfig();
    const mkdir = path => fs.existsSync(path) || fs.mkdirSync(path);

    console.log(`Target: ${config.dist_path}`.yellow);
    mkdir(Path.join(config.dist_path));
    config.languages.forEach(lang => {
        lang = lang.toLowerCase();
        mkdir(Path.join(config.dist_path, lang));
        mkdir(Path.join(config.dist_path, `${lang}/pjax`));
    });
}

function shouldCompile(excludes, lang) {
    if (excludes && !/^ACH$/i.test(lang)) {

        excludes = excludes.toUpperCase();
        lang = lang.toUpperCase();

        if (/^NOT-/.test(excludes))
            return excludes.indexOf(lang) !== -1;
        return excludes.indexOf(lang) === -1;
    }
    return true;
}

function fileHash(path, cb) {
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

const createTranslator = lang => {
    const gettext = Gettext.getInstance();
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
        if(common.pages.filter(p => p.save_as === pathname).length) {
            p.pathname = Path.join(config.root_url, `${lang}/${pathname}.html`)
            return Url.format(p);
        }

        throw new TypeError(`Invalid url ${url}`);
    }
}

const createBuilder = async () => {
    const config = getConfig();

    let static_hash = Math.random().toString(36).substring(2, 10);
    if (program.path) {
        try {
            static_hash = await common.readFile(Path.join(config.dist_path, 'version'));
        } catch(e) { }
    }
    const vendor_hash = await fileHash(Path.join(config.dist_path, 'js/vendor.min.js'))
    await common.writeFile(Path.join(config.dist_path, 'version'), static_hash, 'utf8');

    const html = Vash.helpers;

    const extra = {
        js_files: [
            `${config.root_url}js/texts/{PLACEHOLDER_FOR_LANG}.js?${static_hash}`,
            `${config.root_url}js/manifest.js?${static_hash}`,
            `${config.root_url}js/vendor.min.js?${vendor_hash}`,
            program.dev ?
                `${config.root_url}js/binary.js?${static_hash}` :
                `${config.root_url}js/binary.min.js?${static_hash}`,
        ],
        css_files: [
            `${config.root_url}css/common.min.css?${static_hash}`,
            ...config.sections.map(section => `${config.root_url}css/${section}.min.css?${static_hash}`)
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
                _class: 'client_logged_in invisible ico-only-hide',
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
        build_template_for: async (input_file) => {
            const input_content = await common.readFile(input_file);
            const template = Vash.compile(input_content);
            return template
        },
        run_template: ({template, model}) => {
            const translator = createTranslator(model.language);
            Vash.helpers.L = (text, ...args) => Vash.helpers.raw(translator(text, ...args));
            Vash.helpers.url_for = createUrlFinder(model.language);

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
    console.time(page.save_as);
    console.log(`Compiling ${page.save_as}`.green);
    const config = getConfig();
    const languages = config.languages.filter(lang => shouldCompile(page.excludes, lang));
    const builder = await createBuilder();

    const layouts = { };
    await Promise.all(
        config.sections.map(async section => {
            layouts[section] = {
                file: Path.join(config.root_path, `src/templates/${section}/_layout/layout.vash`),
            }
            layouts[section].template = await builder.build_template_for(layouts[section].file);
        })
    );

    const input = {
        file: Path.join(config.root_path, `src/templates/${page.tpl_path}.vash`),
        template: null,
    };
    input.template = await builder.build_template_for(input.file);

    const tasks = languages.map(async lang => {

        const model = {
            website_name : 'Binary.com',
            title        : page.title,
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

        const result_input = builder.run_template({template: input.template, model: model});

        if (page.layout) {
            const layout = layouts[page.tpl_path.split('/')[0]];
            const result_pjax = builder.run_template({template: layout.template, model: model})

            await common.writeFile( // pjax layout
                Path.join(config.dist_path, `${lang}/pjax/${page.save_as}.html`),
                result_pjax.replace(CONTENT_PLACEHOLDER, result_input),
                'utf8'
            );

            model.is_pjax_request = false;
            const result_normal = builder.run_template({template: layout.template, model: model})

            await common.writeFile( // normal layout
                Path.join(config.dist_path, `${lang}/${page.save_as}.html`),
                result_normal.replace(CONTENT_PLACEHOLDER, result_input),
                'utf8'
            );
        } else {
            await common.writeFile( // landing pages
                Path.join(config.dist_path, `${lang}/${page.save_as}.html`),
                result_input,
                'utf8'
            );
        }
    });
    await Promise.all(tasks);
    console.timeEnd(page.save_as);
}

createDirectories();
(async () => {
    const config = getConfig();
    try {
        await compile(common.pages.find(p => p.save_as === (program.path || 'home')));
        if(program.addTranslations) {
            const gettext = Gettext.getInstance();
            generate_static_data.build();
            gettext.update_translations();
        }
    } catch(e) {
        if(e.message.indexOf('html.reportError') !== -1 && e.name === 'SyntaxError') {
            console.log("---------------------- Javascript SyntaxError -------------------- ".red);
            console.log("------------------------------------------------------------------ ".red);
            const msg = e.message.slice(e.message.indexOf('html.reportError') + 40)
                                 .replace(/!LB!/g, '\n')
                                 .split('\n').slice(0, -5).join('\n')
                                 .replace(/\\'/g, "'").replace(/\\"/g, '"');
            console.log(msg.red)
        } else {
            console.log(e.toString().red);
        }
    }
})();

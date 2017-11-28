/* eslint-disable */
const Vash = require('vash');
const fs = require('fs');
const Path = require('path');
const Url = require('url');
const Gettext = require('./gettext');
const colors = require('colors');

const pages = require('./config/pages.json').map(p => ({
    save_as  : p[0],
    tpl_path : p[1],
    layout   : p[2],
    title    : p[3],
    excludes : p[4],
    only_ja  : p[4] && /^NOT-ja,en$/.test(p[4]),
}));

Vash.helpers.when = (condition, value) => {
    if(!condition) { return undefined; }
    return Vash.helpers.raw(value);
}
Vash.helpers.class = value =>  Vash.helpers.when(value, `class="${value}"`);
Vash.helpers.id    = value =>  Vash.helpers.when(value, `id="${value}"`);

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

const gettext = Gettext.createGettextInstance({record: true});
const createTranslator = lang => {
    lang = lang.toLowerCase(lang);
    gettext.setLang(lang);
    return (text, ...args) => gettext.gettext(text, ...args);
}
const createUrlFinder  = lang => {
    lang = lang.toLowerCase();
    const config = getConfig();
    return (url) => {
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
function compile(page) {
    const config = getConfig();
    const languages = config.languages.filter(lang => should_compile(page.excludes, lang));

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
            static_hash  : 'TODO', // TODO
            current_route: 'TODO', // TODO
            affiliate_email : 'affiliates@binary.com',
            japan_docs_url  : 'https://japan-docs.binary.com',
        }

        const input_file = Path.join(config.root_path, `src/templates/${page.tpl_path}.vash`);
        const output_file = Path.join(config.dist_path, `${lang}/pjax/${page.save_as}.html`);

        const input_content = fs.readFileSync(input_file, 'utf8');
        const template = Vash.compile(input_content);
        const output_content = template(model);

        fs.writeFileSync(output_file, output_content, 'utf8');

        print(`Compiling ${output_file.replace(config.root_path, '')}`.green);
    });
    process.stdout.write('\n');
}

create_directories();
compile(pages[0]);
// var tpl = Vash.compile('<p>I am a @model.t!</p>');
// var out = tpl({ t: 'template' });

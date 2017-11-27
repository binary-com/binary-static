/* eslint-disable */
const vash = require('vash');
const fs = require('fs');
const path = require('path');

const pages = require('./config/pages.json').map(p => ({
    save_as  : p[0],
    tpl_path : p[1],
    layout   : p[2],
    title    : p[3],
    excludes : p[4],
    only_ja  : p[4] && /^NOT-ja,en$/.test(p[4]),
}));

vash.helpers.attr = (key, value) => {
    if (!value) { return undefined; }
    return vash.helpers.raw(`${key}="${value}"`);
}
vash.helpers.class = value =>  vash.helpers.attr('class', value);
vash.helpers.id    = value =>  vash.helpers.attr('id', value);

function getConfig() {
    const config = {
        branch    : '',
        path      : '',
        is_dev    : true,
        languages : ['EN', 'DE', 'ES', 'FR', 'ID', 'IT', 'PL', 'PT', 'RU', 'TH', 'VI', 'JA', 'ZH_CN', 'ZH_TW'],
        root_path : path.join(__dirname, '..'),
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
    config.dist_path = path.join(config.root_path, 'dist');
    config.root_url  = `/${config.is_dev ? 'binary-static/' : ''}${config.branch ? `${config.branch}/` : ''}`;
    return config;
}

function create_directories() {
    const config = getConfig();
    const mkdir = path => fs.existsSync(path) || fs.mkdirSync(path);

    console.log(`Target: ${config.dist_path}`.cyan);
    mkdir(path.join(config.dist_path));
    config.languages.forEach(lang => {
        mkdir(path.join(config.dist_path, lang));
        mkdir(path.join(config.dist_path, `${lang}/pjax`));
    });
}

const createTranslator = lang => text => text; // TODO

function should_compile(excludes, lang) {
    console.warn(excludes, lang);
    if (excludes && !/^ACH$/i.test(lang)) {

        excludes = excludes.toUpperCase();
        lang = lang.toUpperCase();

        if (/^NOT-/.test(excludes))
            return excludes.indexOf(lang) !== -1;
        return excludes.indexOf(lang) === -1;
    }
    return true;
}
function compile(page) {
    const config = getConfig();
    const languages = config.languages.filter(lang => should_compile(page.excludes, lang));

    languages.forEach(lang => {
        const L = createTranslator(lang);
        const model = {
            website_name : 'Binary.com',
            browser_title: page.title ? `${L(page.title)} | ` : '',
            layout       : page.layout,
            language     : lang.toUpperCase(),
            root_url     : config.root_url,
            only_ja      : page.only_ja,
            current_path : page.save_as,
            static_hash  : 'TODO', // TODO
            current_route: 'TODO', // TODO
            affiliate_email : 'affiliates@binary.com',
            japan_docs_url  : 'https://japan-docs.binary.com',
            L: L
        }

        vash.helpers.L = L;

        const input_file = path.join(config.root_path, `src/templates/${page.tpl_path}.vash`);
        const output_file = path.join(config.dist_path, `${lang}/pjax/${page.save_as}.html`);

        const input_content = fs.readFileSync(input_file, 'utf8');
        const template = vash.compile(input_content);
        const output_content = template(model);

        fs.writeFileSync(output_file, output_content, 'utf8');

        console.warn(input_file);
        console.warn(output_file);
    });
}

console.warn(getConfig());
console.warn(pages[0]);
compile(pages[0]);
// create_directories();
// var tpl = vash.compile('<p>I am a @model.t!</p>');
// var out = tpl({ t: 'template' });

/* eslint-disable */
const fs = require('fs');
const Path = require('path');
const Gettext = require('node-gettext');
const { po } = require('gettext-parser');
const colors = require('colors');

exports.createGettextInstance = ({record = false} = {}) => {
    const translations_dir = './src/translations/'
    const locales = [
        'en', 'ach_UG', 'fr_FR', 'it_IT', 'pt_PT', 'th_TH', 'zh_CN',
        'de_DE', 'es_ES', 'id_ID', 'ja_JP', 'pl_PL', 'ru_RU', 'vi_VN', 'zh_TW'
    ]

    const gt = new Gettext()

    process.stdout.write("Loading .po files ".cyan);
    locales.forEach((locale) => {
        const po_file = Path.join(translations_dir, `${locale}.po`);
        const po_content = fs.readFileSync(po_file, 'utf8');

        const parsed = po.parse(po_content)
        gt.addTranslations(locale, 'messages', parsed)
        process.stdout.write(".".cyan);
    })
    process.stdout.write(" Done\n".cyan);

    const recorded = [];
    if (record) {
        gt.on('error', error => {
            recorded.push(error);
            console.log('Not translated: ', error);
        });
    }

    return {
        setLang: lang => {
            const [locale]  = locales.filter(l => l.toLocaleLowerCase().startsWith(lang));
            if (!locale) {
                throw new TypeError(`locale for ${lang} not found!`);
            }
            gt.setLocale(locale);
        },
        gettext: (text, ...args) => {
            for(let inx = 1; inx <= args.length; ++inx) {
                text = text.replace(`[_${inx}]`, `%${inx}`)
            }
            let translation = gt.gettext(text);
            for(let inx = 1; inx <= args.length; ++inx) {
                translation = translation.replace(`%${inx}`, args[inx-1]);
            }
            return translation;
        }
    }
}
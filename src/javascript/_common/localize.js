const moment   = require('moment');
const template = require('./utility').template;

const Localize = (() => {
    let localized_texts;

    const localizeForLang = (lang) => {
        localized_texts = texts_json[lang.toUpperCase()];
        moment.locale(lang.toLowerCase());
    };

    const doLocalize = (txt, params) => {
        let text = txt;

        const index = text.replace(/[\s|.]/g, '_');

        text = (localized_texts && localized_texts[index]) || text;

        // only use template when explicitly required
        return params ? template(text, params) : text;
    };

    const localize = (text, params) => (
        Array.isArray(text) ? text.map(t => doLocalize(t, params)) : doLocalize(text, params)
    );

    return {
        localize,
        forLang: localizeForLang,
    };
})();

module.exports = Localize;

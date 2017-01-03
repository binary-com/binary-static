const Cookies = require('../../lib/js-cookie');
const CookieStorage = require('./storage').CookieStorage;

const Language = (function () {
    const all_languages = function() {
        return {
            EN   : 'English',
            DE   : 'Deutsch',
            ES   : 'Español',
            FR   : 'Français',
            ID   : 'Indonesia',
            IT   : 'Italiano',
            JA   : '日本語',
            PL   : 'Polish',
            PT   : 'Português',
            RU   : 'Русский',
            TH   : 'Thai',
            VI   : 'Tiếng Việt',
            ZH_CN: '简体中文',
            ZH_TW: '繁體中文',
        };
    };

    const set_cookie_language = function () {
        if (!Cookies.get('language')) {
            const cookie = new CookieStorage('language');
            cookie.write(language());
        }
    };

    const language_from_url = function() {
        const regex = new RegExp('^(' + Object.keys(all_languages()).join('|') + ')$', 'i');
        const langs = window.location.href.split('/').slice(3);
        for (let i = 0; i < langs.length; i++) {
            const lang = langs[i];
            if (regex.test(lang)) return lang;
        }
        return '';
    };

    let current_lang = null;
    const language = function() {
        let lang = current_lang;
        if (!lang) {
            lang = (language_from_url() || Cookies.get('language') || 'EN').toUpperCase();
            current_lang = lang;
        }
        return lang;
    };

    const url_for_language = function(lang) {
        return window.location.href.replace(new RegExp('\/' + language() + '\/', 'i'), '/' + lang.trim().toLowerCase() + '/');
    };

    const on_change_language = function() {
        $('#select_language').find('li').on('click', function() {
            const lang = $(this).attr('class');
            if (language() === lang) return;
            $('#display_language').find('.language').text($(this).text());
            const cookie = new CookieStorage('language');
            cookie.write(lang);
            document.location = url_for_language(lang);
        });
    };

    return {
        all_languages      : all_languages,
        set_cookie_language: set_cookie_language,
        language           : language,
        url_for_language   : url_for_language,
        on_change_language : on_change_language,
    };
})();

module.exports = {
    getAllLanguages  : Language.all_languages,
    getLanguage      : Language.language,
    setCookieLanguage: Language.set_cookie_language,
    URLForLanguage   : Language.url_for_language,
    onChangeLanguage : Language.on_change_language,
};

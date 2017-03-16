const CookieStorage = require('./storage').CookieStorage;
const Cookies       = require('../../lib/js-cookie');

const Language = (() => {
    'use strict';

    const allLanguages = {
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

    const setCookieLanguage = (lang, set_anyway) => {
        if (!Cookies.get('language') || set_anyway) {
            const cookie = new CookieStorage('language');
            cookie.write(lang || language());
        }
    };

    const languageFromUrl = () => {
        const regex = new RegExp('^(' + Object.keys(allLanguages).join('|') + ')$', 'i');
        const url_params = window.location.href.split('/').slice(3);
        return (url_params.find(lang => regex.test(lang)) || '');
    };

    let current_lang = null;
    const language = () => (current_lang = current_lang || (languageFromUrl() || Cookies.get('language') || 'EN').toUpperCase());

    const urlForLanguage = lang => window.location.href.replace(new RegExp('\/' + language() + '\/', 'i'), '/' + lang.trim().toLowerCase() + '/');

    const onChangeLanguage = () => {
        $('#select_language').find('li').on('click', function() {
            const lang = $(this).attr('class');
            if (language() === lang) return;
            $('#display_language').find('.language').text($(this).text());
            setCookieLanguage(lang, true);
            document.location = urlForLanguage(lang);
        });
    };

    return {
        getAll           : () => allLanguages,
        setCookieLanguage: setCookieLanguage,
        get              : language,
        urlForLanguage   : urlForLanguage,
        onChangeLanguage : onChangeLanguage,
    };
})();

module.exports = {
    getAllLanguages  : Language.getAll,
    getLanguage      : Language.get,
    setCookieLanguage: Language.setCookieLanguage,
    URLForLanguage   : Language.urlForLanguage,
    onChangeLanguage : Language.onChangeLanguage,
};

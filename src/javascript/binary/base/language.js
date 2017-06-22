const CookieStorage = require('./storage').CookieStorage;
const Cookies       = require('../../lib/js-cookie');

const Language = (() => {
    'use strict';

    const all_languages = {
        ACH  : 'Translations',
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

    const setCookieLanguage = (lang) => {
        if (!Cookies.get('language') || lang) {
            const cookie = new CookieStorage('language');
            cookie.write(lang || getLanguage());
        }
    };

    let url_lang = null;
    const lang_regex = new RegExp(`^(${Object.keys(all_languages).join('|')})$`, 'i');
    const languageFromUrl = (custom_url) => {
        if (url_lang && !custom_url) return url_lang;
        const url_params = (custom_url || window.location.href).split('/').slice(3);
        const language = (url_params.find(lang => lang_regex.test(lang)) || '');
        if (!custom_url) {
            url_lang = language;
        }
        return language;
    };

    let current_lang = null;
    const getLanguage = () => {
        if (/ach/i.test(current_lang) || /ach/i.test(languageFromUrl())) {
            const crowdin_lang = Cookies.get('jipt_language_code_binary-static'); // selected language for in-context translation
            if (crowdin_lang) {
                current_lang = crowdin_lang.toUpperCase().replace('-', '_').toUpperCase();
                $('body').addClass(current_lang); // set the body class removed by crowdin code
            }
        }
        current_lang = (current_lang || (languageFromUrl() || Cookies.get('language') || 'EN').toUpperCase());
        return current_lang;
    };

    const urlForLanguage = lang => window.location.href.replace(new RegExp(`\/${getLanguage()}\/`, 'i'), `/${lang.trim().toLowerCase()}/`);

    const onChangeLanguage = () => {
        let $this;
        $('#select_language').find('li').on('click', function() {
            $this = $(this);
            const lang = $this.attr('class');
            if (getLanguage() === lang) return;
            $('#display_language').find('.language').text($this.text());
            setCookieLanguage(lang);
            document.location = urlForLanguage(lang);
        });
    };

    return {
        getAll   : () => all_languages,
        setCookie: setCookieLanguage,
        get      : getLanguage,
        onChange : onChangeLanguage,
        urlFor   : urlForLanguage,
        urlLang  : languageFromUrl,
        reset    : () => { url_lang = null; current_lang = null; },
    };
})();

module.exports = Language;

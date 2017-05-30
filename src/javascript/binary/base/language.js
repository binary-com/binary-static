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

    const setCookieLanguage = (lang, set_anyway) => {
        if (!Cookies.get('language') || set_anyway) {
            const cookie = new CookieStorage('language');
            cookie.write(lang || getLanguage());
        }
    };

    let url_lang = null;
    const languageFromUrl = () => {
        if (url_lang) return url_lang;
        const regex = new RegExp(`^(${Object.keys(all_languages).join('|')})$`, 'i');
        const url_params = window.location.href.split('/').slice(3);
        url_lang = (url_params.find(lang => regex.test(lang)) || '');
        return url_lang;
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
            setCookieLanguage(lang, true);
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
    };
})();

module.exports = Language;

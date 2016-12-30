var Cookies = require('../../lib/js-cookie');
var CookieStorage = require('./storage').CookieStorage;

var Language = (function () {
    var all_languages = function() {
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

    var set_cookie_language = function () {
        if (!Cookies.get('language')) {
            var cookie = new CookieStorage('language');
            cookie.write(language());
        }
    };

    var language_from_url = function() {
        var regex = new RegExp('^(' + Object.keys(all_languages()).join('|') + ')$', 'i');
        var langs = window.location.href.split('/').slice(3);
        for (var i = 0; i < langs.length; i++) {
            var lang = langs[i];
            if (regex.test(lang)) return lang;
        }
        return '';
    };

    var current_lang = null;
    var language = function() {
        var lang = current_lang;
        if (!lang) {
            lang = (language_from_url() || Cookies.get('language') || 'EN').toUpperCase();
            current_lang = lang;
        }
        return lang;
    };

    var url_for_language = function(lang) {
        return window.location.href.replace(new RegExp('\/' + language() + '\/', 'i'), '/' + lang.trim().toLowerCase() + '/');
    };

    var on_change_language = function() {
        $('#select_language li').on('click', function() {
            var lang = $(this).attr('class');
            if (language() === lang) return;
            $('#display_language .language').text($(this).text());
            var cookie = new CookieStorage('language');
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

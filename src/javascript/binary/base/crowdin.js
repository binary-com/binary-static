const urlLang = require('./language').urlLang;

const Crowdin = (() => {
    'use strict';

    /**
     * in-context translation provided at: https://staging.binary.com/translations/
     * and uses 'ach' as pseudo language code
     */
    const isInContextEnvironment = () => (
        /^https:\/\/staging\.binary\.com\/translations\//i.test(window.location.href) &&
        /ach/i.test(urlLang())
    );

    /**
     * initialize Crowdin in-context environment
     */
    const init = () => {
        if (isInContextEnvironment()) {
            $('#topbar ul[id$="_language"]').setVisibility(0);
            window._jipt = [];
            window._jipt.push(['project', 'binary-static']);
            $('body').append($('<script/>', {
                type: 'text/javascript',
                src : `${document.location.protocol}//cdn.crowdin.com/jipt/jipt.js`,
            }));
        }
    };

    return {
        init       : init,
        isInContext: isInContextEnvironment,
    };
})();

module.exports = Crowdin;

const urlLang = require('./language').urlLang;

const Crowdin = (() => {
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
            document.querySelector('#topbar ul[id$="_language"]').setVisibility(0);
            /* eslint-disable no-underscore-dangle */
            window._jipt = [];
            window._jipt.push(['project', 'binary-static']);
            /* eslint-enable no-underscore-dangle */
            const script = document.createElement('script');
            script.setAttribute('type', 'text/javascript');
            script.setAttribute('src', `${document.location.protocol}//cdn.crowdin.com/jipt/jipt.js`);
            document.getElementsByTagName('body')[0].appendChild(script);
        }
    };

    return {
        init,
        isInContext: isInContextEnvironment,
    };
})();

module.exports = Crowdin;

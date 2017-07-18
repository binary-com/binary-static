const Cookies            = require('js-cookie');
const Client             = require('./client');
const GTM                = require('./gtm');
const getLanguage        = require('./language').get;
const urlLang            = require('./language').urlLang;
const isStorageSupported = require('./storage').isStorageSupported;
const defaultRedirectUrl = require('./url').defaultRedirectUrl;
const urlFor             = require('./url').urlFor;
const paramsHash         = require('./url').paramsHash;
const isEmptyObject      = require('./utility').isEmptyObject;

const LoggedInHandler = (() => {
    'use strict';

    const onLoad = () => {
        parent.window.is_logging_in = 1; // this flag is used in base.js to prevent auto-reloading this page
        let redirect_url;
        if (isStorageSupported(localStorage) && isStorageSupported(sessionStorage)) {
            const tokens  = storeTokens();
            if (!isEmptyObject(tokens)) {
                let loginid = Cookies.get('loginid');
                // Need to set cookies if OAuth hasn't set them or redirected to another domain (e.g. github.io)
                if (!loginid) {
                    const loginids   = Object.keys(tokens);
                    let loginid_list = '';
                    loginids.map((id) => {
                        loginid_list += `${(loginid_list ? '+' : '')}${id}:${(/^V/i.test(id) ? 'V' : 'R')}:E`; // Assume all are enabled since there is no data source to check. Disabled accounts will be handled on authorize
                    });
                    loginid = loginids[0];
                    // set cookies
                    Client.setCookie('loginid',      loginid);
                    Client.setCookie('loginid_list', loginid_list);
                }
                Client.setCookie('login', tokens[loginid].token);

                // set flags
                GTM.setLoginFlag();
            }
            // redirect url
            redirect_url = sessionStorage.getItem('redirect_url');
            sessionStorage.removeItem('redirect_url');
        }

        // redirect back
        let set_default = true;
        if (redirect_url) {
            const do_not_redirect = ['reset_passwordws', 'lost_passwordws', 'change_passwordws', 'home', 'home-jp', '404'];
            const reg = new RegExp(do_not_redirect.join('|'), 'i');
            if (!reg.test(redirect_url) && urlFor('') !== redirect_url) {
                set_default = false;
            }
        }
        if (set_default) {
            const lang_cookie = urlLang(redirect_url) || Cookies.get('language');
            const language = getLanguage();
            redirect_url = defaultRedirectUrl();
            if (lang_cookie && lang_cookie !== language) {
                redirect_url = redirect_url.replace(new RegExp(`\/${language}\/`, 'i'), `/${lang_cookie.toLowerCase()}/`);
            }
        }
        document.getElementById('loading_link').setAttribute('href', redirect_url);
        window.location.href = redirect_url; // need to redirect not using pjax
    };

    const storeTokens = () => {
        // Parse url for loginids, tokens, and currencies returned by OAuth
        const params = paramsHash(window.location.href);
        const tokens = {};
        let i = 1;

        while (params[`acct${i}`]) {
            const loginid  = params[`acct${i}`];
            const token    = params[`token${i}`];
            const currency = params[`cur${i}`] || '';
            if (loginid && token) {
                tokens[loginid] = { token: token, currency: currency };
            }
            i++;
        }
        if (!isEmptyObject(tokens)) {
            Client.set('tokens', JSON.stringify(tokens));
        }
        return tokens;
    };

    return {
        onLoad: onLoad,
    };
})();

module.exports = LoggedInHandler;

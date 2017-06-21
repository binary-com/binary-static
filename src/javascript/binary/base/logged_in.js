const Client             = require('./client');
const GTM                = require('./gtm');
const getLanguage        = require('./language').get;
const urlLang            = require('./language').urlLang;
const defaultRedirectUrl = require('./url').defaultRedirectUrl;
const urlFor             = require('./url').urlFor;
const isEmptyObject      = require('./utility').isEmptyObject;
const Cookies            = require('../../lib/js-cookie');

const LoggedInHandler = (() => {
    'use strict';

    const onLoad = () => {
        parent.window.is_logging_in = 1; // this flag is used in base.js to prevent auto-reloading this page
        let redirect_url;
        try {
            const tokens  = storeTokens();
            let loginid = Cookies.get('loginid');

            if (!loginid) { // redirected to another domain (e.g. github.io) so those cookie are not accessible here
                const loginids = Object.keys(tokens);
                let loginid_list = '';
                loginids.map((id) => {
                    loginid_list += `${(loginid_list ? '+' : '')}${id}:${(/^V/i.test(id) ? 'V' : 'R')}:E`; // since there is not any data source to check, so assume all are enabled, disabled accounts will be handled on authorize
                });
                loginid = loginids[0];
                // set cookies
                Client.setCookie('loginid',      loginid);
                Client.setCookie('loginid_list', loginid_list);
            }
            Client.setCookie('login', tokens[loginid].token);

            // set flags
            GTM.setLoginFlag();

            // redirect url
            redirect_url = sessionStorage.getItem('redirect_url');
            sessionStorage.removeItem('redirect_url');
        } catch (e) { console.log('storage is not supported'); }

        // redirect back
        let set_default = true;
        if (redirect_url) {
            const do_not_redirect = ['reset_passwordws', 'lost_passwordws', 'change_passwordws', 'home', 'home-jp'];
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
        // Parse hash for loginids and tokens returned by OAuth
        const hash = (window.location.search).substr(1).split('&');
        const tokens = {};
        let i = 0;
        let index;

        const getAcct = c => new RegExp(`acct${i + 1}`).test(c);

        while (new RegExp(`acct${i + 1}`).test(hash)) {
            index = hash.findIndex(getAcct);
            const loginid  = getHashValue(hash[index], 'acct');
            const token    = getHashValue(hash[index + 1], 'token');
            const currency = getHashValue(hash[index + 2], 'cur');
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

    const getHashValue = (source, key) => (
        source && source.length > 0 ? (new RegExp(`^${key}`).test(source.split('=')[0]) ? source.split('=')[1] : '') : ''
    );

    return {
        onLoad: onLoad,
    };
})();

module.exports = LoggedInHandler;

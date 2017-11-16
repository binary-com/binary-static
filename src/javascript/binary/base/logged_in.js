const Cookies            = require('js-cookie');
const Client             = require('./client');
const GTM                = require('./gtm');
const getLanguage        = require('./language').get;
const urlLang            = require('./language').urlLang;
const isStorageSupported = require('./storage').isStorageSupported;
const urlFor             = require('./url').urlFor;
const paramsHash         = require('./url').paramsHash;

const LoggedInHandler = (() => {
    const onLoad = () => {
        parent.window.is_logging_in = 1; // this flag is used in base.js to prevent auto-reloading this page
        let redirect_url;
        if (isStorageSupported(localStorage) && isStorageSupported(sessionStorage)) {
            storeClientAccounts();
            // redirect url
            redirect_url = sessionStorage.getItem('redirect_url');
            sessionStorage.removeItem('redirect_url');
        } else {
            Client.doLogout({ logout: 1 });
        }

        // redirect back
        let set_default = true;
        if (redirect_url) {
            const do_not_redirect = ['reset_passwordws', 'lost_passwordws', 'change_passwordws', 'home', 'home-jp', '404'];
            const reg            = new RegExp(do_not_redirect.join('|'), 'i');
            if (!reg.test(redirect_url) && urlFor('') !== redirect_url) {
                set_default = false;
            }
        }
        if (set_default) {
            const lang_cookie = urlLang(redirect_url) || Cookies.get('language');
            const language    = getLanguage();
            redirect_url      = Client.defaultRedirectUrl();
            if (lang_cookie && lang_cookie !== language) {
                redirect_url = redirect_url.replace(new RegExp(`/${language}/`, 'i'), `/${lang_cookie.toLowerCase()}/`);
            }
        }
        document.getElementById('loading_link').setAttribute('href', redirect_url);
        window.location.href = redirect_url; // need to redirect not using pjax
    };

    const storeClientAccounts = () => {
        const email         = Cookies.get('email') || '';
        const residence     = Cookies.get('residence') || '';
        const loginid_list  = Cookies.get('loginid_list');
        let default_loginid = '';
        let is_loginid_set  = false;

        // Parse url for loginids, tokens, and currencies returned by OAuth
        const params = paramsHash(window.location.href);
        // Clear all accounts before entering the loop
        Client.clearAllAccounts();
        let i = 1;
        while (params[`acct${i}`]) {
            const loginid     = params[`acct${i}`];
            const token       = params[`token${i}`];
            const currency    = params[`cur${i}`] || '';
            const is_ico_only = isIcoOnly(loginid_list, loginid);
            if (loginid && token) {
                if (!is_ico_only && !is_loginid_set && !default_loginid) {
                    default_loginid = loginid; // assume the first non-ico account as default if cookie is not available
                    is_loginid_set  = true;
                }
                if (loginid === default_loginid) {
                    Client.set('loginid', loginid);
                }
                Client.set('token',      token,     loginid);
                Client.set('currency',   currency,  loginid);
                Client.set('email',      email,     loginid);
                Client.set('residence',  residence, loginid);
                Client.set('is_virtual', +Client.isAccountOfType('virtual', loginid), loginid);
                Client.set('is_ico_only', is_ico_only, loginid);
                if (isDisabled(loginid_list, loginid)) {
                    Client.set('is_disabled', 1, loginid);
                }
            }
            i++;
        }

        if (Client.isLoggedIn()) {
            GTM.setLoginFlag();
            // Remove cookies to prevent conflicts between sub-domains
            Client.cleanupCookies('email', 'login', 'loginid', 'loginid_list', 'residence');
        }
    };

    const isDisabled = (loginid_list, loginid) => (loginid_list ? +(new RegExp(`${loginid}:[VR]:D`)).test(loginid_list) : 0);

    const isIcoOnly = (loginid_list, loginid) => (loginid_list ? +(new RegExp(`${loginid}:[VR]:[DE]:I`)).test(loginid_list) : 0);

    return {
        onLoad,
    };
})();

module.exports = LoggedInHandler;

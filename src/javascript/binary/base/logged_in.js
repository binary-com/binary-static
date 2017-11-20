const Cookies            = require('js-cookie');
const moment             = require('moment');
const Client             = require('./client');
const GTM                = require('./gtm');
const getLanguage        = require('./language').get;
const urlLang            = require('./language').urlLang;
const isStorageSupported = require('./storage').isStorageSupported;
const State              = require('./storage').State;
const urlFor             = require('./url').urlFor;
const paramsHash         = require('./url').paramsHash;

const LoggedInHandler = (() => {
    const onLoad = () => {
        parent.window.is_logging_in = 1; // this flag is used in base.js to prevent auto-reloading this page
        let redirect_url;
        const account_list = State.getResponse('authorize.account_list');
        if (isStorageSupported(localStorage) && isStorageSupported(sessionStorage) && account_list) {
            storeClientAccounts(account_list);
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
            const reg             = new RegExp(do_not_redirect.join('|'), 'i');
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

    const storeClientAccounts = (account_list) => {
        // Parse url for loginids, tokens, and currencies returned by OAuth
        const params = paramsHash(window.location.href);

        // Clear all accounts before entering the loop
        Client.clearAllAccounts();

        let is_loginid_set = false;
        let i = 1;
        while (params[`acct${i}`]) {
            const loginid  = params[`acct${i}`];
            const token    = params[`token${i}`];
            const currency = params[`cur${i}`] || '';
            if (loginid && token) {
                // set the first non-ico account as default loginid
                if (!is_loginid_set && !account_list[loginid].is_ico_only) {
                    Client.set('loginid', loginid);
                    is_loginid_set = true;
                }
                Client.set('token',    token,    loginid);
                Client.set('currency', currency, loginid);
            }
            i++;
        }

        Object.keys(account_list).forEach((loginid) => {
            Client.set('residence',                 account_list[loginid].country,              loginid);
            Client.set('email',                     account_list[loginid].email,                loginid);
            Client.set('excluded_until',            account_list[loginid].excluded_until,       loginid);
            Client.set('is_disabled',               account_list[loginid].is_disabled,          loginid);
            Client.set('is_ico_only',               account_list[loginid].is_ico_only,          loginid);
            Client.set('is_virtual',                account_list[loginid].is_virtual,           loginid);
            Client.set('landing_company_shortcode', account_list[loginid].landing_company_name, loginid);
        });

        if (Client.isLoggedIn()) {
            GTM.setLoginFlag();
            Client.set('session_start', parseInt(moment().valueOf() / 1000));
            // Remove cookies that were set by the old code
            Client.cleanupCookies('email', 'login', 'loginid', 'loginid_list', 'residence');
        }
    };

    return {
        onLoad,
    };
})();

module.exports = LoggedInHandler;

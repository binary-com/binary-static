const Cookies            = require('js-cookie');
const moment             = require('moment');
const Client             = require('./client');
const GTM                = require('./gtm');
const BinarySocket       = require('./socket');
const SocketCache        = require('./socket_cache');
const getElementById     = require('../../_common/common_functions').getElementById;
const getLanguage        = require('../../_common/language').get;
const urlLang            = require('../../_common/language').urlLang;
const isStorageSupported = require('../../_common/storage').isStorageSupported;
const paramsHash         = require('../../_common/url').paramsHash;
const urlFor             = require('../../_common/url').urlFor;
const getPropertyValue   = require('../../_common/utility').getPropertyValue;

const LoggedInHandler = (() => {
    const onLoad = () => {
        SocketCache.clear();
        parent.window.is_logging_in = 1; // this flag is used in base.js to prevent auto-reloading this page
        let redirect_url;
        const params = paramsHash(window.location.href);
        BinarySocket.send({ authorize: params.token1 }).then((response) => {
            const account_list = getPropertyValue(response, ['authorize', 'account_list']);
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
            getElementById('loading_link').setAttribute('href', redirect_url);
            window.location.href = redirect_url; // need to redirect not using pjax
        });
    };

    // store consistent names with other API calls
    // API_V4: send consistent names
    const map_names = {
        country             : 'residence',
        landing_company_name: 'landing_company_shortcode',
    };

    const storeClientAccounts = (account_list) => {
        // Parse url for loginids, tokens, and currencies returned by OAuth
        const params = paramsHash(window.location.href);

        // Clear all accounts before entering the loop
        Client.clearAllAccounts();

        let is_loginid_set = false;
        account_list.forEach((account) => {
            Object.keys(account).forEach((param) => {
                if (param === 'loginid') {
                    if (!is_loginid_set && !account.is_virtual &&
                        !account.is_disabled) {
                        Client.set(param, account[param]);
                        is_loginid_set = true;
                    }
                } else {
                    const param_to_set = map_names[param] || param;
                    const value_to_set = typeof account[param] === 'undefined' ? '' : account[param];
                    Client.set(param_to_set, value_to_set, account.loginid);
                }
            });
        });

        // if didn't find any login ID that matched the above condition, set the first one at the end of the loop
        if (!is_loginid_set) {
            Client.set('loginid', params.acct1 || account_list[0].loginid);
            is_loginid_set = true;
        }

        let i = 1;
        while (params[`acct${i}`]) {
            const loginid = params[`acct${i}`];
            const token   = params[`token${i}`];
            if (loginid && token) {
                Client.set('token', token, loginid);
            }
            i++;
        }

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

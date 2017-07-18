const Cookies            = require('js-cookie');
const moment             = require('moment');
const LocalStore         = require('./storage').LocalStore;
const State              = require('./storage').State;
const defaultRedirectUrl = require('./url').defaultRedirectUrl;
const getPropertyValue   = require('./utility').getPropertyValue;
const isEmptyObject      = require('./utility').isEmptyObject;
const jpClient           = require('../common_functions/country_base').jpClient;
const BinarySocket       = require('../websocket_pages/socket');
const RealityCheckData   = require('../websocket_pages/user/reality_check/reality_check.data');

const Client = (() => {
    'use strict';

    const storage_key = 'client.accounts';
    let client_object = {},
        current_loginid;

    const init = () => {
        current_loginid = LocalStore.get('active_loginid');
        backwardCompatibility();
        client_object = getAllAccountsObject();
    };

    const isLoggedIn = () => (
        !isEmptyObject(getAllAccountsObject()) &&
        get('loginid') &&
        get('token')
    );

    const validateLoginid = () => {
        if (!isLoggedIn()) return;
        const valid_login_ids = new RegExp('^(MX|MF|VRTC|MLT|CR|FOG|VRTJ|JP)[0-9]+$', 'i');
        getAllLoginids().concat(get('loginid')).some((loginid) => {
            if (!valid_login_ids.test(loginid)) {
                sendLogoutRequest();
                return true;
            }
            return false;
        });
    };

    /**
     * Stores the client information in local variable and localStorage
     *
     * @param {String} key                 The property name to set
     * @param {String|Number|Object} value The regarding value
     * @param {String|null} loginid        The account to set the value for
     */
    const set = (key, value, loginid = current_loginid) => {
        if (key === 'loginid' && value !== current_loginid) {
            LocalStore.set('active_loginid', value);
            current_loginid = value;
        } else {
            if (!(loginid in client_object)) {
                client_object[loginid] = {};
            }
            client_object[loginid][key] = value;
            LocalStore.setObject(storage_key, client_object);
        }
    };

    /**
     * Returns the client information
     *
     * @param {String|null} key     The property name to return the value from, if missing returns the account object
     * @param {String|null} loginid The account to return the value from
     */
    const get = (key, loginid = current_loginid) => {
        let value;
        if (key === 'loginid') {
            value = loginid || LocalStore.get('active_loginid');
        } else {
            const current_client = client_object[loginid] || getAllAccountsObject()[loginid] || {};
            value = key ? current_client[key] : current_client;
        }
        if (!Array.isArray(value) && (+value === 1 || +value === 0 || value === 'true' || value === 'false')) {
            value = JSON.parse(value || false);
        }
        return value;
    };

    const getAllAccountsObject = () => LocalStore.getObject(storage_key);

    const getAllLoginids = () => Object.keys(getAllAccountsObject());

    const getAccountType = (loginid = current_loginid) => {
        let account_type;
        if (/^VR/.test(loginid))        account_type = 'virtual';
        else if (/^MF/.test(loginid))   account_type = 'financial';
        else if (/^MLT/.test(loginid))  account_type = 'gaming';
        return account_type;
    };

    const isAccountOfType = (type, loginid = current_loginid) => {
        const this_type = getAccountType(loginid);
        return (
            (type === 'virtual' && this_type === 'virtual') ||
            (type === 'real'    && this_type !== 'virtual') ||
            type === this_type);
    };

    const getAccountOfType = (type, only_enabled) => {
        const id = getAllLoginids().find(loginid => (
            isAccountOfType(type, loginid) &&
            (only_enabled ? !get('is_disabled', loginid) : true)
        ));
        return id ? $.extend({ loginid: id }, get(null, id)) : {};
    };

    const hasAccountType = (type, only_enabled) => !isEmptyObject(getAccountOfType(type, only_enabled));

    const responseAuthorize = (response) => {
        const authorize = response.authorize;
        set('email',         authorize.email);
        set('currency',      authorize.currency);
        set('is_virtual',    +authorize.is_virtual);
        set('session_start', parseInt(moment().valueOf() / 1000));
        set('landing_company_shortcode', authorize.landing_company_name);
    };

    const shouldAcceptTnc = () => {
        if (get('is_virtual')) return false;
        const website_tnc_version = State.getResponse('website_status.terms_conditions_version');
        const get_settings = State.getResponse('get_settings');
        return get_settings.hasOwnProperty('client_tnc_status') && get_settings.client_tnc_status !== website_tnc_version;
    };

    const clearAllAccounts = () => {
        current_loginid = undefined;
        client_object = {};
        LocalStore.setObject(storage_key, client_object);

        const hash = window.location.hash;
        if (/no-reality-check/.test(hash)) {
            window.location.hash = hash.replace('no-reality-check', '');
        }
    };

    /**
     * Upgrade the structure of client info to the new one
     * (for clients which already are logged-in with the old version)
     */
    const backwardCompatibility = () => {
        if (!current_loginid) return;

        const accounts_obj    = LocalStore.getObject('client.tokens');
        const current_account = getPropertyValue(accounts_obj, current_loginid) || {};

        // 1. client.tokens = { loginid1: token1, loginid2, token2 }
        if (typeof current_account !== 'object') {
            Object.keys(accounts_obj).forEach((loginid) => {
                accounts_obj[loginid] = { token: current_account };
            });
        }

        // 2. client.tokens = { loginid1: { token: token1, currency: currency1 }, loginid2: { ... } }
        if (!isEmptyObject(accounts_obj)) {
            const keys = ['balance', 'currency', 'email', 'is_virtual', 'residence', 'session_start'];
            // read current client.* values and set in new object
            const setValue = (old_key, new_key) => {
                const value = LocalStore.get(`client.${old_key}`);
                if (value) {
                    accounts_obj[current_loginid][new_key || old_key] = value;
                }
            };
            keys.forEach((key) => { setValue(key); });
            setValue('landing_company_name', 'landing_company_shortcode');

            // remove all client.* and cookies
            Object.keys(LocalStore.storage).forEach((key) => {
                if (/^client\./.test(key)) {
                    LocalStore.remove(key);
                }
            });
            cleanupCookies('email', 'login', 'loginid', 'loginid_list', 'residence');

            // set client.accounts
            LocalStore.setObject(storage_key, accounts_obj);
        }
    };

    const processNewAccount = (email, loginid, token, is_virtual) => {
        if (!email || !loginid || !token) {
            return;
        }

        localStorage.setItem('GTM_new_account', '1');
        RealityCheckData.clear();

        set('token',      token,       loginid);
        set('email',      email,       loginid);
        set('is_virtual', +is_virtual, loginid);
        set('loginid',    loginid);

        window.location.href = defaultRedirectUrl(); // need to redirect not using pjax
    };

    const hasShortCode = (data, code) => ((data || {}).shortcode === code);

    const canUpgradeGamingToFinancial = data => (hasShortCode(data.financial_company, 'maltainvest'));

    const canUpgradeVirtualToFinancial = data => (!data.gaming_company && hasShortCode(data.financial_company, 'maltainvest'));

    const canUpgradeVirtualToJapan = data => (!data.gaming_company && hasShortCode(data.financial_company, 'japan'));

    const activateByClientType = (section = 'body') => {
        if (isLoggedIn()) {
            BinarySocket.wait('authorize', 'website_status').then(() => {
                $('#client-logged-in').addClass('gr-centered');
                $('.client_logged_in').setVisibility(1);
                if (get('is_virtual')) {
                    $(section).find('.client_virtual').setVisibility(1);
                    $('#topbar').addClass('secondary-bg-color').removeClass('primary-color-dark');
                } else {
                    $(section).find('.client_real').not((jpClient() ? '.ja-hide' : '')).setVisibility(1);
                    $('#topbar').addClass('primary-color-dark').removeClass('secondary-bg-color');
                }
            });
        } else {
            $(section).find('.client_logged_out').setVisibility(1);
            $('#topbar').addClass('primary-color-dark').removeClass('secondary-bg-color');
        }
    };

    const sendLogoutRequest = (show_login_page) => {
        if (show_login_page) {
            sessionStorage.setItem('showLoginPage', 1);
        }
        BinarySocket.send({ logout: '1' });
    };

    const doLogout = (response) => {
        if (response.logout !== 1) return;
        cleanupCookies('login', 'loginid', 'loginid_list', 'email', 'residence'); // backward compatibility
        cleanupCookies('settings', 'reality_check', 'affiliate_token', 'affiliate_tracking');
        clearAllAccounts();
        set('loginid', '');
        window.location.reload();
    };

    const cleanupCookies = (...cookie_names) => {
        const domains = [
            `.${document.domain.split('.').slice(-2).join('.')}`,
            `.${document.domain}`,
        ];

        let parent_path = window.location.pathname.split('/', 2)[1];
        if (parent_path !== '') {
            parent_path = `/${parent_path}`;
        }

        cookie_names.forEach((c) => {
            Cookies.remove(c, { path: '/', domain: domains[0] });
            Cookies.remove(c, { path: '/', domain: domains[1] });
            Cookies.remove(c);
            if (new RegExp(c).test(document.cookie) && parent_path) {
                Cookies.remove(c, { path: parent_path, domain: domains[0] });
                Cookies.remove(c, { path: parent_path, domain: domains[1] });
                Cookies.remove(c, { path: parent_path });
            }
        });
    };

    const currentLandingCompany = () => {
        const landing_company_response = State.getResponse('landing_company') || {};
        const lc_prop = Object.keys(landing_company_response)
            .find(key => get('landing_company_shortcode') === landing_company_response[key].shortcode);
        return landing_company_response[lc_prop] || {};
    };

    const isFinancial = () => isAccountOfType('financial');

    const shouldCompleteTax = () => isFinancial() && !/crs_tin_information/.test((State.getResponse('get_account_status') || {}).status);

    const getMT5AccountType = group => (group ? group.replace('\\', '_') : '');

    return {
        init             : init,
        validateLoginid  : validateLoginid,
        set              : set,
        get              : get,
        getAllLoginids   : getAllLoginids,
        getAccountType   : getAccountType,
        getAccountOfType : getAccountOfType,
        hasAccountType   : hasAccountType,
        responseAuthorize: responseAuthorize,
        shouldAcceptTnc  : shouldAcceptTnc,
        clearAllAccounts : clearAllAccounts,
        processNewAccount: processNewAccount,
        isLoggedIn       : isLoggedIn,
        sendLogoutRequest: sendLogoutRequest,
        cleanupCookies   : cleanupCookies,
        doLogout         : doLogout,
        isFinancial      : isFinancial,
        shouldCompleteTax: shouldCompleteTax,
        getMT5AccountType: getMT5AccountType,

        canUpgradeGamingToFinancial : canUpgradeGamingToFinancial,
        canUpgradeVirtualToFinancial: canUpgradeVirtualToFinancial,
        canUpgradeVirtualToJapan    : canUpgradeVirtualToJapan,
        activateByClientType        : activateByClientType,
        currentLandingCompany       : currentLandingCompany,
    };
})();

module.exports = Client;

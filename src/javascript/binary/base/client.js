const Cookies            = require('js-cookie');
const moment             = require('moment');
const CookieStorage      = require('./storage').CookieStorage;
const LocalStore         = require('./storage').LocalStore;
const State              = require('./storage').State;
const urlFor             = require('./url').urlFor;
const defaultRedirectUrl = require('./url').defaultRedirectUrl;
const getPropertyValue   = require('./utility').getPropertyValue;
const getLoginToken      = require('../common_functions/common_functions').getLoginToken;
const jpClient           = require('../common_functions/country_base').jpClient;
const BinarySocket       = require('../websocket_pages/socket');
const RealityCheckData   = require('../websocket_pages/user/reality_check/reality_check.data');

const Client = (() => {
    'use strict';

    const client_object = {};

    const parseLoginIDList = (string) => {
        if (!string) return [];
        return string.split('+').sort().map((str) => {
            const items = str.split(':');
            const id = items[0];
            const is_real = items[1] === 'R';
            const is_financial = /^MF/.test(id);
            const is_gaming = /^MLT/.test(id);

            if (is_real) client_object.has_real = is_real;
            if (is_financial) client_object.has_financial = is_financial;
            if (is_gaming) client_object.has_gaming = is_gaming;

            return {
                id           : id,
                real         : is_real,
                disabled     : items[2] === 'D',
                financial    : is_financial,
                non_financial: is_gaming,
            };
        });
    };

    const init = () => {
        client_object.loginid_array = parseLoginIDList(Cookies.get('loginid_list') || '');

        set('email',     Cookies.get('email'));
        set('loginid',   Cookies.get('loginid'));
        set('residence', Cookies.get('residence'));

        backwardCompatibility();
    };

    const isLoggedIn = () => (
        get('tokens') &&
        getLoginToken() &&
        Cookies.get('loginid') &&
        client_object.loginid_array.length > 0
    );

    const validateLoginid = () => {
        const loginid_list = Cookies.get('loginid_list');
        const client_id    = Cookies.get('loginid');
        if (!client_id || !loginid_list) return;

        const valid_login_ids = new RegExp('^(MX|MF|VRTC|MLT|CR|FOG|VRTJ|JP)[0-9]+$', 'i');

        if (!valid_login_ids.test(client_id)) {
            sendLogoutRequest();
        }

        loginid_list.split('+').forEach((acc_id) => {
            if (!valid_login_ids.test(acc_id.split(':')[0])) {
                sendLogoutRequest();
            }
        });
    };

    const set = (key, value) => {
        client_object[key] = value;
        return LocalStore.set(`client.${key}`, value);
    };

    // use this function to get variables that have values
    const get = (key) => {
        let value = client_object[key] || LocalStore.get(`client.${key}`) || '';
        if (!Array.isArray(value) && (+value === 1 || +value === 0 || value === 'true' || value === 'false')) {
            value = JSON.parse(value || false);
        }
        return value;
    };

    const responseAuthorize = (response) => {
        const authorize = response.authorize;
        if (!Cookies.get('email')) {
            setCookie('email', authorize.email);
            set('email', authorize.email);
        }
        set('session_start', parseInt(moment().valueOf() / 1000));
        set('is_virtual', authorize.is_virtual);
        set('landing_company_name', authorize.landing_company_name);
        set('landing_company_fullname', authorize.landing_company_fullname);
        setCurrency(authorize.currency);
    };

    const shouldAcceptTnc = () => {
        if (get('is_virtual')) return false;
        const website_tnc_version = State.get(['response', 'website_status', 'website_status', 'terms_conditions_version']);
        const get_settings = State.get(['response', 'get_settings', 'get_settings']);
        return get_settings.hasOwnProperty('client_tnc_status') && get_settings.client_tnc_status !== website_tnc_version;
    };

    const clear = () => {
        // clear all client values from local storage
        Object.keys(localStorage).forEach((c) => {
            if (/^client\.(?!(tokens$))/.test(c)) {
                LocalStore.set(c, '');
            }
        });
        const hash = window.location.hash;
        if (/no-reality-check/.test(hash)) {
            window.location.hash = hash.replace('no-reality-check', '');
        }
    };

    const getAccountObj = client_loginid => (getPropertyValue(JSON.parse(get('tokens') || '{}'), [client_loginid]) || {});

    const getToken = client_loginid => getPropertyValue(getAccountObj(client_loginid), ['token']);

    const setCurrency = (currency) => {
        const tokens = get('tokens');
        const tokens_obj = tokens && tokens.length > 0 ? JSON.parse(tokens) : {};
        const account_obj = tokens_obj[get('loginid')];
        if (!account_obj.currency) {
            account_obj.currency = currency;
            set('tokens', JSON.stringify(tokens_obj));
        }
        set('currency', currency);
    };

    const backwardCompatibility = () => {
        // upgrade client.tokens structure to the new one (for clients which already are logged-in with the old version)
        const account_obj = getAccountObj(get('loginid'));
        if (typeof account_obj !== 'object') {
            const tokens = get('tokens');
            const tokens_obj = tokens && tokens.length > 0 ? JSON.parse(tokens) : {};
            Object.keys(tokens_obj).forEach((loginid) => {
                tokens_obj[loginid] = { token: tokens_obj[loginid] };
            });
            set('tokens', JSON.stringify(tokens_obj));
        }
    };

    const addToken = (client_loginid, token) => {
        if (!client_loginid || !token || getToken(client_loginid)) {
            return false;
        }
        const tokens = get('tokens');
        const tokens_obj = tokens && tokens.length > 0 ? JSON.parse(tokens) : {};
        tokens_obj[client_loginid] = { token: token, currency: '' };
        set('tokens', JSON.stringify(tokens_obj));
        return true;
    };

    const setCookie = (cookie_name, Value, domain) => {
        const cookie_expire = new Date();
        cookie_expire.setDate(cookie_expire.getDate() + 60);
        const cookie = new CookieStorage(cookie_name, domain);
        cookie.write(Value, cookie_expire, true);
    };

    const processNewAccount = (options) => {
        if (!options.email || !options.loginid || !options.token) {
            return;
        }
        // save token
        addToken(options.loginid, options.token);
        // set cookies
        setCookie('email',        options.email);
        setCookie('login',        options.token);
        setCookie('loginid',      options.loginid);
        setCookie('loginid_list', options.is_virtual ? `${options.loginid}:V:E` : `${options.loginid}:R:E+${Cookies.get('loginid_list')}`);
        // set local storage
        localStorage.setItem('GTM_new_account', '1');
        localStorage.setItem('active_loginid', options.loginid);
        RealityCheckData.clear();
        // need to redirect not using pjax
        window.location.href = jpClient() || options.is_virtual ? defaultRedirectUrl() : (options.redirect_url || `${urlFor('user/set-currency')}#new_account`);
    };

    const hasShortCode = (data, code) => ((data || {}).shortcode === code);

    const canUpgradeGamingToFinancial = data => (hasShortCode(data.financial_company, 'maltainvest'));

    const canUpgradeVirtualToFinancial = data => (!data.gaming_company && hasShortCode(data.financial_company, 'maltainvest'));

    const canUpgradeVirtualToJapan = data => (!data.gaming_company && hasShortCode(data.financial_company, 'japan'));

    const hasGamingFinancialEnabled = () => {
        let has_financial = false,
            has_gaming = false;

        client_object.loginid_array.forEach((client) => {
            if (!client.disabled) {
                if (client.financial) {
                    has_financial = true;
                } else if (client.non_financial) {
                    has_gaming = true;
                }
            }
        });

        return has_gaming && has_financial;
    };

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
        clear();
        LocalStore.remove('client.tokens');
        const cookies = ['login', 'loginid', 'loginid_list', 'email', 'settings', 'reality_check', 'affiliate_token', 'affiliate_tracking', 'residence'];
        const domains = [
            `.${document.domain.split('.').slice(-2).join('.')}`,
            `.${document.domain}`,
        ];

        let parent_path = window.location.pathname.split('/', 2)[1];
        if (parent_path !== '') {
            parent_path = `/${parent_path}`;
        }

        cookies.forEach((c) => {
            const regex = new RegExp(c);
            Cookies.remove(c, { path: '/', domain: domains[0] });
            Cookies.remove(c, { path: '/', domain: domains[1] });
            Cookies.remove(c);
            if (regex.test(document.cookie) && parent_path) {
                Cookies.remove(c, { path: parent_path, domain: domains[0] });
                Cookies.remove(c, { path: parent_path, domain: domains[1] });
                Cookies.remove(c, { path: parent_path });
            }
        });
        window.location.reload();
    };

    const currentLandingCompany = () => {
        const landing_company_response = State.get(['response', 'landing_company', 'landing_company']) || {};
        let client_landing_company = {};
        Object.keys(landing_company_response).forEach((key) => {
            if (client_object.landing_company_name === landing_company_response[key].shortcode) {
                client_landing_company = landing_company_response[key];
            }
        });
        return client_landing_company;
    };

    const isFinancial = () => (client_object.loginid_array.find(obj => (obj.id === get('loginid'))) || {}).financial;

    const shouldCompleteTax = () => isFinancial() && !/crs_tin_information/.test((State.get(['response', 'get_account_status', 'get_account_status']) || {}).status);

    const getMT5AccountType = group => (group ? group.replace('\\', '_') : '');

    const canUpgrade = (landing_company) => {
        const loginid_array = client_object.loginid_array;
        let can_upgrade = false;
        if (get('is_virtual')) {
            can_upgrade = !loginid_array.some(client => client.real);
        } else if (Client.canUpgradeGamingToFinancial(landing_company)) {
            can_upgrade = !loginid_array.some(client => client.financial);
        }
        return can_upgrade;
    };

    const getLandingCompanyValue = (current_account, landing_company, key) => {
        let landing_company_object;
        if (current_account.financial) {
            landing_company_object = getPropertyValue(landing_company, 'financial_company');
        } else if (current_account.real) {
            landing_company_object = getPropertyValue(landing_company, 'gaming_company');

            // handle accounts such as japan that don't have gaming company
            if (!landing_company_object) {
                landing_company_object = getPropertyValue(landing_company, 'financial_company');
            }
        } else {
            const financial_company = (getPropertyValue(landing_company, 'financial_company') || {})[key];
            const gaming_company = (getPropertyValue(landing_company, 'gaming_company') || {})[key];
            landing_company_object = financial_company.concat(gaming_company);
            return landing_company_object;
        }
        return (landing_company_object || {})[key];
    };

    return {
        init             : init,
        validateLoginid  : validateLoginid,
        set              : set,
        get              : get,
        responseAuthorize: responseAuthorize,
        shouldAcceptTnc  : shouldAcceptTnc,
        clear            : clear,
        getToken         : getToken,
        setCurrency      : setCurrency,
        setCookie        : setCookie,
        processNewAccount: processNewAccount,
        isLoggedIn       : isLoggedIn,
        sendLogoutRequest: sendLogoutRequest,
        doLogout         : doLogout,
        isFinancial      : isFinancial,
        shouldCompleteTax: shouldCompleteTax,
        getMT5AccountType: getMT5AccountType,
        canUpgrade       : canUpgrade,

        canUpgradeGamingToFinancial : canUpgradeGamingToFinancial,
        canUpgradeVirtualToFinancial: canUpgradeVirtualToFinancial,
        canUpgradeVirtualToJapan    : canUpgradeVirtualToJapan,
        hasGamingFinancialEnabled   : hasGamingFinancialEnabled,
        activateByClientType        : activateByClientType,
        currentLandingCompany       : currentLandingCompany,
        getLandingCompanyValue      : getLandingCompanyValue,
    };
})();

module.exports = Client;

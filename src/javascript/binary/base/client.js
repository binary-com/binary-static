const Cookies            = require('js-cookie');
const moment             = require('moment');
const LocalStore         = require('./storage').LocalStore;
const State              = require('./storage').State;
const defaultRedirectUrl = require('./url').defaultRedirectUrl;
const applyToAllElements = require('./utility').applyToAllElements;
const getPropertyValue   = require('./utility').getPropertyValue;
const isEmptyObject      = require('./utility').isEmptyObject;
const jpClient           = require('../common_functions/country_base').jpClient;
const isCryptocurrency   = require('../common_functions/currency').isCryptocurrency;
const BinarySocket       = require('../websocket_pages/socket');
const RealityCheckData   = require('../websocket_pages/user/reality_check/reality_check.data');

const Client = (() => {
    const storage_key = 'client.accounts';
    let client_object = {};
    let current_loginid;

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
        getAllLoginids().some((loginid) => {
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
        if (/^VR/.test(loginid))       account_type = 'virtual';
        else if (/^MF/.test(loginid))  account_type = 'financial';
        else if (/^MLT/.test(loginid)) account_type = 'gaming';
        return account_type;
    };

    const isAccountOfType = (type, loginid = current_loginid, only_enabled = false) => {
        const this_type   = getAccountType(loginid);
        const is_ico_only = get('is_ico_only', loginid);
        return ((
            (type === 'virtual' && this_type === 'virtual') ||
            (type === 'real'    && this_type !== 'virtual') ||
            type === this_type) && !is_ico_only &&              // Account shouldn't be ICO_ONLY.
            (only_enabled ? !get('is_disabled', loginid) : true));
    };

    const getAccountOfType = (type, only_enabled) => {
        const id = getAllLoginids().find(loginid => isAccountOfType(type, loginid, only_enabled));
        return id ? $.extend({ loginid: id }, get(null, id)) : {};
    };

    const hasAccountType = (type, only_enabled) => !isEmptyObject(getAccountOfType(type, only_enabled));

    // only considers currency of real money accounts
    // @param {String} type = crypto|fiat
    const hasCurrencyType = (type) => {
        const loginids = getAllLoginids();
        if (type === 'crypto') {
            // find if has crypto currency account
            return loginids.find(loginid =>
                !get('is_virtual', loginid) && isCryptocurrency(get('currency', loginid)));
        }
        // else find if have fiat currency account
        return loginids.find(loginid =>
            !get('is_virtual', loginid) && !isCryptocurrency(get('currency', loginid)));
    };

    const types_map = {
        virtual  : 'Virtual',
        gaming   : 'Gaming',
        financial: 'Investment',
    };

    const getAccountTitle = loginid => types_map[getAccountType(loginid)] || 'Real';

    const responseAuthorize = (response) => {
        const authorize = response.authorize;
        set('email',      authorize.email);
        set('currency',   authorize.currency);
        set('is_virtual', +authorize.is_virtual);
        set('session_start', parseInt(moment().valueOf() / 1000));
        set('landing_company_shortcode', authorize.landing_company_name);
    };

    const shouldAcceptTnc = () => {
        if (get('is_virtual')) return false;
        const website_tnc_version = State.getResponse('website_status.terms_conditions_version');
        const client_tnc_status   = State.getResponse('get_settings.client_tnc_status');
        return typeof client_tnc_status !== 'undefined' && client_tnc_status !== website_tnc_version;
    };

    const clearAllAccounts = () => {
        current_loginid = undefined;
        client_object   = {};
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
            const keys     = ['balance', 'currency', 'email', 'is_virtual', 'residence', 'session_start'];
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

    const processNewAccount = (options) => {
        if (!options.email || !options.loginid || !options.token) {
            return;
        }

        localStorage.setItem('GTM_new_account', '1');

        set('token',      options.token,       options.loginid);
        set('email',      options.email,       options.loginid);
        set('is_virtual', +options.is_virtual, options.loginid);
        set('loginid',    options.loginid);

        // need to redirect not using pjax
        window.location.href = options.redirect_url || defaultRedirectUrl();
    };

    const activateByClientType = (section_id) => {
        const topbar = document.getElementById('topbar');
        if (!topbar) {
            return;
        }
        const topbar_class = topbar.classList;
        const el_section   = section_id ? document.getElementById(section_id) : document.body;
        if (!el_section) {
            return;
        }
        const primary_bg_color_dark = 'primary-bg-color-dark';
        const secondary_bg_color    = 'secondary-bg-color';

        if (isLoggedIn()) {
            BinarySocket.wait('authorize', 'website_status', 'get_account_status').then(() => {
                const client_logged_in = document.getElementById('client-logged-in');
                if (client_logged_in) {
                    client_logged_in.classList.add('gr-centered');
                }

                const is_ico_only = /ico_only/.test(State.getResponse('get_account_status.status'));
                Client.set('is_ico_only', is_ico_only); // Set ico_only in Client object.

                if (is_ico_only) {
                    applyToAllElements('.ico-only-hide', (el) => { el.setVisibility(0); });
                }

                applyToAllElements('.client_logged_in', (el) => {
                    if (!/ico-only-hide/.test(el.classList) || !is_ico_only) {
                        el.setVisibility(1);
                    }
                });

                if (get('is_virtual')) {
                    applyToAllElements('.client_virtual', (el) => { el.setVisibility(1); }, '', el_section);
                    topbar_class.add(secondary_bg_color);
                    topbar_class.remove(primary_bg_color_dark);
                } else {
                    const is_jp = jpClient();
                    applyToAllElements('.client_real', (el) => {
                        if ((!is_jp || !/ja-hide/.test(el.classList)) &&
                            !/ico-only-hide/.test(el.classList) || !is_ico_only) {
                            el.setVisibility(1);
                        }}, '', el_section);
                    topbar_class.add(primary_bg_color_dark);
                    topbar_class.remove(secondary_bg_color);
                }
            });
        } else {
            applyToAllElements('.client_logged_out', (el) => { el.setVisibility(1); }, '', el_section);
            topbar_class.add(primary_bg_color_dark);
            topbar_class.remove(secondary_bg_color);
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
        cleanupCookies('login', 'loginid', 'loginid_list', 'email', 'residence', 'settings'); // backward compatibility
        cleanupCookies('reality_check', 'affiliate_token', 'affiliate_tracking');
        clearAllAccounts();
        set('loginid', '');
        RealityCheckData.clear();
        const redirect_to = getPropertyValue(response, ['echo_req', 'passthrough', 'redirect_to']);
        if (redirect_to) {
            window.location.href = redirect_to;
        } else {
            window.location.reload();
        }
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
        const lc_prop                  = Object.keys(landing_company_response)
            .find(key => get('landing_company_shortcode') === landing_company_response[key].shortcode);
        return landing_company_response[lc_prop] || {};
    };

    const shouldCompleteTax = () => isAccountOfType('financial') && !/crs_tin_information/.test((State.getResponse('get_account_status') || {}).status);

    const getMT5AccountType = group => (group ? group.replace('\\', '_') : '');

    const hasShortCode = (data, code) => ((data || {}).shortcode === code);

    const canUpgradeGamingToFinancial = data => (hasShortCode(data.financial_company, 'maltainvest'));

    const canUpgradeVirtualToFinancial = data => (!data.gaming_company && hasShortCode(data.financial_company, 'maltainvest'));

    const canUpgradeVirtualToJapan = data => (!data.gaming_company && hasShortCode(data.financial_company, 'japan'));

    const canUpgradeVirtualToReal = data => (hasShortCode(data.financial_company, 'costarica'));

    const getUpgradeInfo = (landing_company, jp_account_status = State.getResponse('get_settings.jp_account_status.status'), account_type_ico = false) => {
        let type         = 'real';
        let can_upgrade  = false;
        let upgrade_link = 'realws';
        if (account_type_ico) {
            can_upgrade = !hasCostaricaAccount();
        } else if (get('is_virtual')) {
            if (canUpgradeVirtualToFinancial(landing_company)) {
                type         = 'financial';
                upgrade_link = 'maltainvestws';
            } else if (canUpgradeVirtualToJapan(landing_company)) {
                upgrade_link = 'japanws';
            }
            can_upgrade = !hasAccountType('real') && (!jp_account_status || !/jp_knowledge_test_(pending|fail)|jp_activation_pending|activated/.test(jp_account_status));
        } else if (canUpgradeGamingToFinancial(landing_company)) {
            type         = 'financial';
            can_upgrade  = !hasAccountType('financial');
            upgrade_link = 'maltainvestws';
        }
        return {
            type,
            can_upgrade,
            upgrade_link   : `new_account/${upgrade_link}`,
            is_current_path: new RegExp(upgrade_link, 'i').test(window.location.pathname),
        };
    };

    const getLandingCompanyValue = (loginid, landing_company, key) => {
        let landing_company_object;
        if (loginid.financial || isAccountOfType('financial', loginid)) {
            landing_company_object = getPropertyValue(landing_company, 'financial_company');
        } else if (loginid.real || isAccountOfType('real', loginid)) {
            landing_company_object = getPropertyValue(landing_company, 'gaming_company');

            // handle accounts such as japan that don't have gaming company
            if (!landing_company_object) {
                landing_company_object = getPropertyValue(landing_company, 'financial_company');
            }
        } else {
            const financial_company = (getPropertyValue(landing_company, 'financial_company') || {})[key] || [];
            const gaming_company    = (getPropertyValue(landing_company, 'gaming_company') || {})[key] || [];
            landing_company_object  = financial_company.concat(gaming_company);
            return landing_company_object;
        }
        return (landing_company_object || {})[key];
    };

    const canTransferFunds = () =>
        (Client.hasAccountType('financial', true) && Client.hasAccountType('gaming', true)) ||
        (hasCurrencyType('crypto') && hasCurrencyType('fiat'));

    const hasCostaricaAccount = () => getAllLoginids().find(loginid => /^CR/.test(loginid));

    const canOpenICO = () =>
        /malta|iom/.test(State.getResponse('landing_company.financial_company.shortcode')) ||
        /malta|iom/.test(State.getResponse('landing_company.gaming_company.shortcode'));

    const canRequestProfessional = () => {
        const residence = get('residence');
        /* Austria, Italy, Belgium, Latvia, Bulgaria,	Lithuania, Croatia, Luxembourg, Cyprus, Malta, Czech Republic,	Netherlands, Denmark, Poland, Estonia, Portugal, Finland, Romania, France, Slovakia, Germany, Slovenia, Greece, Spain, Hungary, Sweden, Ireland, United Kingdom, Australia, New Zealand, Singapore, Canada, Switzerland */
        const countries = ['at', 'it', 'be', 'lv', 'bg', 'lt', 'hr', 'lu', 'cy', 'mt', 'cf', 'nl', 'dk', 'pl', 'ee', 'pt', 'fi', 'ro', 'fr', 'sk', 'de', 'si', 'gr', 'es', 'hu', 'se', 'ie', 'gb', 'au', 'nz', 'sg', 'ca', 'ch'];
        return countries.indexOf(residence.toLowerCase()) !== -1;

    };

    return {
        init,
        validateLoginid,
        set,
        get,
        getAllLoginids,
        getAccountType,
        getAccountOfType,
        isAccountOfType,
        hasAccountType,
        hasCurrencyType,
        responseAuthorize,
        shouldAcceptTnc,
        clearAllAccounts,
        processNewAccount,
        isLoggedIn,
        sendLogoutRequest,
        cleanupCookies,
        doLogout,
        shouldCompleteTax,
        getMT5AccountType,
        getUpgradeInfo,
        canUpgradeVirtualToReal,
        getAccountTitle,
        activateByClientType,
        currentLandingCompany,
        getLandingCompanyValue,
        canTransferFunds,
        hasCostaricaAccount,
        canOpenICO,
        canRequestProfessional,
    };
})();

module.exports = Client;

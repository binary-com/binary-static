const Cookies            = require('js-cookie');
const moment             = require('moment');
const BinarySocket       = require('./socket');
const jpClient           = require('../common/country_base').jpClient;
const isCryptocurrency   = require('../common/currency').isCryptocurrency;
const RealityCheckData   = require('../pages/user/reality_check/reality_check.data');
const getElementById     = require('../../_common/common_functions').getElementById;
const LocalStore         = require('../../_common/storage').LocalStore;
const State              = require('../../_common/storage').State;
const urlFor             = require('../../_common/url').urlFor;
const applyToAllElements = require('../../_common/utility').applyToAllElements;
const getPropertyValue   = require('../../_common/utility').getPropertyValue;
const isEmptyObject      = require('../../_common/utility').isEmptyObject;

const Client = (() => {
    const storage_key = 'client.accounts';
    let client_object = {};
    let current_loginid;

    const init = () => {
        current_loginid = LocalStore.get('active_loginid');
        client_object = getAllAccountsObject();
    };

    const isLoggedIn = () => (
        !isEmptyObject(getAllAccountsObject()) &&
        get('loginid') &&
        get('token')
    );

    const isValidLoginid = () => {
        if (!isLoggedIn()) return true;
        const valid_login_ids = new RegExp('^(MX|MF|VRTC|MLT|CR|FOG|VRTJ|JP)[0-9]+$', 'i');
        return getAllLoginids().every(loginid => valid_login_ids.test(loginid));
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

    const shouldShowJP = (el, is_jp) => (
        is_jp ? (!/ja-hide/.test(el.classList) || /ja-show/.test(el.classList)) : !/ja-show/.test(el.classList)
    );

    const shouldShowICO = (el, is_ico_only) => (!/ico-only-hide/.test(el.classList) || !is_ico_only);

    const activateByClientType = (section_id) => {
        const topbar_class = getElementById('topbar').classList;
        const el_section   = section_id ? getElementById(section_id) : document.body;

        const primary_bg_color_dark = 'primary-bg-color-dark';
        const secondary_bg_color    = 'secondary-bg-color';

        if (isLoggedIn()) {
            BinarySocket.wait('authorize', 'website_status', 'get_account_status').then(() => {
                const client_logged_in = getElementById('client-logged-in');
                client_logged_in.classList.add('gr-centered');

                // we need to call jpClient after authorize response so we know client's residence
                const is_jp       = jpClient();
                const is_ico_only = !is_jp && get('is_ico_only');
                if (is_ico_only) {
                    applyToAllElements('.ico-only-hide', (el) => { el.setVisibility(0); });
                }
                if (!is_jp && (is_ico_only || Client.get('landing_company_shortcode') === 'costarica')) {
                    applyToAllElements('.ico-only-show', (el) => { el.setVisibility(1); });
                }

                applyToAllElements('.client_logged_in', (el) => {
                    if (shouldShowJP(el, is_jp) && shouldShowICO(el, is_ico_only)) {
                        el.setVisibility(1);
                    }
                });

                if (get('is_virtual')) {
                    applyToAllElements('.client_virtual', (el) => { el.setVisibility(1); }, '', el_section);
                    topbar_class.add(secondary_bg_color);
                    topbar_class.remove(primary_bg_color_dark);
                } else {
                    applyToAllElements('.client_real', (el) => {
                        if (shouldShowJP(el, is_jp) && shouldShowICO(el, is_ico_only)) {
                            el.setVisibility(1);
                        }
                    }, '', el_section);
                    topbar_class.add(primary_bg_color_dark);
                    topbar_class.remove(secondary_bg_color);
                }
            });
        } else {
            const is_jp = jpClient();
            applyToAllElements('.client_logged_out', (el) => {
                if (shouldShowJP(el, is_jp)) {
                    el.setVisibility(1);
                }
            }, '', el_section);
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
        const this_shortcode           = get('landing_company_shortcode');
        const landing_company_prop     = Object.keys(landing_company_response).find((key) => (
            this_shortcode === landing_company_response[key].shortcode
        ));
        return landing_company_response[landing_company_prop] || {};
    };

    const shouldCompleteTax = () => isAccountOfType('financial') && !/crs_tin_information/.test((State.getResponse('get_account_status') || {}).status);

    const getMT5AccountType = group => (group ? group.replace('\\', '_') : '');

    const getUpgradeInfo = () => {
        const upgradeable_landing_companies = State.getResponse('authorize.upgradeable_landing_companies');

        let can_upgrade    = !!(upgradeable_landing_companies && upgradeable_landing_companies.length);
        let can_open_multi = false;
        let type,
            upgrade_link;
        if (can_upgrade) {
            const current_landing_company = get('landing_company_shortcode');

            can_open_multi = !!(upgradeable_landing_companies.find(landing_company => (
                landing_company === current_landing_company
            )));

            // only show upgrade message to landing companies other than current
            const canUpgrade = arr_landing_company => (
                !!(arr_landing_company.find(landing_company => (
                    landing_company !== current_landing_company &&
                    upgradeable_landing_companies.indexOf(landing_company) !== -1
                )))
            );

            if (canUpgrade(['costarica', 'malta', 'iom'])) {
                type         = 'real';
                upgrade_link = 'realws';
            } else if (canUpgrade(['maltainvest'])) {
                type         = 'financial';
                upgrade_link = 'maltainvestws';
            } else if (canUpgrade(['japan'])) {
                type         = 'real';
                upgrade_link = 'japanws';
            } else {
                can_upgrade = false;
            }
        }
        return {
            type,
            can_upgrade,
            can_open_multi,
            upgrade_link   : upgrade_link ? `new_account/${upgrade_link}` : undefined,
            is_current_path: upgrade_link ? new RegExp(upgrade_link, 'i').test(window.location.pathname) : undefined,
        };
    };

    const getLandingCompanyValue = (loginid, landing_company, key, is_ico_only) => {
        if (is_ico_only) {
            return 'Binary (C.R.) S.A.';
        }
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

    const canTransferFunds = () => !!(
        (Client.hasAccountType('financial', true) && Client.hasAccountType('gaming', true)) ||
        (hasCurrencyType('crypto') && hasCurrencyType('fiat'))
    );

    const hasCostaricaAccount = () => !!(getAllLoginids().find(loginid => /^CR/.test(loginid)));

    const canOpenICO = () =>
        /malta|iom/.test(State.getResponse('landing_company.financial_company.shortcode')) ||
        /malta|iom/.test(State.getResponse('landing_company.gaming_company.shortcode'));

    const canRequestProfessional = () => {
        const residence = get('residence');
        /* Austria, Italy, Belgium, Latvia, Bulgaria,	Lithuania, Croatia, Luxembourg, Cyprus, Malta, Czech Republic,	Netherlands, Denmark, Poland, Estonia, Portugal, Finland, Romania, France, Slovakia, Germany, Slovenia, Greece, Spain, Hungary, Sweden, Ireland, United Kingdom, Australia, New Zealand, Singapore, Canada, Switzerland */
        const countries = ['at', 'it', 'be', 'lv', 'bg', 'lt', 'hr', 'lu', 'cy', 'mt', 'cf', 'nl', 'dk', 'pl', 'ee', 'pt', 'fi', 'ro', 'fr', 'sk', 'de', 'si', 'gr', 'es', 'hu', 'se', 'ie', 'gb', 'au', 'nz', 'sg', 'ca', 'ch'];
        return countries.indexOf(residence.toLowerCase()) !== -1;

    };

    const defaultRedirectUrl = () => {
        let redirect_url = 'trading';
        if (jpClient()) {
            redirect_url = 'multi_barriers_trading';
        } else if (get('is_ico_only')) {
            redirect_url = 'user/ico-subscribe';
        }
        return urlFor(redirect_url);
    };

    return {
        init,
        isValidLoginid,
        set,
        get,
        getAllLoginids,
        getAccountType,
        isAccountOfType,
        getAccountOfType,
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
        getAccountTitle,
        activateByClientType,
        currentLandingCompany,
        getLandingCompanyValue,
        canTransferFunds,
        hasCostaricaAccount,
        canOpenICO,
        canRequestProfessional,
        defaultRedirectUrl,
    };
})();

module.exports = Client;

const moment           = require('moment');
const isCryptocurrency = require('./currency_base').isCryptocurrency;
const SocketCache      = require('./socket_cache');
const localize         = require('../localize').localize;
const LocalStore       = require('../storage').LocalStore;
const State            = require('../storage').State;
const getPropertyValue = require('../utility').getPropertyValue;
const isEmptyObject    = require('../utility').isEmptyObject;

const ClientBase = (() => {
    const storage_key = 'client.accounts';
    let client_object = {};
    let current_loginid;

    const init = () => {
        current_loginid = LocalStore.get('active_loginid');
        client_object   = getAllAccountsObject();
    };

    const isLoggedIn = () => (
        !isEmptyObject(getAllAccountsObject()) &&
        get('loginid') &&
        get('token')
    );

    const isValidLoginid = () => {
        if (!isLoggedIn()) return true;
        const valid_login_ids = new RegExp('^(MX|MF|VRTC|MLT|CR|FOG)[0-9]+$', 'i');
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
            const current_client = client_object[loginid] || getAllAccountsObject()[loginid] || client_object;

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
        if (/^VR/.test(loginid))          account_type = 'virtual';
        else if (/^MF/.test(loginid))     account_type = 'financial';
        else if (/^MLT|MX/.test(loginid)) account_type = 'gaming';
        return account_type;
    };

    const isAccountOfType = (type, loginid = current_loginid, only_enabled = false) => {
        const this_type   = getAccountType(loginid);
        return ((
            (type === 'virtual' && this_type === 'virtual') ||
            (type === 'real'    && this_type !== 'virtual') ||
            type === this_type) &&
            (only_enabled ? !get('is_disabled', loginid) : true));
    };

    const getAccountOfType = (type, only_enabled) => {
        const id = getAllLoginids().find(loginid => isAccountOfType(type, loginid, only_enabled));
        return id ? Object.assign({ loginid: id }, get(null, id)) : {};
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

    const hasOnlyCurrencyType = (type = 'fiat') => {
        const loginids = getAllLoginids();
        const real_loginid = new RegExp('^(MX|MF|MLT|CR|FOG)[0-9]+$', 'i');
        const only_real_loginids = loginids.filter((loginid) => real_loginid.test(loginid));
        if (type === 'crypto') {
            return only_real_loginids.every(loginid => isCryptocurrency(get('currency', loginid)));
        }
        if (type === 'unset') {
            return only_real_loginids.every(loginid => !get('currency', loginid));
        }

        return only_real_loginids.every(loginid => get('currency', loginid) && !isCryptocurrency(get('currency', loginid)));
    };

    const TypesMapConfig = (() => {
        let types_map_config;

        const initTypesMap = () => ({
            default  : localize('Real'),
            financial: localize('Investment'),
            gaming   : localize('Gaming'),
            virtual  : localize('Virtual'),
        });

        return {
            get: () => {
                if (!types_map_config) {
                    types_map_config = initTypesMap();
                }
                return types_map_config;
            },
        };
    })();

    const getAccountTitle = loginid => {
        const types_map = TypesMapConfig.get();
        return (types_map[getAccountType(loginid)] || types_map.default);
    };

    const responseAuthorize = (response) => {
        const authorize = response.authorize;
        const local_currency_config = {};
        const local_currencies = Object.keys(authorize.local_currencies);
        if (local_currencies.length) {
            local_currency_config.currency = local_currencies[0];
            local_currency_config.decimal_places =
                +authorize.local_currencies[local_currency_config.currency].fractional_digits;
        }
        set('email',      authorize.email);
        set('currency',   authorize.currency);
        set('is_virtual', +authorize.is_virtual);
        set('session_start', parseInt(moment().valueOf() / 1000));
        set('landing_company_shortcode', authorize.landing_company_name);
        set('user_id', authorize.user_id);
        set('local_currency_config', local_currency_config);
        updateAccountList(authorize.account_list);
    };

    const updateAccountList = (account_list) => {
        account_list.forEach((account) => {
            set('excluded_until', account.excluded_until || '', account.loginid);
            Object.keys(account).forEach((param) => {
                const param_to_set = param === 'country' ? 'residence' : param;
                const value_to_set = typeof account[param] === 'undefined' ? '' : account[param];
                if (param_to_set !== 'loginid') {
                    set(param_to_set, value_to_set, account.loginid);
                }
            });
        });
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
    };

    const setNewAccount = (options) => {
        if (!options.email || !options.loginid || !options.token) {
            return false;
        }

        SocketCache.clear();
        localStorage.setItem('GTM_new_account', '1');

        set('token',      options.token,       options.loginid);
        set('email',      options.email,       options.loginid);
        set('is_virtual', +options.is_virtual, options.loginid);
        set('loginid',    options.loginid);

        return true;
    };

    const currentLandingCompany = () => {
        const landing_company_response = State.getResponse('landing_company') || {};
        const this_shortcode           = get('landing_company_shortcode');
        const landing_company_prop     = Object.keys(landing_company_response).find((key) => (
            this_shortcode === landing_company_response[key].shortcode
        ));
        return landing_company_response[landing_company_prop] || {};
    };

    const shouldCompleteTax = () => isAccountOfType('financial') &&
        !/crs_tin_information/.test((State.getResponse('get_account_status') || {}).status);

    const isAuthenticationAllowed = () => {
        const { status, authentication } = State.getResponse('get_account_status');
        const has_allow_document_upload = /allow_document_upload/.test(status);
        const has_verification_flags = authentication.needs_verification.length;
        return has_allow_document_upload || has_verification_flags;
    };

    // * MT5 login list returns these:
    // market_type: "financial" | "gaming"
    // sub_account_type: "financial" | "financial_stp" | "swap_free"
    // *
    const getMT5AccountDisplays = (market_type, sub_account_type, is_demo) => {
        // needs to be declared inside because of localize
        // TODO: handle swap_free when ready

        const account_market_type = (market_type === 'synthetic' || market_type === 'gaming') ? 'gaming' : market_type;
        const obj_display = {
            gaming: {
                financial: {
                    short: localize('Synthetic'),
                    full : is_demo ? localize('Demo Synthetic') : localize('Real Synthetic'),
                },
            },
            financial: {
                financial: {
                    short: localize('Financial'),
                    full : is_demo ? localize('Demo Financial') : localize('Real Financial'),
                },
                financial_stp: {
                    short: localize('Financial STP'),
                    full : is_demo ? localize('Demo Financial STP') : localize('Real Financial STP'),
                },
            },
        };

        // returns e.g. { short: 'Synthetic', full: 'Demo Synthetic' }
        return obj_display[account_market_type][sub_account_type] || localize('MT5');
    };

    const getBasicUpgradeInfo = () => {
        const upgradeable_landing_companies = State.getResponse('authorize.upgradeable_landing_companies');
        const landing_company_obj = State.getResponse('landing_company');

        let can_open_multi = false;
        let can_upgrade_to = [];
        let type;
        if ((upgradeable_landing_companies || []).length) {
            const current_landing_company = get('landing_company_shortcode');
            let allowed_currencies = [];
            if (current_loginid) {
                allowed_currencies = getLandingCompanyValue(current_loginid, landing_company_obj, 'legal_allowed_currencies');
            }
            // create multiple accounts only available for landing companies with legal_allowed_currencies
            can_open_multi = !!(upgradeable_landing_companies.indexOf(current_landing_company) !== -1 &&
            (allowed_currencies && allowed_currencies.length));

            // only show upgrade message to landing companies other than current
            const canUpgrade = (...landing_companies) => {
                const result = landing_companies.filter(landing_company => (
                    landing_company !== current_landing_company &&
                    upgradeable_landing_companies.indexOf(landing_company) !== -1
                ));

                return result.length ? result : [];
            };

            can_upgrade_to = canUpgrade('iom', 'svg', 'malta', 'maltainvest');
            if (can_upgrade_to.length) {
                type = can_upgrade_to.map(
                    landing_company_shortcode => landing_company_shortcode === 'maltainvest' ? 'financial' : 'real',
                );
            }
        }

        return {
            type,
            can_upgrade: !!can_upgrade_to.length,
            can_upgrade_to,
            can_open_multi,
        };
    };

    const getLandingCompanyValue = (loginid, landing_company, key) => {
        let landing_company_object;
        if (loginid.financial || isAccountOfType('financial', loginid)) {
            landing_company_object = getPropertyValue(landing_company, 'financial_company');
        } else if (loginid.real || isAccountOfType('real', loginid)) {
            landing_company_object = getPropertyValue(landing_company, 'gaming_company');

            // handle accounts that don't have gaming company
            if (!landing_company_object) {
                landing_company_object = getPropertyValue(landing_company, 'financial_company');
            }
        } else {
            const financial_company = (getPropertyValue(landing_company, 'financial_company') || {})[key] || [];
            const gaming_company    = (getPropertyValue(landing_company, 'gaming_company') || {})[key] || [];

            landing_company_object = Array.isArray(financial_company) ?
                financial_company.concat(gaming_company)
                :
                $.extend({}, financial_company, gaming_company);

            return landing_company_object;
        }
        return (landing_company_object || {})[key];
    };

    const getRiskAssessment = () => {
        const status = State.getResponse('get_account_status.status');

        return (
            isAccountOfType('financial') ?
                /(financial_assessment|trading_experience)_not_complete/.test(status) :
                /financial_assessment_not_complete/.test(status)
        );
    };

    // API_V3: send a list of accounts the client can transfer to
    const canTransferFunds = (account) => {
        if (account) {
            // this specific account can be used to transfer funds to
            return canTransferFundsTo(account.loginid);
        }
        // at least one account can be used to transfer funds to
        return Object.keys(client_object).some(loginid => canTransferFundsTo(loginid));
    };

    const canTransferFundsTo = (to_loginid) => {
        if (to_loginid === current_loginid || get('is_virtual', to_loginid) || get('is_virtual') ||
            get('is_disabled', to_loginid)) {
            return false;
        }
        const from_currency = get('currency');
        const to_currency   = get('currency', to_loginid);
        if (!from_currency || !to_currency) {
            return false;
        }
        // only transfer to other accounts that have the same currency as current account if one is maltainvest and one is malta
        if (from_currency === to_currency) {
            // these landing companies are allowed to transfer funds to each other if they have the same currency
            const same_cur_allowed = {
                maltainvest: 'malta',
                malta      : 'maltainvest',
            };
            const from_landing_company = get('landing_company_shortcode');
            const to_landing_company   = get('landing_company_shortcode', to_loginid);
            // if same_cur_allowed[from_landing_company] is undefined and to_landing_company is also undefined, it will return true
            // so we should compare '' === undefined instead
            return (same_cur_allowed[from_landing_company] || '') === to_landing_company;
        }
        // or for other clients if current account is cryptocurrency it should only transfer to fiat currencies and vice versa
        const is_from_crypto = isCryptocurrency(from_currency);
        const is_to_crypto   = isCryptocurrency(to_currency);
        return (is_from_crypto ? !is_to_crypto : is_to_crypto);
    };

    const hasSvgAccount = () => !!(getAllLoginids().find(loginid => /^CR/.test(loginid)));

    const canChangeCurrency = (statement, mt5_login_list, is_current = true) => {
        const currency             = get('currency');
        const has_no_mt5           = !mt5_login_list || !mt5_login_list.length;
        const has_no_transaction   = (statement.count === 0 && statement.transactions.length === 0);
        const has_account_criteria = has_no_transaction && has_no_mt5;

        // Current API requirements for currently logged-in user successfully changing their account's currency:
        // 1. User must not have made any transactions
        // 2. User must not have any MT5 account
        // 3. Not be a crypto account
        // 4. Not be a virtual account
        return is_current ? currency && !get('is_virtual') && has_account_criteria && !isCryptocurrency(currency) : has_account_criteria;
    };

    const isOptionsBlocked = () => {
        const options_blocked_countries = ['au'];
        const country = State.getResponse('authorize.country');

        return options_blocked_countries.includes(country);
    };

    return {
        init,
        isLoggedIn,
        isValidLoginid,
        set,
        get,
        getAllLoginids,
        getAccountType,
        isAccountOfType,
        isAuthenticationAllowed,
        isOptionsBlocked,
        getAccountOfType,
        hasAccountType,
        hasCurrencyType,
        hasOnlyCurrencyType,
        getAccountTitle,
        responseAuthorize,
        shouldAcceptTnc,
        clearAllAccounts,
        setNewAccount,
        currentLandingCompany,
        shouldCompleteTax,
        getAllAccountsObject,
        getMT5AccountDisplays,
        getBasicUpgradeInfo,
        getLandingCompanyValue,
        getRiskAssessment,
        canTransferFunds,
        hasSvgAccount,
        canChangeCurrency,
    };
})();

module.exports = ClientBase;

import { observable, computed, action }    from 'mobx';
import moment                              from 'moment';
import { LocalStore, State }               from '_common/storage';
import { getPropertyValue, isEmptyObject } from '_common/utility';
import SocketCache                         from '_common/base/socket_cache';
import { isCryptocurrency }                from '_common/base/currency_base';
import BaseStore                           from './base_store';
import Client                              from '../../_common/base/client_base';
import GTM                                 from '../../_common/base/gtm';
import BinarySocket                        from '../../_common/base/socket_base';

export default class ClientStore extends BaseStore {
    @observable balance;
    @observable loginid;
    @observable currency;
    @observable upgrade_info;
    @observable is_virtual;
    @observable can_upgrade;
    @observable current_loginid;
    @observable client_object;
    @observable storage_key = 'client.accounts';
    @observable types_map = {
        virtual  : 'Virtual',
        gaming   : 'Gaming',
        financial: 'Investment',
    };

    constructor(root_store) {
        super();
        this.init();
        this.root = root_store;
    }

    @computed
    get is_client_allowed_to_visit() {
        return !!(!this.is_logged_in || this.is_virtual);
    }

    @action.bound
    init() {
        this.current_loginid = LocalStore.get('active_loginid');
        this.client_object   = this.getAllAccountsObject();
        this.balance         = this.get('balance') ? this.get('balance').toString() : '';
        this.loginid         = this.get('loginid');
        this.currency        = this.get('currency') || '';
        this.upgrade_info    = this.getBasicUpgradeInfo();
        this.is_virtual      = this.get('is_virtual');
        this.can_upgrade     = this.upgrade_info.can_upgrade || this.upgrade_info.can_open_multi;
    }

    @computed
    get is_logged_in() {
        return !!(!isEmptyObject(this.getAllAccountsObject()) &&
            this.get('loginid') &&
            this.get('token'));
    }

    @computed
    get is_valid_loginid() {
        if (!this.is_logged_in) return true;
        const valid_login_ids = new RegExp('^(MX|MF|VRTC|MLT|CR|FOG)[0-9]+$', 'i');
        return this.getAllLoginids().every(loginid => valid_login_ids.test(loginid));
    }

    /**
     * Stores the client information in local variable and localStorage
     *
     * @param {String} key                 The property name to set
     * @param {String|Number|Object} value The regarding value
     * @param {String|null} loginid        The account to set the value for
     */
    @action.bound
    set(key, value, loginid = this.current_loginid) {
        if (key === 'loginid' && value !== this.current_loginid) {
            LocalStore.set('active_loginid', value);
            this.current_loginid = value;
        } else {
            if (!(loginid in this.client_object)) {
                this.client_object[loginid] = {};
            }
            this.client_object[loginid][key] = value;
            LocalStore.setObject(this.storage_key, this.client_object);
        }
    }

    /**
     * Returns the client information
     *
     * @param {String|null} key     The property name to return the value from, if missing returns the account object
     * @param {String|null} loginid The account to return the value from
     */
    get(key, loginid = this.current_loginid) {
        let value;
        if (key === 'loginid') {
            value = loginid || LocalStore.get('active_loginid');
        } else {
            const current_client = this.client_object[loginid] || this.getAllAccountsObject()[loginid] ||
                this.client_object;

            value = key ? current_client[key] : current_client;
        }
        if (!Array.isArray(value) && (+value === 1 || +value === 0 || value === 'true' || value === 'false')) {
            value = JSON.parse(value || false);
        }
        return value;
    }

    getAllAccountsObject() {
        return LocalStore.getObject(this.storage_key);
    }

    getAllLoginids() {
        return Object.keys(this.getAllAccountsObject());
    }

    getAccount(loginid = this.current_loginid) {
        return this.getAllAccountsObject()[loginid];
    }

    getAccountType(loginid = this.current_loginid) {
        let account_type;
        if (/^VR/.test(loginid)) account_type = 'virtual';
        else if (/^MF/.test(loginid)) account_type = 'financial';
        else if (/^MLT|MX/.test(loginid)) account_type = 'gaming';
        return account_type;
    }

    isAccountOfType(type, loginid = this.current_loginid, only_enabled = false) {
        const this_type = this.getAccountType(loginid);
        return ((
            (type === 'virtual' && this_type === 'virtual') ||
            (type === 'real' && this_type !== 'virtual') ||
            type === this_type) &&
            (only_enabled ? !this.get('is_disabled', loginid) : true));
    }

    getAccountOfType(type, only_enabled) {
        const id = this.getAllLoginids().find(loginid => this.isAccountOfType(type, loginid, only_enabled));
        return id ? Object.assign({ loginid: id }, this.get(null, id)) : {};
    }

    hasAccountType(type, only_enabled) {
        return !isEmptyObject(this.getAccountOfType(type, only_enabled));
    }

    // only considers currency of real money accounts
    // @param {String} type = crypto|fiat
    hasCurrencyType = (type) => {
        const loginids = this.getAllLoginids();
        if (type === 'crypto') {
            // find if has crypto currency account
            return loginids.find(loginid =>
                !this.get('is_virtual', loginid) && isCryptocurrency(this.get('currency', loginid)));
        }
        // else find if have fiat currency account
        return loginids.find(loginid =>
            !this.get('is_virtual', loginid) && !isCryptocurrency(this.get('currency', loginid)));
    };

    getAccountTitle(loginid) {
        return this.types_map[this.getAccountType(loginid)] || 'Real';
    }

    @action.bound
    responseAuthorize(response) {
        const authorize = response.authorize;
        this.set('email', authorize.email);
        this.set('currency', authorize.currency);
        this.set('is_virtual', +authorize.is_virtual);
        this.set('session_start', parseInt(moment().valueOf() / 1000));
        this.set('landing_company_shortcode', authorize.landing_company_name);
        this.updateAccountList(authorize.account_list);
    }

    @action.bound
    updateAccountList(account_list) {
        account_list.forEach((account) => {
            this.set('excluded_until', account.excluded_until || '', account.loginid);
            Object.keys(account).forEach((param) => {
                const param_to_set = param === 'country' ? 'residence' : param;
                const value_to_set = typeof account[param] === 'undefined' ? '' : account[param];
                if (param_to_set !== 'loginid') {
                    this.set(param_to_set, value_to_set, account.loginid);
                }
            });
        });
    }

    @computed
    get should_accept_tnc() {
        if (this.get('is_virtual')) return false;
        const website_tnc_version = State.getResponse('website_status.terms_conditions_version');
        const client_tnc_status   = State.getResponse('get_settings.client_tnc_status');
        return typeof client_tnc_status !== 'undefined' && client_tnc_status !== website_tnc_version;
    }

    @action.bound
    clearAllAccounts() {
        this.current_loginid = undefined;
        this.client_object   = {};
        LocalStore.setObject(this.storage_key, this.client_object);
    }

    @action.bound
    setNewAccount(options) {
        if (!options.email || !options.loginid || !options.token) {
            return false;
        }

        SocketCache.clear();
        localStorage.setItem('GTM_new_account', '1');

        this.set('token', options.token, options.loginid);
        this.set('email', options.email, options.loginid);
        this.set('is_virtual', +options.is_virtual, options.loginid);
        this.set('loginid', options.loginid);

        return true;
    }

    const;

    currentLandingCompany() {
        const landing_company_response = State.getResponse('landing_company') || {};
        const this_shortcode           = this.get('landing_company_shortcode');
        const landing_company_prop     = Object.keys(landing_company_response).find((key) => (
            this_shortcode === landing_company_response[key].shortcode
        ));
        return landing_company_response[landing_company_prop] || {};
    }

    @computed
    get should_complete_tax() {
        return this.isAccountOfType('financial') &&
            !/crs_tin_information/.test((State.getResponse('get_account_status') || {}).status);
    }

    // remove manager id or master distinction from group
    // remove EUR or GBP distinction from group

    getMT5AccountType = group => (group ? group.replace('\\', '_').replace(/_(\d+|master|EUR|GBP)/, '') : '');

    getBasicUpgradeInfo() {
        const upgradeable_landing_companies = State.getResponse('authorize.upgradeable_landing_companies');

        let can_open_multi = false;
        let type,
            can_upgrade_to;

        if ((upgradeable_landing_companies || []).length) {
            const current_landing_company = this.get('landing_company_shortcode');

            can_open_multi = upgradeable_landing_companies.indexOf(current_landing_company) !== -1;

            // only show upgrade message to landing companies other than current
            const canUpgrade = (...landing_companies) => landing_companies.find(landing_company => (
                landing_company !== current_landing_company &&
                upgradeable_landing_companies.indexOf(landing_company) !== -1
            ));

            can_upgrade_to = canUpgrade('costarica', 'iom', 'malta', 'maltainvest', 'japan');
            if (can_upgrade_to) {
                type = can_upgrade_to === 'maltainvest' ? 'financial' : 'real';
            }
        }

        return {
            type,
            can_upgrade: !!can_upgrade_to,
            can_upgrade_to,
            can_open_multi,
        };
    }

    getLandingCompanyValue(loginid, landing_company, key) {
        let landing_company_object;
        if (loginid.financial || this.isAccountOfType('financial', loginid)) {
            landing_company_object = getPropertyValue(landing_company, 'financial_company');
        } else if (loginid.real || this.isAccountOfType('real', loginid)) {
            landing_company_object = getPropertyValue(landing_company, 'gaming_company');

            // handle accounts that don't have gaming company
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
    }

    @computed
    get risk_assessment() {
        const status       = State.getResponse('get_account_status.status');
        const is_high_risk = /high/.test(State.getResponse('get_account_status.risk_classification'));

        return (
            this.isAccountOfType('financial') ?
                /(financial_assessment|trading_experience)_not_complete/.test(status) :
                (is_high_risk && /financial_assessment_not_complete/.test(status))
        );
    }

    // API_V3: send a list of accounts the client can transfer to
    canTransferFunds(account) {
        if (account) {
            // this specific account can be used to transfer funds to
            return this.canTransferFundsTo(account.loginid);
        }
        // at least one account can be used to transfer funds to
        return Object.keys(this.client_object).some(loginid => this.canTransferFundsTo(loginid));
    }

    canTransferFundsTo(to_loginid) {
        if (to_loginid === this.current_loginid || this.get('is_virtual', to_loginid) || this.get('is_virtual') ||
            this.get('is_disabled', to_loginid)) {
            return false;
        }
        const from_currency = this.get('currency');
        const to_currency   = this.get('currency', to_loginid);
        if (!from_currency || !to_currency) {
            return false;
        }
        // only transfer to other accounts that have the same currency as current account if one is maltainvest and one is malta
        if (from_currency === to_currency) {
            // these landing companies are allowed to transfer funds to each other if they have the same currency
            const same_cur_allowed     = {
                maltainvest: 'malta',
                malta      : 'maltainvest',
            };
            const from_landing_company = this.get('landing_company_shortcode');
            const to_landing_company   = this.get('landing_company_shortcode', to_loginid);
            // if same_cur_allowed[from_landing_company] is undefined and to_landing_company is also undefined, it will return true
            // so we should compare '' === undefined instead
            return (same_cur_allowed[from_landing_company] || '') === to_landing_company;
        }
        // or for other clients if current account is cryptocurrency it should only transfer to fiat currencies and vice versa
        const is_from_crypto = isCryptocurrency(from_currency);
        const is_to_crypto   = isCryptocurrency(to_currency);
        return (is_from_crypto ? !is_to_crypto : is_to_crypto);
    }

    @computed
    get has_costarica_account() {
        return !!(this.getAllLoginids().find(loginid => /^CR/.test(loginid)));
    }

    @action.bound
    async switchAccount(loginid, client, modules) {
        if (!loginid || !Client.get('token', loginid)) {
            return;
        }
        sessionStorage.setItem('active_tab', '1');
        // set local storage
        GTM.setLoginFlag();
        this.set('cashier_confirmed', 0);
        this.set('accepted_bch', 0);
        this.set('loginid', loginid);
        SocketCache.clear();
        await BinarySocket.send({ 'authorize': Client.getAccount(loginid).token }, { forced: true });
        await this.init();
        await modules.trade.refresh();
        await modules.trade.prepareTradeStore();
    }

}

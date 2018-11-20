import { observable, computed, action, reaction } from 'mobx';
import moment                                     from 'moment';
import GTM                                        from '_common/base/gtm';
import * as SocketCache                           from '_common/base/socket_cache';
import BinarySocket                               from '_common/base/socket_base';
import eventBus                                   from 'Services/event_bus';
import { LocalStore, State }                      from '_common/storage';
import BaseStore                                  from './base_store';
import { localize }                               from '../../_common/localize';

const types_map = {
    virtual  : 'Virtual',
    gaming   : 'Gaming',
    financial: 'Investment',
};

export default class ClientStore extends BaseStore {
    @observable loginid;
    @observable upgrade_info;
    @observable accounts;
    storage_key = 'client.accounts';
    @observable switched    = '';

    /**
     * Borrowed from `Client_base::getBasicUpgradeInfo()`
     * @returns {{type: *, can_upgrade: boolean, can_upgrade_to: *, can_open_multi: boolean}}
     */
    getBasicUpgradeInfo = () => {
        const upgradeable_landing_companies = State.getResponse('authorize.upgradeable_landing_companies');

        let can_open_multi = false;
        let type,
            can_upgrade_to;

        if ((upgradeable_landing_companies || []).length) {
            can_open_multi   = upgradeable_landing_companies.indexOf(
                this.accounts[this.loginid].landing_company_shortcode) !==
                -1;
            // only show upgrade message to landing companies other than current
            const canUpgrade = (...landing_companies) => landing_companies.find(landing_company => (
                landing_company !== this.accounts[this.loginid].landing_company_shortcode &&
                upgradeable_landing_companies.indexOf(landing_company) !== -1
            ));

            can_upgrade_to = canUpgrade('costarica', 'iom', 'malta', 'maltainvest');
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
    };

    constructor() {
        super();
        this.init();
    }

    @computed
    get balance() {
        if (!this.accounts) return '';
        return (this.accounts[this.loginid] && this.accounts[this.loginid].balance) ?
            this.accounts[this.loginid].balance.toString() :
            '';
    }

    /**
     * Temporary property. should be removed once we are fully migrated from the old app.
     *
     * @returns {boolean}
     */
    @computed
    get is_client_allowed_to_visit() {
        return !!(
            !this.is_logged_in || this.is_virtual ||
            this.accounts[this.loginid].landing_company_shortcode === 'costarica'
        );
    }

    @computed
    get active_accounts() {
        return Object.values(this.accounts).filter(account => !account.is_disabled);
    }

    @computed
    get all_loginids() {
        return Object.keys(this.accounts);
    }

    @computed
    get account_type() {
        return this.getAccountType();
    }

    @computed
    get currency() {
        return this.accounts[this.loginid] ?
            this.accounts[this.loginid].currency : '';
    }

    @computed
    get is_valid_login() {
        if (!this.is_logged_in) return true;
        const valid_login_ids = new RegExp('^(MX|MF|VRTC|MLT|CR|FOG)[0-9]+$', 'i');
        return this.all_loginids.every(id => valid_login_ids.test(id));
    }

    @computed
    get is_logged_in() {
        return !!(
            this.accounts instanceof Object &&
            Object.keys(this.accounts).length > 0 &&
            this.loginid &&
            this.accounts[this.loginid].token
        );
    }

    @computed
    get is_virtual() {
        return !!this.accounts[this.loginid].is_virtual;
    }

    @computed
    get can_upgrade() {
        return this.upgrade_info.can_upgrade || this.upgrade_info.can_open_multi;
    }

    @computed
    get virtual_account_loginid() {
        return this.all_loginids
            .filter(loginid => !!this.accounts[loginid].is_virtual)
            .reduce(loginid => loginid);
    }

    /**
     * Store Values relevant to the loginid to local storage.
     *
     * @param loginid
     */
    @action.bound
    resetLocalStorageValues(loginid) {
        this.accounts[loginid].cashier_confirmed = 0;
        this.accounts[loginid].accepted_bch      = 0;
        LocalStore.setObject(this.storage_key, this.accounts);
        LocalStore.set('active_loginid', loginid);
    }

    @action.bound
    responseAuthorize(response) {
        const authorize                                       = response.authorize;
        this.accounts[this.loginid].email                     = authorize.email;
        this.accounts[this.loginid].currency                  = authorize.currency;
        this.accounts[this.loginid].is_virtual                = +authorize.is_virtual;
        this.accounts[this.loginid].session_start             = parseInt(moment().valueOf() / 1000);
        this.accounts[this.loginid].landing_company_shortcode = authorize.landing_company_name;
        this.updateAccountList(authorize.account_list);
    }

    @action.bound
    updateAccountList (account_list) {
        account_list.forEach((account) => {
            this.accounts[account.loginid].excluded_until = account.excluded_until || '';
            Object.keys(account).forEach((param) => {
                const param_to_set = param === 'country' ? 'residence' : param;
                const value_to_set = typeof account[param] === 'undefined' ? '' : account[param];
                if (param_to_set !== 'loginid') {
                    this.accounts[account.loginid][param_to_set] = value_to_set;
                }
            });
        });
    }

    /**
     * Switch to the given loginid account.
     *
     * @param {string} loginid
     */
    @action.bound
    async switchAccount(loginid) {
        this.switched = loginid;
    }

    /**
     * We initially fetch things from local storage, and then do everything inside the store.
     * This will probably be the only place we are fetching data from Client_base.
     */
    @action.bound
    init() {
        this.loginid      = LocalStore.get('active_loginid');
        this.accounts     = LocalStore.getObject(this.storage_key);
        this.upgrade_info = this.getBasicUpgradeInfo();
        this.switched     = '';

        this.registerReactions();
    }

    /**
     * Check if account is disabled or not
     *
     * @param loginid
     * @returns {string}
     */
    isDisabled(loginid = this.loginid) {
        return this.getAccount(loginid).is_disabled;
    }

    /**
     * Get accounts token from given login id.
     *
     * @param loginid
     * @returns {string}
     */
    getToken(loginid = this.loginid) {
        return this.getAccount(loginid).token;
    }

    /**
     * Get account object from given login id
     *
     * @param loginid
     * @returns {object}
     */
    getAccount(loginid = this.loginid) {
        return this.accounts[loginid];
    }

    /**
     * Borrowed from `Client_base::getAccountTitle()`
     *
     * @param {string} loginid || current login id
     * @returns {string}
     */
    getAccountTitle(loginid = this.loginid) {
        return types_map[this.getAccountType(loginid)] || 'Real';
    }

    /**
     * Borrowed from `Client_base::getAccountType()`
     *
     * @param {string} loginid || current login id
     * @returns {string}
     */
    getAccountType(loginid = this.loginid) {
        let account_type = '';
        if (/^VR/.test(loginid)) account_type = 'virtual';
        else if (/^MF/.test(loginid)) account_type = 'financial';
        else if (/^MLT|MX/.test(loginid)) account_type = 'gaming';
        return account_type;
    }

    /**
     * Borrowed from `Client_base::getAccountOfType()`
     * @param type
     * @param only_enabled
     * @returns {*}
     */
    getAccountOfType(type, only_enabled = true) {
        return this.getAccount(
            this.all_loginids.find(loginid => this.isAccountOfType(type, loginid, only_enabled)),
        );
    }

    /**
     * Get information required by account switcher
     *
     * @param loginid
     * @returns {{loginid: *, is_virtual: (number|number|*), icon: string, title: *}}
     */
    getAccountInfo(loginid = this.loginid) {
        const account      = this.getAccount(loginid);
        const currency     = account.currency;
        const is_virtual   = account.is_virtual;
        const account_type = !is_virtual && currency ? currency : this.getAccountTitle(loginid);

        return {
            loginid,
            is_virtual,
            icon : account_type.toLowerCase(), // TODO: display the icon
            title: account_type.toLowerCase() === 'virtual' ? localize('DEMO') : account_type,
        };
    }

    /**
     * Borrowed from `Client_base::isAccountOfType()`
     *
     * @param type
     * @param loginid
     * @param only_enabled
     * @returns {boolean}
     */
    isAccountOfType(type, loginid = this.loginid, only_enabled = false) {
        const this_type = this.getAccountType(loginid);
        return ((
            (type === 'virtual' && this_type === 'virtual') ||
            (type === 'real' && this_type !== 'virtual') ||
            type === this_type) &&
            (only_enabled ? !this.isDisabled(loginid) : true));
    }

    @action.bound
    registerReactions() {
        // Switch account reactions.
        reaction(
            () => this.switched,
            async (switched, reactionHandler) => {
                if (!switched || !switched.length || !this.getAccount(switched).token) return;
                sessionStorage.setItem('active_tab', '1');
                // set local storage
                GTM.setLoginFlag();
                this.resetLocalStorageValues(switched);
                SocketCache.clear();
                await BinarySocket.send({ 'authorize': this.getToken() }, { forced: true });
                await this.init();
                eventBus.dispatch('ClientAccountHasSwitched', { loginid: switched });
                reactionHandler.dispose();
            },
            {
                name: 'accountSwitchedReaction',
            },
        );
    }
}

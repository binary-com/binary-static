import { observable, computed, action } from 'mobx';
import Client                           from '_common/base/client_base';
import GTM                              from '_common/base/gtm';
import * as SocketCache                 from '_common/base/socket_cache';
import BinarySocket                     from '_common/base/socket_base';
import eventBus                         from 'Services/event_bus';
import BaseStore                        from './base_store';
import { localize }                     from '../../_common/localize';
import { isEmptyObject }                from '../../_common/utility';

const types_map = {
    virtual  : 'Virtual',
    gaming   : 'Gaming',
    financial: 'Investment',
};

export default class ClientStore extends BaseStore {
    @observable loginid;
    @observable upgrade_info;
    @observable accounts;
    @observable balance;

    constructor() {
        super();
        this.init();
    }

    /**
     * Temporary property. should be removed once we are fully migrated from the old app.
     *
     * @returns {boolean}
     */
    @computed
    get is_client_allowed_to_visit() {
        return !!(
            !this.is_logged_in ||
            this.is_virtual ||
            this.current_account.landing_company_shortcode === 'costarica'
        );
    }

    @computed
    get active_accounts() {
        return Object.values(this.accounts).filter(account => !account.is_disabled);
    }

    @computed
    get valid_accounts() {
        return this.active_accounts.filter(account => account.token);
    }

    @computed
    get current_account() {
        return this.accounts[this.loginid];
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
        return this.current_account ?
            this.current_account.currency : '';
    }

    @computed
    get is_valid_login() {
        if (!this.is_logged_in) return true;
        const valid_login_ids = new RegExp('^(MX|MF|VRTC|MLT|CR|FOG)[0-9]+$', 'i');
        return this.all_loginids.every(id => valid_login_ids.test(id));
    }

    @computed
    get is_logged_in() {
        return !!(!isEmptyObject(this.accounts) &&
            this.loginid &&
            this.current_account.token);
    }

    @computed
    get is_virtual() {
        return !!this.current_account.is_virtual;
    }

    @computed
    get can_upgrade() {
        return this.upgrade_info.can_upgrade || this.upgrade_info.can_open_multi;
    }

    /**
     * Store Values relevant to the loginid to local storage.
     *
     * @param loginid
     */
    static resetLocalStorageValues(loginid) {
        Client.set('cashier_confirmed', 0);
        Client.set('accepted_bch', 0);
        Client.set('loginid', loginid);
    }

    /**
     * Switch to the given loginid account.
     *
     * @param {string} loginid
     */
    @action.bound
    async switchAccount(loginid) {
        if (!loginid || !this.getAccount(loginid).token) {
            return;
        }
        sessionStorage.setItem('active_tab', '1');
        // set local storage
        GTM.setLoginFlag();
        ClientStore.resetLocalStorageValues(loginid);
        this.loginid = loginid;
        SocketCache.clear();
        await BinarySocket.send({ 'authorize': this.getAccount(loginid).token }, { forced: true });
        await this.init();
        eventBus.dispatch('ClientAccountHasSwitched', {
            loginid,
        });
    }

    /**
     * We initially fetch things from local storage, and then do everything inside the store.
     * This will probably be the only place we are fetching data from Client_base.
     */
    @action.bound
    init() {
        this.loginid      = Client.get('loginid');
        this.upgrade_info = Client.getBasicUpgradeInfo();
        this.accounts     = Client.getAllAccountsObject();
        this.balance      = this.current_account && this.current_account.balance
            ? this.current_account.balance.toString()
            : '';
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
     * Burrowed from `Client_base::getAccountTitle()`
     *
     * @param {string} loginid || current login id
     * @returns {string}
     */
    getAccountTitle(loginid = this.loginid) {
        return types_map[this.getAccountType(loginid)] || 'Real';
    }

    /**
     * Burrowed from `Client_base::getAccountType()`
     *
     * @param {string} loginid || current login id
     * @returns {string}
     */
    getAccountType(loginid = this.loginid) {
        let account_type;
        if (/^VR/.test(loginid)) account_type = 'virtual';
        else if (/^MF/.test(loginid)) account_type = 'financial';
        else if (/^MLT|MX/.test(loginid)) account_type = 'gaming';
        return account_type;
    }

    /**
     * Burrowed from `Client_base::getAccountOfType()`
     * @param type
     * @param only_enabled
     * @returns {*}
     */
    getAccountOfType(type, only_enabled) {
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
     * Burrowed from `Client_base::isAccountOfType()`
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
}

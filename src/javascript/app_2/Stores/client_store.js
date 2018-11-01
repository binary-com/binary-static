import { observable, computed, action } from 'mobx';
import Client                           from '_common/base/client_base';
import GTM                              from '_common/base/gtm';
import * as SocketCache                 from '_common/base/socket_cache';
import BinarySocket                     from '_common/base/socket_base';
import eventBus                         from 'Services/event_bus';
import BaseStore                        from './base_store';

export default class ClientStore extends BaseStore {
    @observable balance;
    @observable is_logged_in;
    @observable loginid;
    @observable currency;
    @observable upgrade_info;
    @observable is_virtual;
    @observable can_upgrade;

    constructor() {
        super();
        Client.init();
        this.init();
    }

    @computed
    get is_client_allowed_to_visit() {
        return !!(!this.is_logged_in || this.is_virtual);
    }

    @action.bound
    init() {
        this.balance      = Client.get('balance') ? Client.get('balance').toString() : '';
        this.is_logged_in = !!Client.isLoggedIn();
        this.loginid      = Client.get('loginid');
        this.currency     = Client.get('currency') || '';
        this.upgrade_info = Client.getBasicUpgradeInfo();
        this.is_virtual   = Client.get('is_virtual');
        this.can_upgrade  = this.upgrade_info.can_upgrade || this.upgrade_info.can_open_multi;
    }

    /**
     * Switch to the given loginid account.
     *
     * @param loginid
     * @param client
     * @param modules
     */
    switchAccount = async (loginid) => {
        if (!loginid || !Client.get('token', loginid)) {
            return;
        }
        sessionStorage.setItem('active_tab', '1');
        // set local storage
        GTM.setLoginFlag();
        Client.set('cashier_confirmed', 0);
        Client.set('accepted_bch', 0);
        Client.set('loginid', loginid);
        SocketCache.clear();
        await BinarySocket.send({ 'authorize': Client.getAccount(loginid).token }, { forced: true });
        await this.init();
        eventBus.dispatch('ClientAccountHasSwitched', {
            loginid,
        });
    };

}

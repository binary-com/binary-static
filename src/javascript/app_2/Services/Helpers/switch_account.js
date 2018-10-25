import GTM              from '_common/base/gtm';
import * as SocketCache from '_common/base/socket_cache';
import Client           from '_common/base/client_base';
import BinarySocket     from '_common/base/socket_base';
/**
 * Switch to the given loginid account.
 *
 * @param loginid
 * @param client
 * @param modules
 */
export const switchAccount = async (loginid, client, modules) => {
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
    await client.init();
    await modules.trade.refresh();
    await modules.trade.prepareTradeStore();
};


import GTM              from '_common/base/gtm';
import * as SocketCache from '_common/base/socket_cache';
import Client           from '_common/base/client_base';

/**
 * Switch to the given loginid account.
 *
 * @param loginid
 */
export const switchAccount = (loginid) => {
    if (!loginid || !Client.get('token', loginid)) {
        return;
    }
    sessionStorage.setItem('active_tab', '1');
    // set local storage
    GTM.setLoginFlag('2');
    Client.set('cashier_confirmed', 0);
    Client.set('accepted_bch', 0);
    Client.set('loginid', loginid);
    SocketCache.clear();
    window.location.reload();
};


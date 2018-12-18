import Client            from '_common/base/client_base';
import SocketCache       from '_common/base/socket_cache';
import { removeCookies } from '_common/storage';
import WS                from './ws_methods';
import GTM               from '../Utils/gtm';
import { expect } from 'chai';
import { requestLogout } from '../logout.js';

describe('requestLogout', () => {
    it('expects the websocket close when request logout', () => {
        const doLogout = (response) => {
            if (response.logout !== 1) return;
            GTM.pushDataLayer({ event: 'log_out' });
            removeCookies('affiliate_token', 'affiliate_tracking');
            Client.clearAllAccounts();
            Client.set('loginid', '');
            SocketCache.clear();
            window.location.reload();
        };
        
        expect(requestLogout()).to.call(doLogout);
    })
})
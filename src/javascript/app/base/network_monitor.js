const BinarySocket        = require('./socket');
const BinarySocketGeneral = require('./socket_general');
const Header              = require('./header');
const localize            = require('../../_common/localize').localize;
const getElementById      = require('../../_common/common_functions').getElementById;

/*
 * Monitors the network status and initialises the WebSocket connection
 * 1. online : check the WS status (init/send: blink after timeout, open/message: online)
 * 2. offline: it is offline
 */
const NetworkMonitor = (() => {
    const pendings = {};
    const pending_keys = {
        ws_init   : 'ws_init',
        ws_request: 'ws_request',
    };
    const pending_timouts = {
        [pending_keys.ws_init]   : 5000,
        [pending_keys.ws_request]: 10000,
    };

    let ws_config,
        el_status,
        network_status;

    const init = () => {
        ws_config = $.extend({ wsEvent }, BinarySocketGeneral.initOptions());
        el_status = getElementById('network_status');

        if ('onLine' in navigator) {
            window.addEventListener('online',  setStatus);
            window.addEventListener('offline', setStatus);
        } else { // if not supported, default to online and fallback to WS checks
            navigator.onLine = true;
        }

        if (isOnline()) {
            BinarySocket.init(ws_config);
        }

        setStatus(isOnline() ? 'online' : 'offline');
    };

    const isOnline = () => navigator.onLine;

    const wsReconnect = () => {
        if (isOnline() && BinarySocket.hasReadyState(2, 3)) { // CLOSING or CLOSED
            BinarySocket.init(ws_config);
            clearPendings();
        }
    };

    const setStatus = (status) => {
        if (!isOnline() || status === pending_keys.ws_init) {
            network_status = 'offline';
            Header.displayNotification(localize('Connection error: Please check your internet connection.'), true, 'CONNECTION_ERROR');
        } else if (status === pending_keys.ws_request || network_status === 'offline') {
            network_status = 'pulser';
            wsReconnect();
            Header.hideNotification('CONNECTION_ERROR');
        } else {
            network_status = 'online';
            Header.hideNotification('CONNECTION_ERROR');
        }
        el_status.setAttribute('class', network_status);
    };

    const ws_events_map = {
        init   : () => setPending(pending_keys.ws_init),
        open   : () => clearPendings(pending_keys.ws_init),
        send   : () => setPending(pending_keys.ws_request),
        message: () => clearPendings(),
        close  : () => wsReconnect(),
    };

    const wsEvent = (event) => {
        if (typeof ws_events_map[event] === 'function') {
            ws_events_map[event]();
        }
    };

    const setPending = (key) => {
        if (pendings[key]) {
            clearPendings(key);
        }
        pendings[key] = setTimeout(() => { setStatus(key); }, pending_timouts[key]);
    };

    const clearPendings = (key) => {
        const clear = (k) => {
            clearTimeout(pendings[k]);
            pendings[k] = undefined;
        };

        if (key) {
            clear(key);
        } else {
            Object.keys(pendings).forEach(clear);
        }
        setStatus('online');
    };

    return {
        init,
        wsEvent,
    };
})();

module.exports = NetworkMonitor;

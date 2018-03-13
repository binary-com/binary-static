const Header              = require('./header');
const BinarySocket        = require('./socket');
const BinarySocketGeneral = require('./socket_general');
const getElementById      = require('../../_common/common_functions').getElementById;
const localize            = require('../../_common/localize').localize;

/*
 * Monitors the network status and initialises the WebSocket connection
 * 1. online : check the WS status (init/send: blink after timeout, open/message: online)
 * 2. offline: it is offline
 */
const NetworkMonitor = (() => {
    const status_config = {
        online  : { class: 'online',  tooltip: 'Online' },
        offline : { class: 'offline', tooltip: 'Offline' },
        blinking: { class: 'blinker', tooltip: 'Connecting to server' },
    };
    const pendings = {};
    const pending_keys = {
        ws_init   : 'ws_init',
        ws_request: 'ws_request',
    };
    const pending_timeouts = {
        [pending_keys.ws_init]   : 5000,
        [pending_keys.ws_request]: 10000,
    };

    let ws_config,
        el_status,
        el_tooltip,
        network_status;

    const init = () => {
        ws_config  = $.extend({ wsEvent, isOnline }, BinarySocketGeneral.initOptions());
        el_status  = getElementById('network_status');
        el_tooltip = el_status.parentNode;

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
        } else {
            BinarySocket.send({ ping: 1 }); // trigger a request to get stable status sooner
        }
    };

    const setStatus = (status) => {
        if (!isOnline()) {
            network_status = 'offline';
        } else if (pending_keys[status] || network_status === 'offline') {
            network_status = 'blinking';
            wsReconnect();
        } else {
            network_status = 'online';
        }

        updateHeaderNotification();

        if (el_status && el_tooltip) {
            el_status.setAttribute('class', status_config[network_status].class);
            el_tooltip.setAttribute('data-balloon', `${localize('Network status')}: ${localize(status_config[network_status].tooltip)}`);
        }
    };

    const updateHeaderNotification = () => {
        const connection_error_code = 'CONNECTION_ERROR';
        if (isOnline()) {
            Header.hideNotification(connection_error_code);
        } else {
            Header.displayNotification(localize('Connection error: Please check your internet connection.'), true, connection_error_code);
        }
    };

    const ws_events_map = {
        init   : () => setPending(pending_keys.ws_init),
        open   : () => clearPendings(pending_keys.ws_init),
        send   : () => setPending(pending_keys.ws_request),
        message: () => clearPendings(),
        close  : () => setPending(pending_keys.ws_init),
    };

    const wsEvent = (event) => {
        if (typeof ws_events_map[event] === 'function') {
            ws_events_map[event]();
        }
    };

    const setPending = (key) => {
        if (!pendings[key]) {
            pendings[key] = setTimeout(() => {
                pendings[key] = undefined;
                setStatus(key);
            }, pending_timeouts[key]);
        }
    };

    const clearPendings = (key) => {
        const clear = (k) => {
            clearTimeout(pendings[k]);
            pendings[k] = undefined;
            if (k === pending_keys.ws_request) {
                setStatus('online');
            }
        };

        if (key) {
            clear(key);
        } else {
            Object.keys(pendings).forEach(clear);
        }
    };

    return {
        init,
        wsEvent,
    };
})();

module.exports = NetworkMonitor;

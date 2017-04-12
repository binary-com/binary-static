const MBTradePage          = require('./mb_trade/mb_tradepage');
const TradePage_Beta       = require('./trade/beta/tradepage');
const reloadPage           = require('./trade/common').reloadPage;
const Notifications        = require('./trade/notifications');
const TradePage            = require('./trade/tradepage');
const updateBalance        = require('./user/update_balance');
const Client               = require('../base/client');
const Clock                = require('../base/clock');
const GTM                  = require('../base/gtm');
const Header               = require('../base/header');
const getLanguage          = require('../base/language').get;
const localize             = require('../base/localize').localize;
const Login                = require('../base/login');
const State                = require('../base/storage').State;
const getPropertyValue     = require('../base/utility').getPropertyValue;
const getLoginToken        = require('../common_functions/common_functions').getLoginToken;
const SessionDurationLimit = require('../common_functions/session_duration_limit');
const getAppId             = require('../../config').getAppId;
const getSocketURL         = require('../../config').getSocketURL;
const Cookies              = require('../../lib/js-cookie');

/*
 * It provides a abstraction layer over native javascript Websocket.
 *
 * Provide additional functionality like if connection is close, open
 * it again and process the buffered requests
 *
 *
 * Usage:
 *
 * `BinarySocket.init()` to initiate the connection
 * `BinarySocket.send({contracts_for : 1})` to send message to server
 */
const BinarySocketClass = () => {
    'use strict';

    let binary_socket,
        buffered_sends = [],
        events = {},
        authorized   = false,
        req_number   = 0,
        req_id       = 0,
        wrong_app_id = 0;

    const timeouts  = {};
    const socket_url = `${getSocketURL()}?app_id=${getAppId()}&l=${getLanguage()}`;
    const promises  = {};
    const no_duplicate_requests = [
        'authorize',
        'get_settings',
        'residence_list',
        'landing_company',
        'payout_currencies',
    ];
    let sent_requests = [];
    const waiting_list = {
        items: {},
        add  : (msg_type, promise_obj) => {
            if (!waiting_list.items[msg_type]) {
                waiting_list.items[msg_type] = [];
            }
            waiting_list.items[msg_type].push(promise_obj);
        },
        resolve: (response) => {
            const msg_type = response.msg_type;
            const this_promises = waiting_list.items[msg_type];
            if (this_promises && this_promises.length) {
                this_promises.forEach((pr) => {
                    if (!waiting_list.another_exists(pr, msg_type)) {
                        pr.resolve(response);
                    }
                });
                waiting_list.items[msg_type] = [];
            }
        },
        another_exists: (pr, msg_type) => (
            Object.keys(waiting_list.items)
                .some(type => (
                    type !== msg_type &&
                    $.inArray(pr, waiting_list.items[type]) >= 0
                ))
        ),
    };

    const clearTimeouts = () => {
        Object.keys(timeouts).forEach((key) => {
            clearTimeout(timeouts[key]);
            delete timeouts[key];
        });
    };

    const isReady = () => binary_socket && binary_socket.readyState === 1;

    const isClose = () => !binary_socket || binary_socket.readyState === 2 || binary_socket.readyState === 3;

    const sendBufferedSends = () => {
        while (buffered_sends.length > 0) {
            binary_socket.send(JSON.stringify(buffered_sends.shift()));
        }
    };

    const wait = (...msg_types) => {
        const promise_obj = new PromiseClass();
        let is_resolved = true;
        msg_types.forEach((msg_type) => {
            const last_response = State.get(['response', msg_type]);
            if (!last_response) {
                if (msg_type !== 'authorize' || Client.isLoggedIn()) {
                    waiting_list.add(msg_type, promise_obj);
                    is_resolved = false;
                }
            } else if (msg_types.length === 1) {
                promise_obj.resolve(last_response);
            }
        });
        if (is_resolved) {
            promise_obj.resolve();
        }
        return promise_obj.promise;
    };

    /**
     * @param {Object} data: request object
     * @param {Object} options:
     *      forced  : {boolean}  sends the request regardless the same msg_type has been sent before
     *      msg_type: {string}   specify the type of request call
     *      callback: {function} to call on response of streaming requests
     */
    const send = function(data, options = {}) {
        const promise_obj = new PromiseClass();

        const msg_type = options.msg_type || no_duplicate_requests.find(c => c in data);
        if (!options.forced && msg_type) {
            const last_response = State.get(['response', msg_type]);
            if (last_response) {
                promise_obj.resolve(last_response);
                return promise_obj.promise;
            } else if (sent_requests.indexOf(msg_type) >= 0) {
                return wait(msg_type).then((response) => {
                    promise_obj.resolve(response);
                    return promise_obj.promise;
                });
            }
        }
        if (msg_type) {
            sent_requests.push(msg_type);
        }

        if (!data.req_id) {
            data.req_id = ++req_id;
        }
        promises[data.req_id] = {
            callback: (response) => {
                if (typeof options.callback === 'function') {
                    options.callback(response);
                } else {
                    promise_obj.resolve(response);
                }
            },
            subscribe: !!data.subscribe,
        };

        if (isReady()) {
            if (!data.hasOwnProperty('passthrough') && !data.hasOwnProperty('verify_email')) {
                data.passthrough = {};
            }
            // temporary check
            if ((data.contracts_for || data.proposal) && !data.passthrough.hasOwnProperty('dispatch_to') && !State.get('is_mb_trading')) {
                data.passthrough.req_number = ++req_number;
                timeouts[req_number] = setTimeout(() => {
                    if (typeof reloadPage === 'function' && data.contracts_for) {
                        window.alert(`The server didn't respond to the request:\n\n${JSON.stringify(data)}\n\n`);
                        reloadPage();
                    } else {
                        $('.price_container').hide();
                    }
                }, 60 * 1000);
            } else if (data.contracts_for && !data.passthrough.hasOwnProperty('dispatch_to') && State.get('is_mb_trading')) {
                data.passthrough.req_number = ++req_number;
                timeouts[req_number] = setTimeout(() => {
                    MBTradePage.onDisconnect();
                }, 10 * 1000);
            }

            binary_socket.send(JSON.stringify(data));
        } else {
            buffered_sends.push(data);
            if (isClose()) {
                init(1);
            }
        }

        return promise_obj.promise;
    };

    const setResidence = (residence) => {
        if (residence) {
            Client.setCookie('residence', residence);
            Client.set('residence', residence);
            send({ landing_company: residence });
        }
    };

    const init = (es) => {
        if (wrong_app_id === getAppId()) {
            return;
        }
        if (!es) {
            events = {};
        }
        if (typeof es === 'object') {
            buffered_sends = [];
            events = es;
            clearTimeouts();
        }

        if (isClose()) {
            binary_socket = new WebSocket(socket_url);
        }

        binary_socket.onopen = () => {
            Notifications.hide('CONNECTION_ERROR');
            const api_token = getLoginToken();
            if (api_token && !authorized && localStorage.getItem('client.tokens')) {
                binary_socket.send(JSON.stringify({ authorize: api_token }));
            } else {
                sendBufferedSends();
            }

            if (typeof events.onopen === 'function') {
                events.onopen();
            }

            if (isReady()) {
                if (!Login.isLoginPages()) {
                    Client.validateLoginid();
                    binary_socket.send(JSON.stringify({ website_status: 1 }));
                }
                Clock.startClock();
            }
        };

        binary_socket.onmessage = (msg) => {
            const response = JSON.parse(msg.data);
            if (response) {
                const passthrough = getPropertyValue(response, ['echo_req', 'passthrough']);
                let dispatch_to;
                if (passthrough) {
                    const this_req_number = passthrough.req_number;
                    if (this_req_number) {
                        clearInterval(timeouts[this_req_number]);
                        delete timeouts[this_req_number];
                    }
                }

                const type = response.msg_type;

                // store in State
                if (!getPropertyValue(response, ['echo_req', 'subscribe']) || type === 'balance') {
                    State.set(['response', type], $.extend({}, response));
                }
                // resolve the send promise
                const this_req_id = response.req_id;
                const pr = this_req_id ? promises[this_req_id] : null;
                if (pr && typeof pr.callback === 'function') {
                    pr.callback(response);
                    if (!pr.subscribe) {
                        delete promises[this_req_id];
                    }
                }
                // resolve the wait promise
                waiting_list.resolve(response);

                const error_code = getPropertyValue(response, ['error', 'code']);
                if (type === 'authorize') {
                    if (response.error) {
                        const is_active_tab = sessionStorage.getItem('active_tab') === '1';
                        if (error_code === 'SelfExclusion' && is_active_tab) {
                            sessionStorage.removeItem('active_tab');
                            window.alert(response.error.message);
                        }
                        Client.sendLogoutRequest(is_active_tab);
                    } else if (response.authorize.loginid !== Cookies.get('loginid')) {
                        Client.sendLogoutRequest(true);
                    } else if (dispatch_to !== 'cashier_password') {
                        authorized = true;
                        if (!Login.isLoginPages()) {
                            Client.responseAuthorize(response);
                            send({ balance: 1, subscribe: 1 });
                            send({ get_settings: 1 });
                            send({ get_account_status: 1 });
                            send({ payout_currencies: 1 });
                            setResidence(response.authorize.country || Cookies.get('residence'));
                            if (!Client.get('is_virtual')) {
                                send({ get_self_exclusion: 1 });
                                // TODO: remove this when back-end adds it as a status to get_account_status
                                send({ get_financial_assessment: 1 });
                            }
                        }
                        sendBufferedSends();
                    }
                } else if (type === 'balance') {
                    updateBalance(response);
                } else if (type === 'logout') {
                    Client.doLogout(response);
                } else if (type === 'landing_company') {
                    Header.upgradeMessageVisibility();
                    if (response.error) return;
                    // Header.metatraderMenuItemVisibility(response); // to be uncommented once MetaTrader launched
                    const company = Client.currentLandingCompany();
                    if (company) {
                        Client.set('default_currency', company.legal_default_currency);
                    }
                } else if (type === 'get_self_exclusion') {
                    SessionDurationLimit.exclusionResponseHandler(response);
                } else if (type === 'payout_currencies') {
                    Client.set('currencies', response.payout_currencies.join(','));
                } else if (type === 'get_settings' && response.get_settings) {
                    setResidence(response.get_settings.country_code);
                    GTM.eventHandler(response.get_settings);
                    if (response.get_settings.is_authenticated_payment_agent) {
                        $('#topMenuPaymentAgent').removeClass('invisible');
                    }
                    Client.set('first_name', response.get_settings.first_name);
                }

                switch (error_code) {
                    case 'WrongResponse':
                    case 'OutputValidationFailed': {
                        const text_value = (error_code === 'WrongResponse' && response.error.message ? response.error.message : localize('Sorry, an error occurred while processing your request.'));
                        $('#content').empty().html($('<div/>', { class: 'container' }).append($('<p/>', { class: 'notice-msg center-text', text: text_value })));
                        break;
                    }
                    case 'RateLimit':
                        $('#ratelimit-error-message:hidden').css('display', 'block');
                        break;
                    case 'InvalidToken':
                        if (!/^(reset_password|new_account_virtual|paymentagent_withdraw|cashier)$/.test(type)) {
                            Client.sendLogoutRequest();
                        }
                        break;
                    case 'InvalidAppID':
                        wrong_app_id = getAppId();
                        window.alert(response.error.message);
                        break;
                    // no default
                }

                if (typeof events.onmessage === 'function') {
                    events.onmessage(msg);
                }
            }
        };

        binary_socket.onclose = () => {
            authorized = false;
            sent_requests = [];
            clearTimeouts();

            if (wrong_app_id !== getAppId()) {
                const toCall = State.get('is_trading')      ? TradePage.onDisconnect      :
                               State.get('is_beta_trading') ? TradePage_Beta.onDisconnect :
                               State.get('is_mb_trading')   ? MBTradePage.onDisconnect    : '';
                if (toCall) {
                    Notifications.show({ text: localize('Connection error: Please check your internet connection.'), uid: 'CONNECTION_ERROR', dismissible: true });
                    timeouts.error = setTimeout(() => {
                        toCall();
                    }, 10 * 1000);
                } else {
                    init(1);
                }
            }
            if (typeof events.onclose === 'function') {
                events.onclose();
            }
        };

        binary_socket.onerror = (error) => {
            console.log('socket error', error);
        };
    };

    const clear = () => {
        buffered_sends = [];
        events = {};
    };

    return {
        init         : init,
        wait         : wait,
        send         : send,
        socket       : () => binary_socket,
        clear        : clear,
        clearTimeouts: clearTimeouts,
    };
};

class PromiseClass {
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.reject = reject;
            this.resolve = resolve;
        });
    }
}

const BinarySocket = new BinarySocketClass();

module.exports = {
    BinarySocket: BinarySocket,
};

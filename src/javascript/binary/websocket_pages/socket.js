const getLanguage      = require('../base/language').get;
const localize         = require('../base/localize').localize;
const State            = require('../base/storage').State;
const getPropertyValue = require('../base/utility').getPropertyValue;
const getLoginToken    = require('../common_functions/common_functions').getLoginToken;
const getAppId         = require('../../config').getAppId;
const getSocketURL     = require('../../config').getSocketURL;

/*
 * An abstraction layer over native javascript WebSocket,
 * which provides additional functionality like
 * reopen the closed connection and process the buffered requests
 */
const BinarySocket = (() => {
    'use strict';

    let binary_socket,
        config         = {},
        buffered_sends = [],
        req_number     = 0,
        req_id         = 0,
        wrong_app_id   = 0,
        is_available   = true,
        is_disconnect_called = false;

    const socket_url = `${getSocketURL()}?app_id=${getAppId()}&l=${getLanguage()}`;
    const timeouts   = {};
    const promises   = {};
    const no_duplicate_requests = [
        'authorize',
        'get_settings',
        'residence_list',
        'landing_company',
        'payout_currencies',
        'asset_index',
    ];
    const sent_requests = {
        items : [],
        clear : () => { sent_requests.items = []; },
        has   : msg_type   => sent_requests.items.indexOf(msg_type) >= 0,
        add   : (msg_type) => { if (!sent_requests.has(msg_type)) sent_requests.items.push(msg_type); },
        remove: (msg_type) => {
            if (sent_requests.has(msg_type)) sent_requests.items.splice(sent_requests.items.indexOf(msg_type, 1));
        },
    };
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

    const sendBufferedRequests = () => {
        while (buffered_sends.length > 0) {
            const req_obj = buffered_sends.shift();
            send(req_obj.request, req_obj.options);
        }
    };

    const wait = (...msg_types) => {
        const promise_obj = new PromiseClass();
        let is_resolved = true;
        msg_types.forEach((msg_type) => {
            const last_response = State.get(['response', msg_type]);
            if (!last_response) {
                if (msg_type !== 'authorize' || config.is_logged_in) {
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
        const promise_obj = options.promise || new PromiseClass();

        const msg_type = options.msg_type || no_duplicate_requests.find(c => c in data);
        if (!options.forced && msg_type) {
            const last_response = State.get(['response', msg_type]);
            if (last_response) {
                promise_obj.resolve(last_response);
                return promise_obj.promise;
            } else if (sent_requests.has(msg_type)) {
                return wait(msg_type).then((response) => {
                    promise_obj.resolve(response);
                    return promise_obj.promise;
                });
            }
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

        if (isReady() && is_available) {
            is_disconnect_called = false;
            if (!data.hasOwnProperty('passthrough') && !data.hasOwnProperty('verify_email')) {
                data.passthrough = {};
            }
            if (+data.time === 1) {
                data.passthrough.req_number = ++req_number;
                timeouts[req_number] = setTimeout(binary_socket.onclose, 10 * 1000);
            }

            binary_socket.send(JSON.stringify(data));
            if (msg_type && !sent_requests.has(msg_type)) {
                sent_requests.add(msg_type);
            }
        } else {
            buffered_sends.push({ request: data, options: $.extend(options, { promise: promise_obj }) });
            if (isClose() && !timeouts.reconnect) {
                timeouts.reconnect = setTimeout(() => { init(1); }, 5 * 1000);
            }
        }

        return promise_obj.promise;
    };

    const init = (options) => {
        if (wrong_app_id === getAppId()) {
            return;
        }
        if (typeof options === 'object') {
            config = options;
            buffered_sends = [];
        }
        clearTimeouts();

        if (isClose()) {
            binary_socket = new WebSocket(socket_url);
            State.set('response', {});
        }

        binary_socket.onopen = () => {
            const api_token = getLoginToken();
            if (api_token && localStorage.getItem('client.tokens')) {
                send({ authorize: api_token }, { forced: true });
            } else {
                sendBufferedRequests();
            }

            if (typeof config.onOpen === 'function') {
                config.onOpen(isReady());
            }
        };

        binary_socket.onmessage = (msg) => {
            const response = JSON.parse(msg.data);
            if (response) {
                const passthrough = getPropertyValue(response, ['echo_req', 'passthrough']);
                if (passthrough) {
                    const this_req_number = passthrough.req_number;
                    if (this_req_number) {
                        clearInterval(timeouts[this_req_number]);
                        delete timeouts[this_req_number];
                    }
                }

                const type = response.msg_type;

                // store in State
                if (!getPropertyValue(response, ['echo_req', 'subscribe']) || /(balance|website_status)/.test(type)) {
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
                switch (error_code) {
                    case 'WrongResponse':
                    case 'OutputValidationFailed': {
                        const text_value = (error_code === 'WrongResponse' && response.error.message ? response.error.message : localize('Sorry, an error occurred while processing your request.'));
                        $('#content').empty().html($('<div/>', { class: 'container' }).append($('<p/>', { class: 'notice-msg center-text', text: text_value })));
                        break;
                    }
                    case 'RateLimit':
                        config.notify(localize('You have reached the rate limit of requests per second. Please try later.'), true, 'RATE_LIMIT');
                        break;
                    case 'InvalidAppID':
                        wrong_app_id = getAppId();
                        config.notify(response.error.message, true, 'INVALID_APP_ID');
                        break;
                    // no default
                }

                if (typeof config.onMessage === 'function') {
                    config.onMessage(response);
                }
            }
        };

        binary_socket.onclose = () => {
            sent_requests.clear();
            clearTimeouts();

            if (wrong_app_id !== getAppId()) {
                if (isClose()) {
                    config.notify(localize('Connection error: Please check your internet connection.'), true, 'CONNECTION_ERROR');
                }
                if (typeof config.onDisconnect === 'function' && !is_disconnect_called) {
                    config.onDisconnect();
                    is_disconnect_called = true;
                } else if (!timeouts.reconnect) {
                    timeouts.reconnect = setTimeout(() => { init(1); }, 5 * 1000);
                }
            }
        };
    };

    const clear = (msg_type) => {
        buffered_sends = [];
        if (msg_type) {
            State.set(['response', msg_type], undefined);
            sent_requests.remove(msg_type);
        }
    };

    const availability = (status) => {
        if (typeof status !== 'undefined') {
            is_available = !!status;
        }
        return is_available;
    };

    return {
        init              : init,
        wait              : wait,
        send              : send,
        clear             : clear,
        clearTimeouts     : clearTimeouts,
        sendBuffered      : sendBufferedRequests,
        availability      : availability,
        setOnDisconnect   : (onDisconnect) => { config.onDisconnect = onDisconnect; },
        removeOnDisconnect: () => { delete config.onDisconnect; },
    };
})();

class PromiseClass {
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.reject = reject;
            this.resolve = resolve;
        });
    }
}

module.exports = BinarySocket;

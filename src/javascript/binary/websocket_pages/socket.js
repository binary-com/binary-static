const getSocketURL              = require('../../config').getSocketURL;
const getAppId                  = require('../../config').getAppId;
const Login                     = require('../base/login').Login;
const objectNotEmpty            = require('../base/utility').objectNotEmpty;
const getLoginToken             = require('../common_functions/common_functions').getLoginToken;
const displayAcctSettings       = require('../common_functions/account_opening').displayAcctSettings;
const SessionDurationLimit      = require('../common_functions/session_duration_limit').SessionDurationLimit;
const checkClientsCountry       = require('../common_functions/country_base').checkClientsCountry;
const Cashier                   = require('./cashier/cashier').Cashier;
const CashierJP                 = require('../../binary_japan/cashier').CashierJP;
const PaymentAgentWithdrawWS    = require('./cashier/payment_agent_withdrawws').PaymentAgentWithdrawWS;
const create_language_drop_down = require('../common_functions/attach_dom/language_dropdown').create_language_drop_down;
const TNCApproval               = require('./user/tnc_approval').TNCApproval;
const ViewPopupWS               = require('./user/view_popup/view_popupws').ViewPopupWS;
const ViewBalanceUI             = require('./user/viewbalance/viewbalance.ui').ViewBalanceUI;
const Cookies                   = require('../../lib/js-cookie');
const State                     = require('../base/storage').State;
const Highchart                 = require('./trade/charts/highchartws').Highchart;
const WSTickDisplay             = require('./trade/tick_trade').WSTickDisplay;
const TradePage                 = require('./trade/tradepage').TradePage;
const Notifications             = require('./trade/notifications').Notifications;
const TradePage_Beta            = require('./trade/beta/tradepage').TradePage_Beta;
const reloadPage                = require('./trade/common').reloadPage;
const MBTradePage               = require('./mb_trade/mb_tradepage').MBTradePage;
const RealityCheck              = require('./user/reality_check/reality_check.init').RealityCheck;
const RealityCheckData          = require('./user/reality_check/reality_check.data').RealityCheckData;
const localize         = require('../base/localize').localize;
const getLanguage      = require('../base/language').getLanguage;
const validate_loginid = require('../base/client').validate_loginid;
const GTM        = require('../base/gtm').GTM;
const Clock      = require('../base/clock').Clock;
const Header     = require('../base/header').Header;
const LocalStore = require('../base/storage').LocalStore;
const Client     = require('../base/client').Client;
const page       = require('../base/page').page;
const check_risk_classification       = require('../common_functions/check_risk_classification').check_risk_classification;
const qualify_for_risk_classification = require('../common_functions/check_risk_classification').qualify_for_risk_classification;

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
const BinarySocketClass = function() {
    'use strict';

    let binarySocket,
        bufferedSends = [],
        manualClosed = false,
        events = {},
        authorized = false,
        req_number = 0,
        wrongAppId = 0;

    const timeouts = {},
        socketUrl = getSocketURL() + '?app_id=' + getAppId() + '&l=' + getLanguage();

    const clearTimeouts = function() {
        Object.keys(timeouts).forEach(function(key) {
            clearTimeout(timeouts[key]);
            delete timeouts[key];
        });
    };

    const isReady = function () {
        return binarySocket && binarySocket.readyState === 1;
    };

    const isClose = function () {
        return !binarySocket || binarySocket.readyState === 2 || binarySocket.readyState === 3;
    };

    const sendBufferedSends = function () {
        while (bufferedSends.length > 0) {
            binarySocket.send(JSON.stringify(bufferedSends.shift()));
        }
    };

    const send = function(data) {
        if (isClose()) {
            bufferedSends.push(data);
            init(1);
        } else if (isReady()) {
            if (!data.hasOwnProperty('passthrough') && !data.hasOwnProperty('verify_email')) {
                data.passthrough = {};
            }
            // temporary check
            if ((data.contracts_for || data.proposal) && !data.passthrough.hasOwnProperty('dispatch_to') && !State.get('is_mb_trading')) {
                data.passthrough.req_number = ++req_number;
                timeouts[req_number] = setTimeout(function() {
                    if (typeof reloadPage === 'function' && data.contracts_for) {
                        window.alert("The server didn't respond to the request:\n\n" + JSON.stringify(data) + '\n\n');
                        reloadPage();
                    } else {
                        $('.price_container').hide();
                    }
                }, 60 * 1000);
            } else if (data.contracts_for && !data.passthrough.hasOwnProperty('dispatch_to') && State.get('is_mb_trading')) {
                data.passthrough.req_number = ++req_number;
                timeouts[req_number] = setTimeout(function() {
                    MBTradePage.onDisconnect();
                }, 10 * 1000);
            }

            binarySocket.send(JSON.stringify(data));
        } else {
            bufferedSends.push(data);
        }
    };

    const init = function (es) {
        if (wrongAppId === getAppId()) {
            return;
        }
        if (!es) {
            events = {};
        }
        if (typeof es === 'object') {
            bufferedSends = [];
            manualClosed = false;
            events = es;
            clearTimeouts();
        }

        if (isClose()) {
            binarySocket = new WebSocket(socketUrl);
        }

        binarySocket.onopen = function () {
            const apiToken = getLoginToken();
            if (apiToken && !authorized && localStorage.getItem('client.tokens')) {
                binarySocket.send(JSON.stringify({ authorize: apiToken }));
            } else {
                sendBufferedSends();
            }

            if (typeof events.onopen === 'function') {
                events.onopen();
            }

            if (isReady()) {
                if (!Login.is_login_pages()) {
                    validate_loginid();
                    binarySocket.send(JSON.stringify({ website_status: 1 }));
                }
                if (!Clock.getClockStarted()) Clock.start_clock_ws();
            }
        };

        binarySocket.onmessage = function(msg) {
            const response = JSON.parse(msg.data);
            if (response) {
                if (response.hasOwnProperty('echo_req') && response.echo_req !== null && response.echo_req.hasOwnProperty('passthrough')) {
                    const passthrough = response.echo_req.passthrough;
                    if (passthrough.hasOwnProperty('req_number')) {
                        clearInterval(timeouts[response.echo_req.passthrough.req_number]);
                        delete timeouts[response.echo_req.passthrough.req_number];
                    } else if (passthrough.hasOwnProperty('dispatch_to')) {
                        switch (passthrough.dispatch_to) {
                            case 'ViewPopupWS':       ViewPopupWS.dispatch(response); break;
                            case 'ViewChartWS':       Highchart.dispatch(response);   break;
                            case 'ViewTickDisplayWS': WSTickDisplay.dispatch(response); break;
                            // no default
                        }
                    }
                }
                const type = response.msg_type;
                if (type === 'authorize') {
                    if (response.hasOwnProperty('error')) {
                        const isActiveTab = sessionStorage.getItem('active_tab') === '1';
                        if (response.error.code === 'SelfExclusion' && isActiveTab) {
                            sessionStorage.removeItem('active_tab');
                            window.alert(response.error.message);
                        }
                        LocalStore.set('reality_check.ack', 0);
                        Client.send_logout_request(isActiveTab);
                    } else if (response.authorize.loginid !== Client.get('loginid')) {
                        Client.send_logout_request(true);
                    } else if (!(response.hasOwnProperty('echo_req') && response.echo_req.hasOwnProperty('passthrough') &&
                        response.echo_req.passthrough.hasOwnProperty('dispatch_to') &&
                        response.echo_req.passthrough.dispatch_to === 'cashier_password')) {
                        authorized = true;
                        if (typeof events.onauth === 'function') {
                            events.onauth();
                        }
                        if (!Login.is_login_pages()) {
                            Client.response_authorize(response);
                            send({ balance: 1, subscribe: 1 });
                            send({ get_settings: 1 });
                            send({ get_account_status: 1 });
                            if (Cookies.get('residence')) send({ landing_company: Cookies.get('residence') });
                            if (!Client.get('is_virtual')) send({ get_self_exclusion: 1 });
                            if (/tnc_approvalws/.test(window.location.pathname)) {
                                TNCApproval.showTNC();
                            }
                        }
                        sendBufferedSends();
                    }
                } else if (type === 'balance') {
                    ViewBalanceUI.updateBalances(response);
                } else if (type === 'time') {
                    Clock.time_counter(response);
                } else if (type === 'logout') {
                    RealityCheckData.clear();
                    Client.do_logout(response);
                } else if (type === 'landing_company') {
                    const landing_company = response.landing_company;
                    Client.landing_company(landing_company);
                    Header.topbar_message_visibility(landing_company);
                    let company;
                    if (response.hasOwnProperty('error')) return;
                    Object.keys(landing_company).forEach(function(key) {
                        if (Client.get('landing_company_name') === landing_company[key].shortcode) {
                            company = landing_company[key];
                        }
                    });
                    if (company) {
                        Client.set('default_currency', company.legal_default_currency);
                        const has_reality_check = company.has_reality_check;
                        if (has_reality_check) {
                            Client.set('has_reality_check', has_reality_check);
                            RealityCheck.init();
                        }
                    }
                } else if (type === 'get_self_exclusion') {
                    SessionDurationLimit.exclusionResponseHandler(response);
                } else if (type === 'payout_currencies') {
                    Client.set('currencies', response.payout_currencies.join(','));
                } else if (type === 'get_settings' && response.get_settings) {
                    const country_code = response.get_settings.country_code;
                    if (country_code) {
                        Client.set('residence', country_code);
                        if (!Cookies.get('residence')) {
                            Client.set_cookie('residence', country_code);
                            send({ landing_company: country_code });
                        }
                    } else if (country_code === null && response.get_settings.country === null) {
                        Header.topbar_message_visibility('show_residence');
                    }
                    if (/realws|maltainvestws|japanws/.test(window.location.href)) {
                        displayAcctSettings(response);
                    }
                    GTM.event_handler(response.get_settings);
                    Client.set('tnc_status', response.get_settings.client_tnc_status || '-');
                    if (!localStorage.getItem('risk_classification')) Client.check_tnc();
                    const jpStatus = response.get_settings.jp_account_status;
                    if (jpStatus) {
                        Client.set('jp_status', jpStatus.status);
                    }
                    if (response.get_settings.is_authenticated_payment_agent) {
                        $('#topMenuPaymentAgent').removeClass('invisible');
                    }
                    Client.set('first_name', response.get_settings.first_name);
                    CashierJP.set_name_id();
                    CashierJP.set_email_id();
                } else if (type === 'website_status') {
                    if (!response.hasOwnProperty('error')) {
                        create_language_drop_down(response.website_status.supported_languages);
                        LocalStore.set('website.tnc_version', response.website_status.terms_conditions_version);
                        if (!localStorage.getItem('risk_classification')) Client.check_tnc();
                        if (response.website_status.hasOwnProperty('clients_country')) {
                            localStorage.setItem('clients_country', response.website_status.clients_country);
                            if (!$('body').hasClass('BlueTopBack') && !Login.is_login_pages()) {
                                checkClientsCountry();
                            }
                        }
                    }
                } else if (type === 'reality_check') {
                    RealityCheck.realityCheckWSHandler(response);
                } else if (type === 'get_account_status' && response.get_account_status) {
                    if (response.get_account_status.risk_classification === 'high' && qualify_for_risk_classification()) {
                        send({ get_financial_assessment: 1 });
                    } else {
                        localStorage.removeItem('risk_classification');
                        Client.check_tnc();
                    }
                    localStorage.setItem('risk_classification.response', response.get_account_status.risk_classification);

                    sessionStorage.setItem('client_status', response.get_account_status.status);
                    page.show_authenticate_message();

                    if (response.echo_req.hasOwnProperty('passthrough') && response.echo_req.passthrough.hasOwnProperty('dispatch_to')) {
                        if (response.echo_req.passthrough.dispatch_to === 'ForwardWS') {
                            BinarySocket.send({ cashier_password: '1' });
                        } else if (response.echo_req.passthrough.dispatch_to === 'Cashier') {
                            Cashier.check_locked();
                        } else if (response.echo_req.passthrough.dispatch_to === 'PaymentAgentWithdrawWS') {
                            PaymentAgentWithdrawWS.lock_withdrawal(Client.status_detected('withdrawal_locked, cashier_locked', 'any') ? 'locked' : 'unlocked');
                        }
                    }
                } else if (type === 'get_financial_assessment' && !response.hasOwnProperty('error')) {
                    if (!objectNotEmpty(response.get_financial_assessment)) {
                        if (qualify_for_risk_classification() && localStorage.getItem('risk_classification.response') === 'high') {
                            localStorage.setItem('risk_classification', 'high');
                            check_risk_classification();
                        }
                    } else if ((localStorage.getItem('reality_check.ack') === '1' || !localStorage.getItem('reality_check.interval')) && localStorage.getItem('risk_classification') !== 'high') {
                        localStorage.removeItem('risk_classification');
                        localStorage.removeItem('risk_classification.response');
                        Client.check_tnc();
                    }
                }
                if (response.hasOwnProperty('error')) {
                    if (response.error && response.error.code) {
                        if (response.error.code && (response.error.code === 'WrongResponse' || response.error.code === 'OutputValidationFailed')) {
                            $('#content').empty().html('<div class="container"><p class="notice-msg center-text">' + (response.error.code === 'WrongResponse' && response.error.message ? response.error.message : localize('Sorry, an error occurred while processing your request.')) + '</p></div>');
                        } else if (response.error.code === 'RateLimit' && !/jp_trading/i.test(window.location.pathname)) {
                            $('#ratelimit-error-message')
                            .css('display', 'block')
                            .on('click', '#ratelimit-refresh-link', function () {
                                window.location.reload();
                            });
                        } else if (response.error.code === 'InvalidToken' &&
                          type !== 'reset_password' &&
                          type !== 'new_account_virtual' &&
                          type !== 'paymentagent_withdraw' &&
                          type !== 'cashier') {
                            Client.send_logout_request();
                        } else if (response.error.code === 'InvalidAppID') {
                            wrongAppId = getAppId();
                            window.alert(response.error.message);
                        }
                    }
                }
                if (typeof events.onmessage === 'function') {
                    events.onmessage(msg);
                }
            }
        };

        binarySocket.onclose = function () {
            authorized = false;
            clearTimeouts();

            if (!manualClosed && wrongAppId !== getAppId()) {
                const toCall = State.get('is_trading')      ? TradePage.onDisconnect      :
                             State.get('is_beta_trading') ? TradePage_Beta.onDisconnect :
                             State.get('is_mb_trading')   ? MBTradePage.onDisconnect    : '';
                if (toCall) {
                    Notifications.show({ text: localize('Connection error: Please check your internet connection.'), uid: 'CONNECTION_ERROR', dismissible: true });
                    timeouts.error = setTimeout(function() {
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

        binarySocket.onerror = function (error) {
            console.log('socket error', error);
        };
    };

    const close = function () {
        manualClosed = true;
        bufferedSends = [];
        events = {};
        if (binarySocket) {
            binarySocket.close();
        }
    };

    const clear = function() {
        bufferedSends = [];
        manualClosed = false;
        events = {};
    };

    return {
        init         : init,
        send         : send,
        close        : close,
        socket       : function () { return binarySocket; },
        clear        : clear,
        clearTimeouts: clearTimeouts,
    };
};

const BinarySocket = new BinarySocketClass();

module.exports = {
    BinarySocket: BinarySocket,
};

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
function BinarySocketClass() {
    'use strict';

    var binarySocket,
        bufferedSends = [],
        manualClosed = false,
        events = {},
        authorized = false,
        timeouts = {},
        req_number = 0,
        wrongAppId = 0,
        socketUrl = getSocketURL() + '?app_id=' + getAppId() + (page.language() ? '&l=' + page.language() : '');

    var clearTimeouts = function(){
        for(var k in timeouts){
            if(timeouts.hasOwnProperty(k)){
                clearTimeout(timeouts[k]);
                delete timeouts[k];
            }
        }
    };

    var isReady = function () {
        return binarySocket && binarySocket.readyState === 1;
    };

    var isClose = function () {
        return !binarySocket || binarySocket.readyState === 2 || binarySocket.readyState === 3;
    };

    var sendBufferedSends = function () {
        while (bufferedSends.length > 0) {
            binarySocket.send(JSON.stringify(bufferedSends.shift()));
        }
    };

    var send = function(data) {
        if (isClose()) {
            bufferedSends.push(data);
            init(1);
        } else if (isReady()) {
            if(!data.hasOwnProperty('passthrough') && !data.hasOwnProperty('verify_email')){
                data.passthrough = {};
            }
            // temporary check
            if((data.contracts_for || data.proposal) && !data.passthrough.hasOwnProperty('dispatch_to')){
                data.passthrough.req_number = ++req_number;
                timeouts[req_number] = setTimeout(function(){
                    if(typeof reloadPage === 'function' && data.contracts_for){
                        alert("The server didn't respond to the request:\n\n"+JSON.stringify(data)+"\n\n");
                        reloadPage();
                    }
                    else{
                        $('.price_container').hide();
                    }
                }, 60*1000);
            }

            binarySocket.send(JSON.stringify(data));
        } else {
            bufferedSends.push(data);
        }
    };

    var init = function (es) {
        if (wrongAppId === getAppId()) {
            return;
        }
        if (!es){
            events = {};
        }
        if (typeof es === 'object') {
            bufferedSends = [];
            manualClosed = false;
            events = es;
            clearTimeouts();
        }

        if(isClose()){
            binarySocket = new WebSocket(socketUrl);
        }

        binarySocket.onopen = function () {
            var apiToken = CommonData.getLoginToken();
            if (apiToken && !authorized && localStorage.getItem('client.tokens')) {
                binarySocket.send(JSON.stringify({authorize: apiToken}));
            } else {
                sendBufferedSends();
            }

            if (typeof events.onopen === 'function') {
                events.onopen();
            }

            if (isReady()) {
                if (!Login.is_login_pages()) page.header.validate_cookies();
                if (!clock_started) page.header.start_clock_ws();
            }
        };

        binarySocket.onmessage = function(msg) {
            var response = JSON.parse(msg.data);
            if (response) {
                if(response.hasOwnProperty('echo_req') && response.echo_req !== null && response.echo_req.hasOwnProperty('passthrough')) {
                    var passthrough = response.echo_req.passthrough;
                    if(passthrough.hasOwnProperty('req_number')) {
                        clearInterval(timeouts[response.echo_req.passthrough.req_number]);
                        delete timeouts[response.echo_req.passthrough.req_number];
                    }
                    else if (passthrough.hasOwnProperty('dispatch_to')) {
                        switch (passthrough.dispatch_to) {
                            case 'ViewPopupWS':       ViewPopupWS.dispatch(response); break;
                            case 'ViewChartWS':       Highchart.dispatch(response);   break;
                            case 'ViewTickDisplayWS': WSTickDisplay.dispatch(response); break;
                        }
                    }
                }
                var type = response.msg_type;
                if (type === 'authorize') {
                    if(response.hasOwnProperty('error')) {
                        var isActiveTab = sessionStorage.getItem('active_tab') === '1';
                        if(response.error.code === 'SelfExclusion' && isActiveTab) {
                            sessionStorage.removeItem('active_tab');
                            alert(response.error.message);
                        }
                        LocalStore.set('reality_check.ack', 0);
                        page.client.send_logout_request(isActiveTab);
                    } else if (response.authorize.loginid !== page.client.loginid) {
                        page.client.send_logout_request(true);
                    } else {
                        authorized = true;
                        if(typeof events.onauth === 'function'){
                            events.onauth();
                        }
                        if(!Login.is_login_pages()) {
                            page.client.response_authorize(response);
                            send({balance:1, subscribe: 1});
                            if (Cookies.get('residence')) send({landing_company: Cookies.get('residence')});
                            send({get_settings: 1});
                            send({get_account_status: 1});
                            send({website_status: 1});
                            if(!page.client.is_virtual()) {
                                send({get_self_exclusion: 1});
                            } else {
                                Cashier.check_virtual_top_up();
                            }
                        }
                        sendBufferedSends();
                    }
                } else if (type === 'balance') {
                    ViewBalanceUI.updateBalances(response);
                } else if (type === 'time') {
                    page.header.time_counter(response);
                } else if (type === 'logout') {
                    localStorage.removeItem('jp_test_allowed');
                    RealityCheckData.clear();
                    page.header.do_logout(response);
                } else if (type === 'landing_company') {
                    page.contents.topbar_message_visibility(response.landing_company);
                    var company;
                    if (response.hasOwnProperty('error')) return;
                    for (var key in response.landing_company) {
                        if (TUser.get().landing_company_name === response.landing_company[key].shortcode) {
                            company = response.landing_company[key];
                            break;
                        }
                    }
                    if (company && company.has_reality_check) {
                        page.client.response_landing_company(company);
                        var currentData = TUser.get();
                        var addedLoginTime = $.extend({logintime: window.time.unix()}, currentData);
                        TUser.set(addedLoginTime);
                        RealityCheck.init();
                    }
                } else if (type === 'get_self_exclusion') {
                    SessionDurationLimit.exclusionResponseHandler(response);
                } else if (type === 'payout_currencies' && response.hasOwnProperty('echo_req') && response.echo_req.hasOwnProperty('passthrough') && response.echo_req.passthrough.handler === 'page.client') {
                    page.client.response_payout_currencies(response);
                } else if (type === 'get_settings' && response.get_settings) {
                    if (!Cookies.get('residence') && response.get_settings.country_code) {
                      page.client.set_cookie('residence', response.get_settings.country_code);
                      page.client.residence = response.get_settings.country_code;
                      send({landing_company: Cookies.get('residence')});
                    }
                    GTM.event_handler(response.get_settings);
                    page.client.set_storage_value('tnc_status', response.get_settings.client_tnc_status || '-');
                    if (!localStorage.getItem('risk_classification')) page.client.check_tnc();
                    var jpStatus = response.get_settings.jp_account_status;
                    if (jpStatus) {
                        switch (jpStatus.status) {
                            case 'jp_knowledge_test_pending': localStorage.setItem('jp_test_allowed', 1);
                                break;
                            case 'jp_knowledge_test_fail':
                                if (Date.now() >= (jpStatus.next_test_epoch * 1000)) {
                                    localStorage.setItem('jp_test_allowed', 1);
                                } else {
                                    localStorage.setItem('jp_test_allowed', 0);
                                }
                                break;
                            default: localStorage.setItem('jp_test_allowed', 0);
                        }

                        KnowledgeTest.showKnowledgeTestTopBarIfValid(jpStatus);
                    } else {
                        localStorage.removeItem('jp_test_allowed');
                    }
                    page.header.menu.check_payment_agent(response.get_settings.is_authenticated_payment_agent);
                } else if (type === 'website_status') {
                    if(!response.hasOwnProperty('error')) {
                        LocalStore.set('website.tnc_version', response.website_status.terms_conditions_version);
                        if (!localStorage.getItem('risk_classification')) page.client.check_tnc();
                        if (response.website_status.hasOwnProperty('clients_country')) {
                            localStorage.setItem('clients_country', response.website_status.clients_country);
                            if (!$('body').hasClass('BlueTopBack')) {
                                checkClientsCountry();
                            }
                        }
                    }
                } else if (type === 'reality_check') {
                    RealityCheck.realityCheckWSHandler(response);
                } else if (type === 'get_account_status' && response.get_account_status) {
                  if (response.get_account_status.risk_classification === 'high' && page.header.qualify_for_risk_classification()) {
                    send({get_financial_assessment: 1});
                  } else {
                    localStorage.removeItem('risk_classification');
                    page.client.check_tnc();
                  }
                  localStorage.setItem('risk_classification.response', response.get_account_status.risk_classification);

                  sessionStorage.setItem('client_status', response.get_account_status.status);
                  page.show_authenticate_message();

                  if (response.echo_req.hasOwnProperty('passthrough') && response.echo_req.passthrough.hasOwnProperty('dispatch_to')) {
                    if (response.echo_req.passthrough.dispatch_to === 'ForwardWS') {
                        BinarySocket.send({"cashier_password": "1"});
                    } else if (response.echo_req.passthrough.dispatch_to === 'Cashier') {
                        Cashier.check_locked();
                    } else if (response.echo_req.passthrough.dispatch_to === 'PaymentAgentWithdrawWS') {
                      PaymentAgentWithdrawWS.lock_withdrawal(page.client_status_detected('withdrawal_locked, cashier_locked', 'any') ? 'locked' : 'unlocked');
                    }
                  }
                } else if (type === 'get_financial_assessment' && !response.hasOwnProperty('error')) {
                  if (objectNotEmpty(response.get_financial_assessment)) {
                    if (page.header.qualify_for_risk_classification() && localStorage.getItem('risk_classification.response') === 'high') {
                      localStorage.setItem('risk_classification', 'high');
                      page.header.check_risk_classification();
                    }
                  } else if ((localStorage.getItem('reality_check.ack') === '1' || !localStorage.getItem('reality_check.interval')) && localStorage.getItem('risk_classification') !== 'high') {
                    localStorage.removeItem('risk_classification');
                    localStorage.removeItem('risk_classification.response');
                    page.client.check_tnc();
                  }
                }
                if (response.hasOwnProperty('error')) {
                    if(response.error && response.error.code) {
                      if (response.error.code && (response.error.code === 'WrongResponse' || response.error.code === 'OutputValidationFailed')) {
                        $('#content').empty().html('<div class="container"><p class="notice-msg center-text">' + (response.error.code === 'WrongResponse' && response.error.message ? response.error.message : text.localize('Sorry, an error occurred while processing your request.') )+ '</p></div>');
                      } else if (response.error.code === 'RateLimit') {
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
                            page.client.send_logout_request();
                      } else if (response.error.code === 'InvalidAppID') {
                          wrongAppId = getAppId();
                          alert(response.error.message);
                      }
                    }
                }
                if(typeof events.onmessage === 'function'){
                    events.onmessage(msg);
                }
            }
        };

        binarySocket.onclose = function (e) {
            authorized = false;
            clearTimeouts();

            if(!manualClosed && wrongAppId !== getAppId()) {
                if (TradePage.is_trading_page) {
                    showPriceOverlay();
                    showFormOverlay();
                    TradePage.onLoad();
                } else {
                    init(1);
                }
            }
            if(typeof events.onclose === 'function'){
                events.onclose();
            }
        };

        binarySocket.onerror = function (error) {
            console.log('socket error', error);
        };
    };

    var close = function () {
        manualClosed = true;
        bufferedSends = [];
        events = {};
        if (binarySocket) {
            binarySocket.close();
        }
    };

    var clear = function(){
        bufferedSends = [];
        manualClosed = false;
        events = {};
    };

    return {
        init: init,
        send: send,
        close: close,
        socket: function () { return binarySocket; },
        clear: clear,
        clearTimeouts: clearTimeouts
    };

}

var BinarySocket = new BinarySocketClass();

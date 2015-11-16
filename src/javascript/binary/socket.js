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
var BinarySocket = (function () {
    'use strict';

    var binarySocket,
        socketUrl = "wss://"+window.location.host+"/websockets/v3",
        bufferedSends = [],
        manualClosed = false,
        events = {},
        authorized = false;

    if (page.language()) {
        socketUrl += '?l=' + page.language();
    }

    var status = function () {
        return binarySocket && binarySocket.readyState;
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
        } else if (isReady() && (authorized || TradePage.is_trading_page())) {
            binarySocket.send(JSON.stringify(data));
        } else {
            bufferedSends.push(data);
        }
    };

    var init = function (es) {

        if(!es){
            events = {};
        }
        if(typeof es === 'object'){
            bufferedSends = [];
            manualClosed = false;
            events = es;
        }

        if(isClose()){
            binarySocket = new WebSocket(socketUrl);
        }
        
        binarySocket.onopen = function (){

            var loginToken = getCookieItem('login');
            if(loginToken) {
                binarySocket.send(JSON.stringify({authorize: loginToken}));
            }
            else {
                sendBufferedSends();
            }

            if(typeof events.onopen === 'function'){
                events.onopen();
            }
        };

        binarySocket.onmessage = function (msg){

            var response = JSON.parse(msg.data);
            if (response) {
                var type = response.msg_type;
                if (type === 'authorize') {
                    authorized = true;
                    TUser.set(response.authorize);
                    if(typeof events.onauth === 'function'){
                        events.onauth();
                    }
                    send({balance:1, subscribe: 1});
                    sendBufferedSends();
                } else if (type === 'balance') {
                    ViewBalanceUI.updateBalances(response.balance);
                }

                if(typeof events.onmessage === 'function'){
                    events.onmessage(msg);
                }
            }
        };

        binarySocket.onclose = function (e) {

            authorized = false;

            if(!manualClosed){
                init(1);
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
        isAuthorized: function(){ return authorized; }
    };

})();

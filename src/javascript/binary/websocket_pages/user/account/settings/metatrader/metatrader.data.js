var MetaTraderData = (function() {
    "use strict";

    var initSocket = function() {
        BinarySocket.init({
            onmessage: function(msg) {
                var response = JSON.parse(msg.data);
                if (response) {
                    MetaTraderData.responseHandler(response);
                }
            }
        });
    };

    var requestLoginList = function() {
        BinarySocket.send({'mt5_login_list': 1});
    };

    var requestLoginDetails = function(login) {
        if(login && +login > 0) {
            BinarySocket.send({'mt5_get_settings': 1, 'login': login});
        }
    };

    var requestPasswordCheck = function(login, password) {
        if(login && +login > 0 && password && password.length > 0) {
            BinarySocket.send({'mt5_password_check': 1, 'login': login, 'password': password});
        }
    };

    var requestSend = function(request) {
        BinarySocket.send(request);
    };

    var requestAccountStatus = function() {
        BinarySocket.send({'get_account_status': 1});
    };

    var requestLandingCompany = function() {
        BinarySocket.send({'landing_company': page.client.residence});
    };

    var responseHandler = function(response) {
        switch(response.msg_type) {
            case 'authorize':
                MetaTraderUI.init();
                break;
            case 'get_account_status':
                MetaTraderUI.responseAccountStatus(response);
                break;
            case 'landing_company':
                MetaTraderUI.responseLandingCompany(response);
                break;
            case 'mt5_login_list':
                MetaTraderUI.responseLoginList(response);
                break;
            case 'mt5_get_settings':
                MetaTraderUI.responseLoginDetails(response);
                break;
            case 'mt5_new_account':
                MetaTraderUI.responseNewAccount(response);
                break;
            case 'mt5_deposit':
                MetaTraderUI.responseDeposit(response);
                break;
            case 'mt5_withdrawal':
                MetaTraderUI.responseWithdrawal(response);
                break;
            case 'mt5_password_check':
                MetaTraderUI.responsePasswordCheck(response);
                break;
        }
    };

    return {
        initSocket           : initSocket,
        responseHandler      : responseHandler,
        requestLoginList     : requestLoginList,
        requestLoginDetails  : requestLoginDetails,
        requestPasswordCheck : requestPasswordCheck,
        requestSend          : requestSend,
        requestAccountStatus : requestAccountStatus,
        requestLandingCompany: requestLandingCompany,
    };
}());

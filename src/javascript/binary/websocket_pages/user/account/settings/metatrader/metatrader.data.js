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
        if(login && login.length) {
            BinarySocket.send({'mt5_get_settings': 1, 'login': login});
        }
    };

    var requestNewAccount = function(request) {
        BinarySocket.send(request);
    };

    var responseHandler = function(response) {
        switch(response.msg_type) {
            case 'authorize':
                MetaTraderUI.init();
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
        }
    };

    return {
        initSocket          : initSocket,
        responseHandler     : responseHandler,
        requestLoginList    : requestLoginList,
        requestLoginDetails : requestLoginDetails,
        requestNewAccount   : requestNewAccount,
    };
}());

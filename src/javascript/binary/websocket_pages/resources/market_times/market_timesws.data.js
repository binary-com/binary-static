var MarketTimesData = (function() {
    "use strict";

    var initSocket = function() {
        if (TradePage_Beta.is_trading_page()) return;
        BinarySocket.init({
            onmessage: function(msg) {
                var response = JSON.parse(msg.data);
                if (response) {
                    MarketTimesData.responseHandler(response);
                }
            }
        });
    };

    var sendRequest = function(date, shouldRequestActiveSymbols) {
        initSocket();
        var req = {"active_symbols": "brief"};
        if (japanese_client()) {
            req.landing_company = 'japan';
        }
        if(shouldRequestActiveSymbols) {
            BinarySocket.send(req);
        }

        BinarySocket.send({"trading_times": date || 'today'});
    };

    var responseHandler = function(response) {
        var msg_type = response.msg_type;
        if (msg_type === "trading_times") {
            MarketTimesUI.setTradingTimes(response);
        }
        else if (msg_type === "active_symbols") {
            MarketTimesUI.setActiveSymbols(response);
        }
    };

    return {
        sendRequest: sendRequest,
        responseHandler: responseHandler
    };
}());

module.exports = {
    MarketTimesData: MarketTimesData,
};

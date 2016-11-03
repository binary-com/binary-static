var MarketTimesData = (function() {
    "use strict";

    var sendRequest = function(date, shouldRequestActiveSymbols) {
        var req = {"active_symbols": "brief"};
        if (japanese_client()) {
            req.landing_company = 'japan';
        }
        if(shouldRequestActiveSymbols) {
            BinarySocket.send(req);
        }
        BinarySocket.send({"trading_times": date || 'today'});
    };

    return {
        sendRequest: sendRequest,
    };
}());

module.exports = {
    MarketTimesData: MarketTimesData,
};

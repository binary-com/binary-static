var AssetIndexData = (function() {
    "use strict";

    var initSocket = function() {
        BinarySocket.init({
            onmessage: function(msg) {
                var response = JSON.parse(msg.data);
                if (response) {
                    AssetIndexData.responseHandler(response);
                }
            }
        });
    };

    var sendRequest = function() {
        initSocket();

        BinarySocket.send({"active_symbols": "brief"});
        BinarySocket.send({"asset_index": 1});
    };

    var responseHandler = function(response) {
        var msg_type = response.msg_type;
        if (msg_type === "asset_index") {
            AssetIndexUI.setAssetIndex(response);
        }
        else if (msg_type === "active_symbols") {
            AssetIndexUI.setActiveSymbols(response);
        }
    };

    return {
        sendRequest: sendRequest,
        responseHandler: responseHandler
    };
}());

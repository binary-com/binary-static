const AssetIndexData = (function() {
    'use strict';

    const sendRequest = function(shouldRequestActiveSymbols) {
        if (shouldRequestActiveSymbols) {
            BinarySocket.send({ active_symbols: 'brief' });
        }
        BinarySocket.send({ asset_index: 1 });
    };

    return {
        sendRequest: sendRequest,
    };
})();

module.exports = {
    AssetIndexData: AssetIndexData,
};

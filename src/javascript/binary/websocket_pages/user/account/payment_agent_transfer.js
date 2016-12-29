var PaymentAgentTransfer = require('./payment_agent_transfer/payment_agent_transfer.init').PaymentAgentTransfer;
var Content              = require('../../../common_functions/content').Content;
var Client               = require('../../../base/client').Client;

var PaymentAgentTransferSocket = (function() {
    function initSocket() {
        BinarySocket.init({
            onmessage: function(msg) {
                var response = JSON.parse(msg.data);

                if (response) {
                    PaymentAgentTransfer.handleResponse(response);
                }
            },
        });
        Content.populate();
        PaymentAgentTransfer.init_variable();
        if (Client.get_value('email')) {
            PaymentAgentTransfer.init();
        }
    }
    return {
        initSocket: initSocket,
    };
})();

module.exports = {
    PaymentAgentTransferSocket: PaymentAgentTransferSocket,
};

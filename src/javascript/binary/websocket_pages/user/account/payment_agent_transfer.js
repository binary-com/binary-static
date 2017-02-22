const PaymentAgentTransfer = require('./payment_agent_transfer/payment_agent_transfer.init').PaymentAgentTransfer;
const Content              = require('../../../common_functions/content').Content;
const Client               = require('../../../base/client').Client;

const PaymentAgentTransferSocket = (function() {
    const onLoad = function() {
        BinarySocket.init({
            onmessage: function(msg) {
                const response = JSON.parse(msg.data);

                if (response) {
                    PaymentAgentTransfer.handleResponse(response);
                }
            },
        });
        Content.populate();
        PaymentAgentTransfer.init_variable();
        if (Client.get('email')) {
            PaymentAgentTransfer.init();
        }
    };

    return {
        onLoad: onLoad,
    };
})();

module.exports = PaymentAgentTransferSocket;

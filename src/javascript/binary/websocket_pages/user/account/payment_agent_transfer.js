var Content = require('trade/content');
var PaymentAgentTransfer = require('./payment_agent_transfer/payment_agent_transfer.init');
var pjax_config_page_require_auth = require('base/pjax').pjax_config_page_require_auth;
var TUser = require('binary/base').TUser;

pjax_config_page_require_auth("paymentagent/transferws", function(){
    return {
        onLoad: function() {
            BinarySocket.init({
                onmessage: function(msg){
                    var response = JSON.parse(msg.data);

                    if (response) {
                        PaymentAgentTransfer.handleResponse(response);
                    }
                }
            });
            Content.populate();
            PaymentAgentTransfer.init_variable();
            if (TUser.get().email) {
                PaymentAgentTransfer.init();
            }
        }
    };
});

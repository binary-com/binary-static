pjax_config_page_require_auth("paymentagent/transferws", function(){
    return {
        onLoad: function() {
            BinarySocket.init({
                onmessage: function(msg){
                    var response = JSON.parse(msg.data);

                    if (response) {
                        var type = response.msg_type;
                        if (type === 'authorize') {
                            PaymentAgentTransfer.init(true);
                        }

                        if (type === 'paymentagent_transfer'){
                            PaymentAgentTransfer.paymentAgentTransferHandler(response);
                        }
                    }
                }
            });
            Content.populate();

            if (TUser.get().email) {
                PaymentAgentTransfer.init();
            }
        }
    };
});
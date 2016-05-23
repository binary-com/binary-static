pjax_config_page_require_auth("paymentagent/transferws", function(){
    return {
        onLoad: function() {
            if (page.client.is_virtual()) {
              $('#virtual_error').removeClass('invisible');
              return;
            } else {
              $('#paymentagent_transfer').removeClass('invisible');
              $('#paymentagent_transfer_notes').removeClass('invisible');
            }
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

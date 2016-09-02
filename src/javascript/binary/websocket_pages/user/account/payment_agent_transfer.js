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

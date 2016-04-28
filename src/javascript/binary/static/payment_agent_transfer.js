pjax_config_page("paymentagent/transferws", function(){
    return {
        onLoad: function() {
            if (!getCookieItem('login')) {
                window.location.href = page.url.url_for('login');
                return;
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
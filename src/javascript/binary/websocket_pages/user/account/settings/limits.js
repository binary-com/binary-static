pjax_config_page_require_auth("limitsws", function(){
    return {
        onLoad: function() {
            Content.populate();
            Content.limitsTranslation();
            if (TUser.get().is_virtual) {
                LimitsWS.limitsError();
                return;
            }
            document.getElementById('client_message').setAttribute('style', 'display:none');

            BinarySocket.init({
                onmessage: function(msg){
                    var response = JSON.parse(msg.data);
                    if (response) {
                        var type = response.msg_type;
                        var error = response.error;

                        if (type === 'authorize' && TUser.get().is_virtual){
                            LimitsWS.limitsError();
                        } else if (type === 'get_limits' && !error){
                            LimitsWS.limitsHandler(response);
                        } else if (error) {
                            LimitsWS.limitsError();
                        }
                    }
                }
            });

            BinarySocket.send({get_limits: 1});
        },
        onUnload: function(){
            LimitsWS.clean();
        }
    };
});

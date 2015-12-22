pjax_config_page("limitws", function(){
    return {
        onLoad: function() {
            Content.populate();
            document.getElementById('client_message').setAttribute('style', 'display:none');

            BinarySocket.init({
                onmessage: function(msg){
                    var response = JSON.parse(msg.data);

                    if (/^VRT/.test(TUser.get().loginid)) {
                        LimitsWS.limitsError();
                    } else if (response && !/^VRT/.test(TUser.get().loginid)) {
                        var type = response.msg_type;
                        var error = response.error;

                        if (type === 'get_limits' && !error){
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

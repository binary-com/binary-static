pjax_config_page_require_auth("user/iphistoryws", function(){
    return {
        onLoad: function() {
            BinarySocket.init({
                onmessage: function(msg){
                    var response = JSON.parse(msg.data);

                    if (response) {
                        var type = response.msg_type;
                        if (type === 'login_history'){
                            IPHistory.responseHandler(response);
                        }
                    }
                }
            });
            Content.populate();
            IPHistory.init();
        },
        onUnload: function(){
            IPHistory.clean();
        }
    };
});

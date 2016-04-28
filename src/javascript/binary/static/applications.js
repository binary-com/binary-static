pjax_config_page("user/applicationsws", function(){
    return {
        onLoad: function() {
            if (page.client.redirect_if_logout()) {
                return;
            }
            BinarySocket.init({
                onmessage: function(msg){
                    var response = JSON.parse(msg.data);

                    if (response) {
                        var type = response.msg_type;
                        if (type === 'oauth_apps'){
                            Applications.responseHandler(response);
                        }
                    }
                }
            });
            Content.populate();
            Applications.init();
        },
        onUnload: function(){
            Applications.clean();
        }
    };
});

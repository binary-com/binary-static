pjax_config_page_require_auth("user/settings/authorised_appsws", function(){
    return {
        onLoad: function() {
            if (japanese_client()) {
                window.location.href = page.url.url_for('user/settingsws');
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

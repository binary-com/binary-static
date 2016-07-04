pjax_config_page_require_auth("user/settings/iphistoryws", function(){
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

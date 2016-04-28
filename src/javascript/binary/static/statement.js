pjax_config_page("user/statement", function(){
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
                        if (type === 'statement'){
                            StatementWS.statementHandler(response);
                        }
                    }
                }
            });
            Content.populate();
            StatementWS.init();
        },
        onUnload: function(){
            StatementWS.clean();
        }
    };
});

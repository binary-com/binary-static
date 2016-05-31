pjax_config_page_require_auth("user/statement", function(){
    return {
        onLoad: function() {
            BinarySocket.init({
                onmessage: function(msg){
                    var response = JSON.parse(msg.data);

                    if (response) {
                        var type = response.msg_type;
                        if (type === 'statement'){
                            StatementWS.statementHandler(response);
                            showLocalTimeOnHover('td.date');
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

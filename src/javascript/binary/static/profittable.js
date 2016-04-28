

pjax_config_page("user/profit_table", function(){
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
                        if (type === 'profit_table'){
                            ProfitTableWS.profitTableHandler(response);
                        }
                    }
                }
            });
            Content.populate();
            ProfitTableWS.init();
        },
        onUnload: function(){
            ProfitTableWS.clean();
        }
    };
});

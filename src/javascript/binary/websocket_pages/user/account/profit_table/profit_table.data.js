var ProfitTableData = (function(){

    function initSocket(){
        BinarySocket.init({
            onmessage: function(msg){
                var response = JSON.parse(msg.data);

                if (response) {
                    var type = response.msg_type;
                    if (type === 'profit_table'){
                        ProfitTableWS.profitTableHandler(response);
                        showLocalTimeOnHover('td.buy-date,td.sell-date');
                    } else if (type === 'oauth_apps') {
                        addTooltip(ProfitTableUI.setOauthApps(buildOauthApps(response.oauth_apps)));
                    }
                }
            }
        });
        BinarySocket.send({'oauth_apps': 1});
    }

    function getProfitTable(opts){
        var req = {profit_table: 1, description: 1};
        if(opts){
            $.extend(true, req, opts);
        }

        BinarySocket.send(req);
    }

    return {
        getProfitTable: getProfitTable,
        initSocket: initSocket
    };
}());

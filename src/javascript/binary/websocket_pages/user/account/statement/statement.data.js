var app_details = require('../../../../common_functions/get_app_details');
var StatementUI = require('./statement.ui');
var StatementWS = require('./statement.init');

var StatementData = (function(){
    var hasOlder = true;

    function initSocket(){
        BinarySocket.init({
            onmessage: function(msg){
                var response = JSON.parse(msg.data);
                if (response) {
                    var type = response.msg_type;
                    if (type === 'statement'){
                        StatementWS.statementHandler(response);
                    } else if (type === 'oauth_apps') {
                        app_details.addTooltip(StatementUI.setOauthApps(app_details.build(response.oauth_apps)));
                    }
                }
            }
        });
        BinarySocket.send({'oauth_apps': 1});
    }

    function getStatement(opts){
        var req = {statement: 1, description: 1};
        if(opts){
            $.extend(true, req, opts);
        }

        BinarySocket.send(req);
    }

    return {
        initSocket: initSocket,
        getStatement: getStatement,
        hasOlder: hasOlder
    };
}());

module.exports = StatementData;

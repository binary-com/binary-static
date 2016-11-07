var buildOauthApps = require('../../../../common_functions/get_app_details').buildOauthApps;
var addTooltip = require('../../../../common_functions/get_app_details').addTooltip;
var japanese_client = require('../../../../common_functions/country_base').japanese_client;
var StatementUI = require('./statement.ui').StatementUI;
var StatementWS = require('./statement.init').StatementWS;

var StatementData = (function(){

    function initSocket(){
        BinarySocket.init({
            onmessage: function(msg){
                var response = JSON.parse(msg.data);
                if (response) {
                    var type = response.msg_type;
                    if (type === 'statement'){
                        StatementWS.statementHandler(response);
                    } else if (type === 'oauth_apps') {
                        addTooltip(StatementUI.setOauthApps(buildOauthApps(response.oauth_apps)));
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
        var jump_to = $('#jump-to').val();
        if (jump_to !== '' && jump_to !== page.text.localize('Today')) {
            req.date_to = Math.floor((moment.utc(jump_to).valueOf() / 1000)) +
                          ((japanese_client() ? 15 : 24) * (60*60));
            req.date_from = 0;
        }

        BinarySocket.send(req);
    }

    return {
        initSocket: initSocket,
        getStatement: getStatement,
    };
}());

module.exports = {
    StatementData: StatementData,
};

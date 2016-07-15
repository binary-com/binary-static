var ApplicationsData = (function(){
    "use strict";

    function calls(callback) {
        return function(msg) {
            var response = JSON.parse(msg.data);
            if (!response || response.msg_type !== 'oauth_apps') {
                return;
            }
            callback(response);
        };
    }

    function list() {
        BinarySocket.send({oauth_apps: 1});
    }

    function revoke(id) {
        if (!id) return;
        BinarySocket.send({oauth_apps: 1, revoke_app: id});
    }

    function parse(app) {
        var last = app.last_used ? moment.utc(app.last_used) : null;
        return {
            name: app.name,
            scopes: app.scopes,
            last_used: last,
            id: app.app_id,
        };
    }

    return {
        parse: parse,
        calls: calls,
        revoke: revoke,
        list: list,
    };
}());

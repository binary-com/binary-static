const moment = require('moment');

const ConnectionsData = (function() {
    'use strict';

    const calls = function(callback) {
        return function(msg) {
            const response = JSON.parse(msg.data);
            if (!response || response.msg_type !== 'connect_list') {
                return;
            }
            callback(response);
        };
    };

    const list = function() {
        BinarySocket.send({ connect_list: 1 });
    };

    const del = function(provider) {
        if (!provider) return;
        BinarySocket.send({ connect_del: 1, provider: provider });
    };

    const parse = function(app) {
        const last = app.last_used ? moment.utc(app.last_used) : null;
        return {
            name     : app.name,
            scopes   : app.scopes,
            last_used: last,
            id       : app.app_id,
        };
    };

    return {
        parse: parse,
        calls: calls,
        del  : del,
        list : list,
    };
})();

module.exports = {
    ConnectionsData: ConnectionsData,
};

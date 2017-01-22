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

    const add = function(connection_token) {
        BinarySocket.send({ connection_add: 1, connection_token: connection_token });
    };

    const del = function(provider) {
        if (!provider) return;
        BinarySocket.send({ connect_del: 1, provider: provider });
    };

    return {
        calls: calls,
        add  : add,
        del  : del,
        list : list,
    };
})();

module.exports = {
    ConnectionsData: ConnectionsData,
};

const ConnectionsUI   = require('./connections.ui').ConnectionsUI;
const ConnectionsData = require('./connections.data').ConnectionsData;

const Connections = (function() {
    'use strict';

    const responseHandler = function(response) {
        if (response.error && response.error.message) {
            return ConnectionsUI.displayError(response.error.message);
        }
        const apps = response.oauth_apps.map(ConnectionsData.parse);
        return ConnectionsUI.update(apps);
    };

    const init = function() {
        ConnectionsUI.init();
        BinarySocket.init({
            onmessage: ConnectionsData.calls(responseHandler),
        });
        ConnectionsData.list();
    };

    const clean = function() {
        ConnectionsUI.clean();
    };

    return {
        init : init,
        clean: clean,
    };
})();

module.exports = {
    Connections: Connections,
};

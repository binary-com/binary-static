const Content         = require('../../../../common_functions/content').Content;
const Connections     = require('./connections/connections.init').Connections;

const UserConnections = (function() {
    const onLoad = function() {
        Content.populate();
        Connections.init();
    };

    const onUnload = function() {
        Connections.clean();
    };

    return {
        onLoad  : onLoad,
        onUnload: onUnload,
    };
})();

module.exports = {
    UserConnections: UserConnections,
};

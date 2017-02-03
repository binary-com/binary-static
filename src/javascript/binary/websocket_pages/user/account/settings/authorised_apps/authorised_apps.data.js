const moment = require('moment');

const ApplicationsData = (function() {
    'use strict';

    const calls = function(callback) {
        return function(msg) {
            const response = JSON.parse(msg.data);
            if (!response || response.msg_type !== 'oauth_apps') {
                return;
            }
            callback(response);
        };
    };

    const list = function() {
        BinarySocket.send({ oauth_apps: 1 });
    };

    const revoke = function(id) {
        if (!id) return;
        BinarySocket.send({ oauth_apps: 1, revoke_app: id });
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
        parse : parse,
        calls : calls,
        revoke: revoke,
        list  : list,
    };
})();

module.exports = {
    ApplicationsData: ApplicationsData,
};

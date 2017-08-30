const moment = require('moment');

const ApplicationsData = (() => {
    const parse = (app) => {
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
    };
})();

module.exports = ApplicationsData;

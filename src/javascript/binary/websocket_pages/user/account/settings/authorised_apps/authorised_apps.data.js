var ApplicationsData = (function(){
    "use strict";

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
        parse: parse
    };
}());

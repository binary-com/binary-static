const localize = require('../base/localize').localize;

const buildOauthApps = function(data) {
    const oauth_apps = {};
    if (data) {
        for (let i = 0; i < data.length; i++) {
            oauth_apps[data[i].app_id] = data[i].name;
        }
    }
    oauth_apps[2] = 'Binary.com Autoexpiry';
    return oauth_apps;
};

const addTooltip = function(oauth_apps) {
    const keys = Object.keys(oauth_apps);
    keys.forEach(function(key) {
        if (oauth_apps.hasOwnProperty(key)) {
            $('.' + key).attr('data-balloon', add_app_id_name(key, oauth_apps[key]));
        }
    });
};

const add_app_id_name = function(app_id, app_name) {
    let ref_string;
    if (app_id) {
        ref_string = localize('Transaction performed by [_1] (App ID: [_2])', [app_name || '', app_id]);
    }
    return ref_string;
};

const showTooltip = function(app_id, oauth_app_id) {
    return (
        app_id ?
            ' class="' + app_id + '" data-balloon="' + (
                oauth_app_id ?
                    add_app_id_name(app_id, oauth_app_id) :
                        app_id ?
                            add_app_id_name(app_id) :
                            ''
            ) + '"'
        : ''
    );
};

module.exports = {
    buildOauthApps: buildOauthApps,
    addTooltip    : addTooltip,
    showTooltip   : showTooltip,
};

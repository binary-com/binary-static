var template = require('../base/utility').template;

var buildOauthApps = function(data) {
    var oauth_apps = {};
    if (data) {
        for (var i = 0; i < data.length; i++) {
            oauth_apps[data[i].app_id] = data[i].name;
        }
    }
    oauth_apps[2] = 'Binary.com Autoexpiry';
    return oauth_apps;
};

var addTooltip = function(oauth_apps) {
    var keys = Object.keys(oauth_apps);
    keys.forEach(function(key) {
        if (oauth_apps.hasOwnProperty(key)) {
            $('.' + key).attr('data-balloon', add_app_id_name(key, oauth_apps[key]));
        }
    });
};

var add_app_id_name = function(app_id, app_name) {
    var ref_string;
    if (app_id) {
        ref_string = template(page.text.localize('Transaction performed by [_1] (App ID: [_2])'), [app_name || '', app_id]);
    }
    return ref_string;
};

var showTooltip = function(app_id, oauth_app_id) {
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

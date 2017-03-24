const localize = require('../base/localize').localize;

const buildOauthApps = (response) => {
    if (!response || !response.oauth_apps) return {};
    const obj_oauth_apps = {};
    response.oauth_apps.forEach((app) => {
        obj_oauth_apps[app.app_id] = app.name;
    });
    obj_oauth_apps[2] = 'Binary.com Autoexpiry';
    return obj_oauth_apps;
};

const addTooltip = (oauth_apps) => {
    Object.keys(oauth_apps).forEach((key) => {
        $(`.${key}`).attr('data-balloon', addAppIdName(key, oauth_apps[key]));
    });
};

const addAppIdName = (app_id, app_name) => (
    app_id ? localize('Transaction performed by [_1] (App ID: [_2])', [app_name || '', app_id]) : ''
);

const showTooltip = (app_id, oauth_app_id) => (
    app_id ? ` class="${app_id}" data-balloon="${addAppIdName(app_id, oauth_app_id)}"` : ''
);

module.exports = {
    buildOauthApps: buildOauthApps,
    addTooltip    : addTooltip,
    showTooltip   : showTooltip,
};

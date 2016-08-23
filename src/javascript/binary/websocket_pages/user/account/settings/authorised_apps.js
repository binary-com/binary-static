var Applications = require('websocket_pages/user/account/settings/authorised_apps');
var Content = require('trade/content');
var pjax_config_page_require_auth = require('base/pjax').pjax_config_page_require_auth;

pjax_config_page_require_auth("user/settings/authorised_appsws", function(){
    return {
        onLoad: function() {
            if (japanese_client()) {
                window.location.href = page.url.url_for('user/settingsws');
            }
            Content.populate();
            Applications.init();
        },
        onUnload: function(){
            Applications.clean();
        }
    };
});

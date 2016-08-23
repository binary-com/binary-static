var IPHistory = require('./iphistory/iphistory.init');
var Content = require('trade/content');
var pjax_config_page_require_auth = require('base/pjax').pjax_config_page_require_auth;

pjax_config_page_require_auth("user/settings/iphistoryws", function(){
    return {
        onLoad: function() {
            if (japanese_client()) {
                window.location.href = page.url.url_for('user/settingsws');
            }
            Content.populate();
            IPHistory.init();
        },
        onUnload: function(){
            IPHistory.clean();
        }
    };
});

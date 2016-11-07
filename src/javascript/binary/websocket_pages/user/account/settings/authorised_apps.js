var japanese_client = require('../../../../common_functions/country_base').japanese_client;

pjax_config_page_require_auth("user/security/authorised_appsws", function(){
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

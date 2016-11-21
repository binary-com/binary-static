var japanese_client = require('../../../common_functions/country_base').japanese_client;

var SettingsWS = (function() {
    "use strict";

    var init = function() {
        var classHidden = 'invisible',
            classReal   = '.real';

        if(!page.client.is_virtual()) {
            // control-class is a fake class, only used to counteract ja-hide class
            $(classReal).not((japanese_client() ? ".ja-hide" : ".control-class")).removeClass(classHidden);
        }
        else {
            $(classReal).addClass(classHidden);
        }

        $('#settingsContainer').removeClass(classHidden);
    };

    var onLoad = function() {
        if(page.client.get_storage_value('is_virtual').length === 0) {
            BinarySocket.init({
                onmessage: function(msg) {
                    var response = JSON.parse(msg.data);
                    if (response && response.msg_type === 'authorize') {
                        SettingsWS.init();
                    }
                }
            });
        }
        else {
            SettingsWS.init();
        }
    };

    return {
        init: init,
        onLoad: onLoad,
    };
}());

module.exports = {
    SettingsWS: SettingsWS,
};

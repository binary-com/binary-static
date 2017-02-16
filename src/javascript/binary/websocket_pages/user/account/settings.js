const japanese_client = require('../../../common_functions/country_base').japanese_client;
const Client          = require('../../../base/client').Client;

const SettingsWS = (function() {
    'use strict';

    const init = function() {
        const classHidden = 'invisible',
            classReal   = '.real';

        if (!Client.get('is_virtual')) {
            // control-class is a fake class, only used to counteract ja-hide class
            $(classReal).not((japanese_client() ? '.ja-hide' : '.control-class')).removeClass(classHidden);
        } else {
            $(classReal).addClass(classHidden);
        }

        if (Client.get('has_password')) {
            $('#change_password').removeClass(classHidden);
        }

        $('#settingsContainer').removeClass(classHidden);
    };

    const onLoad = function() {
        if (!Client.get('values_set')) {
            BinarySocket.init({
                onmessage: function(msg) {
                    const response = JSON.parse(msg.data);
                    if (response && response.msg_type === 'authorize') {
                        SettingsWS.init();
                    }
                },
            });
        } else {
            SettingsWS.init();
        }
    };

    return {
        init  : init,
        onLoad: onLoad,
    };
})();

module.exports = {
    SettingsWS: SettingsWS,
};

const japanese_client = require('../../../common_functions/country_base').japanese_client;
const Client          = require('../../../base/client').Client;

const SettingsWS = (function() {
    'use strict';

    const onLoad = function() {
        BinarySocket.wait('authorize', 'get_account_status').then(() => {
            const classHidden = 'invisible';
            const classReal   = '.real';

            if (Client.get('is_virtual')) {
                $(classReal).addClass(classHidden);
            } else {
                $(classReal).not((japanese_client() ? '.ja-hide' : '')).removeClass(classHidden);
            }

            if (Client.get('has_password')) {
                $('#change_password').removeClass(classHidden);
            }

            $('#settingsContainer').removeClass(classHidden);
        });
    };

    return {
        onLoad: onLoad,
    };
})();

module.exports = {
    SettingsWS: SettingsWS,
};

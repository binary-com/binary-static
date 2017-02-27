const japanese_client = require('../../../common_functions/country_base').japanese_client;
const Client          = require('../../../base/client').Client;

const Settings = (function() {
    'use strict';

    const onLoad = function() {
        BinarySocket.wait('get_account_status').then((response) => {
            const classHidden = 'invisible';
            const classReal   = '.real';

            if (Client.get('is_virtual')) {
                $(classReal).addClass(classHidden);
            } else {
                $(classReal).not((japanese_client() ? '.ja-hide' : '')).removeClass(classHidden);
            }

            if (/has_password/.test(response.get_account_status.status)) {
                $('#change_password').removeClass(classHidden);
            }

            $('#settingsContainer').removeClass(classHidden);
        });
    };

    return {
        onLoad: onLoad,
    };
})();

module.exports = Settings;

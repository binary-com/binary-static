const japanese_client = require('../../../common_functions/country_base').japanese_client;
const Client          = require('../../../base/client').Client;

const Settings = (function() {
    'use strict';

    const onLoad = function() {
        BinarySocket.wait('get_account_status').then((response) => {
            const class_hidden = 'invisible';
            const class_real   = '.real';

            if (Client.get('is_virtual')) {
                $(class_real).addClass(class_hidden);
            } else {
                $(class_real).not((japanese_client() ? '.ja-hide' : '')).removeClass(class_hidden);
            }

            if (/has_password/.test(response.get_account_status.status)) {
                $('#change_password').removeClass(class_hidden);
            }

            $('#settingsContainer').removeClass(class_hidden);
        });
    };

    return {
        onLoad: onLoad,
    };
})();

module.exports = Settings;

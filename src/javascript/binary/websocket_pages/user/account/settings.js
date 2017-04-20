import Client from '../../../base/client';
import { jpClient } from '../../../common_functions/country_base';

const Settings = (() => {
    'use strict';

    const onLoad = () => {
        BinarySocket.wait('get_account_status').then((response) => {
            const class_hidden = 'invisible';
            const class_real = '.real';

            if (Client.get('is_virtual')) {
                $(class_real).addClass(class_hidden);
            } else {
                $(class_real).not(jpClient() ? '.ja-hide' : '').removeClass(class_hidden);
            }

            if (/has_password/.test(response.get_account_status.status)) {
                $('#change_password').removeClass(class_hidden);
            }

            $('#settings_container').removeClass(class_hidden);
        });
    };

    return {
        onLoad: onLoad,
    };
})();

module.exports = Settings;

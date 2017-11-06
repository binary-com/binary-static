const BinarySocket     = require('../../socket');
const Client           = require('../../../base/client');
const getPropertyValue = require('../../../base/utility').getPropertyValue;
const jpClient         = require('../../../common_functions/country_base').jpClient;

const Settings = (() => {
    const onLoad = () => {
        BinarySocket.wait('get_account_status').then((response) => {
            const $class_real = $('.real');
            const is_jp       = jpClient();

            if (Client.get('is_virtual')) {
                $class_real.setVisibility(0);
            } else {
                $class_real.not((is_jp ? '.ja-hide' : '')).setVisibility(1);
            }

            const get_account_status = getPropertyValue(response, 'get_account_status');
            const status             = getPropertyValue(get_account_status, 'status');
            if (!/social_signup/.test(status)) {
                $('#change_password').setVisibility(1);
            }

            // Professional Client menu should only be shown to MF and CR accounts.
            if (!is_jp && !/professional_requested/.test(status)
                && !Client.isAccountOfType('gaming')) {
                $('#professional_client').setVisibility(1);
            }

            if (!get_account_status.prompt_client_to_authenticate) {
                $('#authenticate').setVisibility(0);
            }

            $('#settings_container').setVisibility(1);
        });
    };

    return {
        onLoad,
    };
})();

module.exports = Settings;

const Client           = require('../../../base/client');
const BinarySocket     = require('../../../base/socket');
const jpClient         = require('../../../common/country_base').jpClient;
const State            = require('../../../../_common/storage').State;

const Settings = (() => {
    const onLoad = () => {
        BinarySocket.wait('get_account_status').then(() => {
            const $class_real = $('.real');
            const is_jp       = jpClient();

            if (Client.get('is_virtual')) {
                $class_real.setVisibility(0);
            } else {
                $class_real.not((is_jp ? '.ja-hide' : '')).setVisibility(1);
            }

            const status = State.getResponse('get_account_status.status');
            if (!/social_signup/.test(status)) {
                $('#change_password').setVisibility(1);
            }

            const financial_company = State.getResponse('landing_company.financial_company.shortcode');
            // Professional Client menu should only be shown to MF and CR accounts.
            if (!is_jp && !/professional_requested|professional/.test(status) &&
                (Client.isAccountOfType('financial') ||
                    (/costarica/.test(financial_company) && Client.isAccountOfType('real')))) {

                if (Client.canRequestProfessional()) {
                    $('#professional_client').setVisibility(1);
                }
            }

            if (!State.getResponse('get_account_status.prompt_client_to_authenticate')) {
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

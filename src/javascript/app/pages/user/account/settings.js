const Client           = require('../../../base/client');
const BinarySocket     = require('../../../base/socket');
const State            = require('../../../../_common/storage').State;

const Settings = (() => {
    const onLoad = () => {
        BinarySocket.wait('get_account_status').then(() => {
            $('.real').setVisibility(!Client.get('is_virtual'));

            const status = State.getResponse('get_account_status.status');
            if (!/social_signup/.test(status)) {
                $('#change_password').setVisibility(1);
            }

            // Professional Client menu should only be shown to maltainvest accounts.
            if ((Client.get('landing_company_shortcode') === 'maltainvest') && !/professional/.test(status)) {

                $('#professional_client').setVisibility(1);
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

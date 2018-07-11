const Client       = require('../../../base/client');
const BinarySocket = require('../../../base/socket');
const localize     = require('../../../../_common/localize').localize;
const State        = require('../../../../_common/storage').State;

const Settings = (() => {
    const onLoad = () => {
        BinarySocket.wait('get_account_status').then(() => {
            const $class_real  = $('.real');

            if (Client.get('is_virtual')) {
                $class_real.setVisibility(0);
            } else {
                $class_real.not((Client.isJPClient() ? '.ja-hide' : '')).setVisibility(1);
            }

            const status = State.getResponse('get_account_status.status') || [];
            if (!/social_signup/.test(status)) {
                $('#change_password').setVisibility(1);
            }

            // Professional Client menu should only be shown to maltainvest accounts.
            if ((Client.get('landing_company_shortcode') === 'maltainvest')) {
                let text = 'You are categorised as a retail client. Apply to be treated as a professional trader.';
                if (status.indexOf('professional') !== -1) {
                    text = 'You are categorised as a professional client.';
                } else if (/professional_requested/.test(status)) {
                    text = 'Your application to be treated as a professional client is being processed.';
                }
                $('#professional_client').setVisibility(1).find('p').text(localize(text));
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

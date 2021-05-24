const Client                  = require('../../../base/client');
const BinaryPjax              = require('../../../base/binary_pjax');
const BinarySocket            = require('../../../base/socket');
const Dialog                  = require('../../../common/attach_dom/dialog');
const isAuthenticationAllowed = require('../../../../_common/base/client_base').isAuthenticationAllowed;
const localize                = require('../../../../_common/localize').localize;
const State                   = require('../../../../_common/storage').State;
const Url                     = require('../../../../_common/url');

const Settings = (() => {
    const onLoad = () => {
        BinarySocket.wait('get_account_status').then(() => {
            $('.real').setVisibility(!Client.get('is_virtual'));

            const status = State.getResponse('get_account_status.status') || [];

            if (!isAuthenticationAllowed()) {
                $('#authenticate a')
                    .attr('href', '#')
                    .on('click',  () => {
                        Dialog.alert({
                            id               : 'authorize_svg_error',
                            localized_message: localize('You do not need to authenticate your account at this time.[_1]We will inform you when your account needs to be authenticated.', '<br />'),
                            localized_title  : localize('No authentication required'),
                            ok_text          : localize('Back to trading'),
                            onConfirm        : () => { BinaryPjax.load(Url.urlFor('trading')); },
                        });
                    });
            }

            // Professional Client menu should only be shown to maltainvest accounts.
            if ((Client.get('landing_company_shortcode') === 'maltainvest')) {
                const is_professional_client    = status.indexOf('professional') !== -1;
                const is_requested_professional = /professional_requested/.test(status);
                let localized_text = '';
                if (is_professional_client) {
                    localized_text = localize('You are categorised as a professional client.');
                } else if (is_requested_professional) {
                    localized_text = localize('Your application to be treated as a professional client is being processed.');
                } else { // is retail client
                    localized_text = localize('You are categorised as a retail client. Apply to be treated as a professional trader.');
                }
                $('#professional_client').setVisibility(1).find('p').text(localized_text);
            }

            $('#settings_container').setVisibility(1);
        });
    };

    return {
        onLoad,
    };
})();

module.exports = Settings;

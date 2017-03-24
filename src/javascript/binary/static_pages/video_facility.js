const BinaryPjax         = require('../base/binary_pjax');
const Client             = require('../base/client');
const defaultRedirectUrl = require('../base/url').defaultRedirectUrl;
const getLoginToken      = require('../common_functions/common_functions').getLoginToken;
const DeskWidget         = require('../common_functions/attach_dom/desk_widget');

const VideoFacility = (() => {
    const onLoad = () => {
        BinarySocket.send({ get_account_status: 1 }).then((response) => {
            if (response.error) {
                $('#error_message').removeClass('invisible').text(response.error.message);
            } else {
                const status = response.get_account_status.status;
                if (/authenticated/.test(status)) {
                    BinaryPjax.load(defaultRedirectUrl);
                } else {
                    DeskWidget.showDeskLink('', '#facility_content');
                    if (!Client.isFinancial()) {
                        $('.not_authenticated').removeClass('invisible');
                    }
                    $('.msg_authenticate').removeClass('invisible');
                    $('#generated_token').text(getLoginToken().slice(-4));
                }
            }
        });
    };

    return {
        onLoad: onLoad,
    };
})();

module.exports = VideoFacility;

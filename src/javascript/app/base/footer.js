const BinarySocket = require('./socket');
const Client       = require('../base/client');
const State        = require('../../_common/storage').State;

const Footer = (() => {
    const onLoad = () => {
        BinarySocket.wait('website_status', 'authorize').then(() => {
            const $footer      = $('#footer-last');
            const $cfd_warning = $footer.find('.eu-only');
            const show_warning = Client.get('is_eu') || /maltainvest/.test(State.getResponse('authorize.landing_company_name'));
            if (show_warning) {
                $footer.find('p').addClass('font-n');
                $cfd_warning.setVisibility(1);
            } else {
                $cfd_warning.setVisibility(0);
            }
            $footer.setVisibility(1);
        });
    };

    const clearNotification = () => {
        const $status_notification = $('#status_notification');
        $status_notification.slideUp(200);
    };
    
    const displayNotification = (message) => {
        const $status_notification = $('#status_notification');
        const $status_message_text = $('#status_notification_text');
        const $close_icon = $('#status_notification_close');

        $status_notification.css('display', 'flex');
        $status_message_text.html(message);

        $close_icon.off('click').on('click', () => {
            $status_notification.slideUp(200);
        });
    };

    return {
        onLoad,
        clearNotification,
        displayNotification,
    };
})();

module.exports = Footer;
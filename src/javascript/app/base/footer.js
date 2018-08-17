const Client = require('../base/client');

const Footer = (() => {
    const onLoad = () => {
        const $footer      = $('#footer-last');
        const $cfd_warning = $footer.find('.eu-only');
        const is_eu        = Client.get('is_eu');
        if (is_eu) {
            $footer.find('p').addClass('font-n');
            $cfd_warning.setVisibility(1);
        } else {
            $cfd_warning.setVisibility(0);
        }
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
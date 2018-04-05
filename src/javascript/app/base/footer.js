const getElementById      = require('../../_common/common_functions').getElementById;
// const localize            = require('../../_common/localize').localize;

const Footer = (() => {
    const displayNotification = (message) => {
        const status_notification = getElementById('status-notification');
        const status_message_text = getElementById('status-notification-text');
        const close_icon = getElementById('status-notification-close');
        
        $(status_notification).css('display', 'flex');
        status_message_text.html(message);

        $(close_icon).click(() => {
            $(status_notification).slideUp(300);
        });
    };

    return {
        displayNotification,
    };
})();

module.exports = Footer;
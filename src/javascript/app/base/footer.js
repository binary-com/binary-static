const getElementById         = require('../../_common/common_functions').getElementById;
// const localize            = require('../../_common/localize').localize;

const Footer = (() => {
    const displayNotification = (message) => {
        const status_notification = getElementById('status-notification');
        const status_message_text = getElementById('status-notification-text');
        const close_icon = getElementById('status-notification-close');
        const notificationType = setDisplayNotificationType(message);

        $(status_notification).removeClass();
        $(status_notification).addClass(notificationType);
        $(status_notification).css('display', 'flex');

        status_message_text.html(message);

        $(close_icon).click(() => {
            $(status_notification).slideUp(200);
        });
    };

    const setDisplayNotificationType = (message) => {
        switch (message) {
            case 'We are experiencing an unusually high load on our system. Some features and services may be unstable or temporarily unavailable. We hope to resolve this issue as soon as we can.':
                return 'warning';
            case 'Display after two seconds!': 
                return 'info';
            case 'sucessfull something!':
                return 'success';
            default:
                return 'info';
        }
    };

    return {
        displayNotification,
    };
})();

module.exports = Footer;
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
            case 'Sorry, but trading is unavailable until further notice due to an unexpected error. Please try again later.': 
                return 'warning';
            case 'We are having an issue with one or more of our data feeds. We are working to resolve the issue but some markets may be unavailable for the time being':
                return 'warning';
            case 'Sorry, but we are experiencing a technical issue with our Cashier. Your funds are safe but deposits and withdrawals are unavailable for the time being.':
                return 'danger';
            case 'Sorry, but we are having a technical issue with our MT5 platform. Trading is unavailable for the time being.':
                return 'info';
            default:
                return 'info';
        }
    };

    return {
        displayNotification,
    };
})();

module.exports = Footer;
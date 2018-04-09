const Footer = (() => {
    const displayNotification = (message) => {
        const status_notification = $('#status_notification');
        const status_message_text = $('#status_notification_text');
        const close_icon = $('#status_notification_close');

        $(status_notification).css('display', 'flex');
        status_message_text.html(message);

        $(close_icon).off('click').on('click', () => {
            $(status_notification).slideUp(200);
        });
    };

    return {
        displayNotification,
    };
})();

module.exports = Footer;
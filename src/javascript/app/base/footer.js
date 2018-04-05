const getElementById      = require('../../_common/common_functions').getElementById;
// const localize            = require('../../_common/localize').localize;

const Footer = (() => {
    const displayNotification = (message) => {
        const status_message_text = getElementById('status-message-text');
        const status_message = getElementById('status-message');
        const close_icon = getElementById('status-message-close');

        $(status_message).css('display', 'flex');
        status_message.setAttribute('data-message', message);
        status_message_text.html(message);

        $(close_icon).click(() => {
            $(status_message).css('display', 'none');
        });
    };
    return {
        displayNotification,
    };
})();

module.exports = Footer;
const getElementById      = require('../../_common/common_functions').getElementById;
// const localize            = require('../../_common/localize').localize;

const Footer = (() => {
    const displayNotification = (message) => {
        const status_message_text = getElementById('status-message-text');
        const status_message = getElementById('status-message');
        
        $(status_message).css('display', 'flex');
        console.log(status_message, 'status-message');
        status_message.setAttribute('data-message', message);
        status_message_text.html(message);
    };
    return {
        displayNotification,
    };
})();

module.exports = Footer;
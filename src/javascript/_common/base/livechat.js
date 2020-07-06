const ClientBase = require('./client_base');

const LiveChat = (() => {

    const init = () => {
        if (window.LiveChatWidget) {
            // window.LiveChatWidget.on('ready', () => {
            //     window.LiveChatWidget.call('set_customer_name', 'John Doe');
            //     // window.LiveChatWidget.call('set_customer_email', authorize.email);
            // });
            window.LiveChatWidget.on('visibility_changed', ({ visibility }) => {
                if (visibility === 'maximized' && ClientBase.isLoggedIn()) {
                    const email = ClientBase.get('email');
                    const fullname = ClientBase.get('fullname');

                    if (email) window.LiveChatWidget.call('set_customer_email', email);
                    if (fullname) window.LiveChatWidget.call('set_customer_name', fullname);
                }
            });
        }
    };

    return {
        init,
    };
})();

module.exports = LiveChat;

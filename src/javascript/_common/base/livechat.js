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

                    // only visible to CS
                    const loginid = ClientBase.get('loginid');
                    const landing_company_shortcode = ClientBase.get('landing_company_shortcode');
                    const currency = ClientBase.get('currency');
                    const residence = ClientBase.get('residence');

                    const session_variables = {
                        ...loginid && { loginid },
                        ...landing_company_shortcode && { landing_company_shortcode },
                        ...currency && { currency },
                        ...residence && { residence },
                    };

                    console.log(session_variables);
                    window.LiveChatWidget.call('set_session_variables', session_variables);
                }
            });
        }
    };

    return {
        init,
    };
})();

module.exports = LiveChat;

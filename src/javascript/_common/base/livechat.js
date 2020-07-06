const ClientBase = require('./client_base');

const LiveChat = (() => {
    const init = () => {
        if (window.LiveChatWidget) {
            window.LiveChatWidget.on('visibility_changed', ({ visibility }) => {
                // only visible to CS
                let session_variables = { loginid: '', landing_company_shortcode: '', currency: '', residence: '' };

                if (visibility === 'maximized' && ClientBase.isLoggedIn()) {
                    const email = ClientBase.get('email');
                    const fullname = ClientBase.get('fullname');

                    if (email) window.LiveChatWidget.call('set_customer_email', email);
                    if (fullname) window.LiveChatWidget.call('set_customer_name', fullname);

                    const loginid = ClientBase.get('loginid');
                    const landing_company_shortcode = ClientBase.get('landing_company_shortcode');
                    const currency = ClientBase.get('currency');
                    const residence = ClientBase.get('residence');

                    session_variables = {
                        ...loginid && { loginid },
                        ...landing_company_shortcode && { landing_company_shortcode },
                        ...currency && { currency },
                        ...residence && { residence },
                    };

                    window.LiveChatWidget.call('set_session_variables', session_variables);
                }
                if (visibility === 'maximized' && !ClientBase.isLoggedIn()) {
                    window.LiveChatWidget.call('set_customer_email', ' ');
                    window.LiveChatWidget.call('set_customer_name', ' ');
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

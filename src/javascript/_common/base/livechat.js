const BinarySocket = require('./socket_base');
const ClientBase = require('./client_base');

const LiveChat = (() => {

    const initial_session_variables = { loginid: '', landing_company_shortcode: '', currency: '', residence: '', email: '' };

    const init = () => {
        if (window.LiveChatWidget) {
            window.LiveChatWidget.on('ready', () => {
                window.LiveChatWidget.call('set_session_variables', initial_session_variables);

                BinarySocket.wait('get_settings').then((response) => {
                    const get_settings = response.get_settings || {};
                    const { first_name, last_name } = get_settings;
                    const email = ClientBase.get('email');

                    if (email) window.LiveChatWidget.call('set_customer_email', email);
                    if (first_name && last_name) window.LiveChatWidget.call('set_customer_name', `${first_name} ${last_name}`);
                });

                window.LC_API.on_chat_ended = () => {
                    if (!ClientBase.isLoggedIn()){
                        window.LiveChatWidget.call('set_customer_email', ' ');
                        window.LiveChatWidget.call('set_customer_name', ' ');
                    }
                };
                
                window.LiveChatWidget.on('visibility_changed', ({ visibility }) => {
                    // only visible to CS
                    if (visibility === 'maximized' && ClientBase.isLoggedIn()) {
                        const loginid = ClientBase.get('loginid');
                        const landing_company_shortcode = ClientBase.get('landing_company_shortcode');
                        const currency = ClientBase.get('currency');
                        const residence = ClientBase.get('residence');
                        const email = ClientBase.get('email');

                        const client_session_variables = {
                            ...loginid && { loginid },
                            ...landing_company_shortcode && { landing_company_shortcode },
                            ...currency && { currency },
                            ...residence && { residence },
                            ...email && { email },
                        };

                        window.LiveChatWidget.call('set_session_variables', client_session_variables);
                    }

                });
            });
        }
    };

    // Fallback LiveChat icon
    const livechatFallback = () => {
        let livechat_shell;
        const livechat_id = 'gtm-deriv-livechat';
    
        if (window.LiveChatWidget){
            window.LiveChatWidget.on('ready', () => {
                livechat_shell = document.getElementById(livechat_id);
                livechat_shell.style.display = 'flex';
                livechat_shell.addEventListener('click', () => window.LC_API.open_chat_window());
            });
        }
        
    };

    return {
        init,
        livechatFallback,
    };
})();

module.exports = LiveChat;

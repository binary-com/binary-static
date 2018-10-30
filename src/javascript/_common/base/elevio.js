const ClientBase   = require('./client_base');
const BinarySocket = require('./socket_base');

const Elevio = (() => {
    const init = () => {
        window._elev.on('load', (elev) => { // eslint-disable-line no-underscore-dangle
            // window._elev.setLanguage(lang);
            setUserInfo(elev);
        });
    };

    const setUserInfo = (elev) => {
        if (ClientBase.isLoggedIn()) {
            BinarySocket.wait('get_settings').then((response) => {
                const get_settings = response.get_settings || {};
                const is_virtual = ClientBase.get('is_virtual');

                const user_obj = {
                    email     : ClientBase.get('email'),
                    first_name: is_virtual ? 'Virtual'                 : get_settings.first_name,
                    last_name : is_virtual ? ClientBase.get('loginid') : get_settings.last_name,
                    user_hash : get_settings.user_hash,
                };

                elev.setUser(user_obj);
            });
        }
    };

    const createComponent = (type) => window._elev.component({ type }); // eslint-disable-line no-underscore-dangle

    return {
        init,
        createComponent,
    };
})();

module.exports = Elevio;

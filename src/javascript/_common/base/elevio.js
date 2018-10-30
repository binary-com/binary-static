const ClientBase       = require('./client_base');
const BinarySocket     = require('./socket_base');
const elementInnerHtml = require('../common_functions').elementInnerHtml;
const State            = require('../storage').State;

const Elevio = (() => {
    const available_countries = ['in', 'lk', 'ng', 'za'];

    const init = () => {
        BinarySocket.wait('website_status').then(() => {
            if (isAvailable()) {
                window._elev.on('load', (elev) => { // eslint-disable-line no-underscore-dangle
                    // window._elev.setLanguage(lang);
                    setUserInfo(elev);

                    const el_elevio_styles = document.getElementsByClassName('elevio-styles')[0];
                    if (el_elevio_styles) {
                        // we have to update the style since the launcher element gets updates even after elevio's 'ready' event fired
                        elementInnerHtml(el_elevio_styles, `${elementInnerHtml(el_elevio_styles)} ._elevio_launcher {display: block;}`);
                    }
                });
            }
        });
    };

    const isAvailable = () => (
        new RegExp(`^(${available_countries.join('|')})$`, 'i').test(State.getResponse('website_status.clients_country'))
    );

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
        isAvailable,
        createComponent,
    };
})();

module.exports = Elevio;

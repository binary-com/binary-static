const ClientBase    = require('./client_base');
const GTM           = require('./gtm');
const BinarySocket  = require('./socket_base');
const State         = require('../storage').State;
const createElement = require('../utility').createElement;

const Elevio = (() => {
    const excluded_countries = ['br', 'id', 'ru'];

    const init = () => {
        BinarySocket.wait('website_status').then(() => {
            if (isAvailable()) {
                window._elev.on('load', (elev) => { // eslint-disable-line no-underscore-dangle
                    // window._elev.setLanguage(lang);
                    setUserInfo(elev);
                    setTranslations(elev);
                    addEventListenerGTM();
                    makeLauncherVisible();
                });
            }
        });
    };

    const isAvailable = () => (
        !new RegExp(`^(${excluded_countries.join('|')})$`, 'i').test(State.getResponse('website_status.clients_country'))
    );

    const addEventListenerGTM = () => {
        window._elev.on('widget:opened', () => { // eslint-disable-line no-underscore-dangle
            GTM.pushDataLayer({ event: 'elevio_widget_opened' });
        });
    };

    const makeLauncherVisible = () => {
        // we have to add the style since the launcher element gets updates even after elevio's 'ready' event fired
        const el_launcher_style = createElement('style', { html: '._elevio_launcher {display: block;}' });
        document.head.appendChild(el_launcher_style);
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

    const setTranslations = (elev) => {
        elev.setTranslations({
            modules: {
                support: {
                    thankyou: 'Thank you, we\'ll get back to you within 24 hours', // Elevio is available only on EN for now
                },
            },
        });
    };

    const createComponent = (type) => window._elev.component({ type }); // eslint-disable-line no-underscore-dangle

    return {
        init,
        isAvailable,
        createComponent,
    };
})();

module.exports = Elevio;

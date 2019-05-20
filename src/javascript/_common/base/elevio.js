const ClientBase    = require('./client_base');
const GTM           = require('./gtm');
const BinarySocket  = require('./socket_base');
const getLanguage   = require('../language').get;
const localize      = require('../localize').localize;
const createElement = require('../utility').createElement;

const Elevio = (() => {
    const el_shell_id = 'elevio-shell';
    let el_shell;

    const init = () => {
        el_shell = document.getElementById(el_shell_id);

        el_shell.addEventListener('click', () => {
            const account_id = '5bbc2de0b7365';
            window._elev = {}; // eslint-disable-line no-underscore-dangle
            window._elev.account_id = account_id; // eslint-disable-line no-underscore-dangle

            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.async = 1;
            script.src = `https://cdn.elev.io/sdk/bootloader/v4/elevio-bootloader.js?cid=${account_id}`;
            script.id = 'loaded-elevio-script';
            document.body.appendChild(script);

            window._elev.q = []; // eslint-disable-line no-underscore-dangle
            window._elev.on = function(z, y) { // eslint-disable-line no-underscore-dangle
                window._elev.q.push([z, y]); // eslint-disable-line no-underscore-dangle
            };

            script.onload = loadElevio;
        });
    };

    const loadElevio = () => {
        if (!window._elev) return; // eslint-disable-line no-underscore-dangle
        el_shell.parentNode.removeChild(el_shell);
        el_shell = undefined;

        window._elev.on('load', (elev) => { // eslint-disable-line no-underscore-dangle
            const available_elev_languages = ['es', 'id', 'pt', 'ru'];
            const current_language         = getLanguage().toLowerCase();
            if (available_elev_languages.indexOf(current_language) !== -1) {
                window._elev.setLanguage(current_language); // eslint-disable-line no-underscore-dangle
            } else {
                window._elev.setLanguage('en'); // eslint-disable-line no-underscore-dangle
            }
            setUserInfo(elev);
            setTranslations(elev);
            addEventListenerGTM();
            makeLauncherVisible();
            elev.open();
        });
    };

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
                    thankyou: localize('Thank you, we\'ll get back to you within 24 hours'),
                },
            },
        });
    };

    const createComponent = (type) => window._elev.component({ type }); // eslint-disable-line no-underscore-dangle

    return {
        init,
        createComponent,
    };
})();

module.exports = Elevio;

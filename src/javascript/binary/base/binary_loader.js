const BinaryPjax           = require('./binary_pjax');
const pages_config         = require('./binary_pages');
const Client               = require('./client').Client;
const GTM                  = require('./gtm').GTM;
const localize             = require('./localize').localize;
const Login                = require('./login').Login;
const page                 = require('./page').page;
const default_redirect_url = require('./url').default_redirect_url;
const url                  = require('./url').url;

const BinaryLoader = (function() {
    'use strict';

    let container,
        active_script = null;

    const init = () => {
        BinarySocket.init();

        container = $('#content-holder');
        container.on('binarypjax:before', beforeContentChange);
        container.on('binarypjax:after', afterContentChange);
        BinaryPjax.init(container, '#content');
    };

    const beforeContentChange = () => {
        if (active_script) {
            page.on_unload();
            if (typeof active_script.onUnload === 'function') {
                active_script.onUnload();
            }
            active_script = null;
        }
    };

    const afterContentChange = (e, content) => {
        url.reset();
        page.on_load();
        GTM.push_data_layer();
        const this_page = content.getAttribute('data-page');
        if (this_page in pages_config) {
            loadHandler(pages_config[this_page]);
        } else if (/\/get-started\//i.test(window.location.pathname)) {
            loadHandler(pages_config['get-started']);
        }
    };

    const errorMessages = {
        login       : () => localize('Please <a href="[_1]">log in</a> to view this page.', [Login.login_url()]),
        only_virtual: 'Sorry, this feature is available to virtual accounts only.',
        only_real   : 'This feature is not relevant to virtual-money accounts.',
    };

    const loadHandler = (config) => {
        active_script = config.module;
        if (config.is_authenticated) {
            if (!Client.is_logged_in()) {
                displayMessage(errorMessages.login());
            } else {
                BinarySocket.wait('authorize')
                    .then((response) => {
                        if (response.error) {
                            displayMessage(errorMessages.login());
                        } else if (config.only_virtual && !Client.get('is_virtual')) {
                            displayMessage(errorMessages.only_virtual);
                        } else if (config.only_real && Client.get('is_virtual')) {
                            displayMessage(errorMessages.only_real);
                        } else {
                            active_script.onLoad();
                        }
                    });
            }
        } else if (config.not_authenticated && Client.is_logged_in()) {
            BinaryPjax.load(default_redirect_url(), true);
        } else {
            active_script.onLoad();
        }
    };

    const displayMessage = (message) => {
        const $content = container.find('#content .container');
        $content.html($('<div/>', { class: 'logged_out_title_container', html: $content.find('h1') }))
            .append($('<p/>', { class: 'center-text notice-msg', html: localize(message) }));
    };

    return {
        init: init,
    };
})();

module.exports = BinaryLoader;

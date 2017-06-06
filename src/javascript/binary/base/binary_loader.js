const BinaryPjax          = require('./binary_pjax');
const pages_config        = require('./binary_pages');
const Client              = require('./client');
const GTM                 = require('./gtm');
const localize            = require('./localize').localize;
const Login               = require('./login');
const Page                = require('./page');
const defaultRedirectUrl  = require('./url').defaultRedirectUrl;
const BinarySocket        = require('../websocket_pages/socket');
const BinarySocketGeneral = require('../websocket_pages/socket_general');

const BinaryLoader = (() => {
    'use strict';

    let container,
        active_script = null;

    const init = () => {
        if (!/\.html$/i.test(window.location.pathname)) {
            window.location.pathname += '.html';
            return;
        }

        Client.init();
        BinarySocket.init(BinarySocketGeneral.initOptions());

        container = $('#content-holder');
        container.on('binarypjax:before', beforeContentChange);
        container.on('binarypjax:after',  afterContentChange);
        BinaryPjax.init(container, '#content');
    };

    const beforeContentChange = () => {
        if (active_script) {
            Page.onUnload();
            BinarySocket.removeOnDisconnect();
            if (typeof active_script.onUnload === 'function') {
                active_script.onUnload();
            }
            active_script = null;
        }
    };

    const afterContentChange = (e, content) => {
        Page.onLoad();
        GTM.pushDataLayer();
        const this_page = content.getAttribute('data-page');
        if (this_page in pages_config) {
            loadHandler(pages_config[this_page]);
        } else if (/\/get-started\//i.test(window.location.pathname)) {
            loadHandler(pages_config['get-started']);
        }
    };

    const error_messages = {
        login       : () => localize('Please <a href="[_1]">log in</a> to view this page.', [Login.loginUrl()]),
        only_virtual: 'Sorry, this feature is available to virtual accounts only.',
        only_real   : 'This feature is not relevant to virtual-money accounts.',
    };

    const loadHandler = (config) => {
        active_script = config.module;
        if (config.is_authenticated) {
            if (!Client.isLoggedIn()) {
                displayMessage(error_messages.login());
            } else {
                BinarySocket.wait('authorize')
                    .then((response) => {
                        if (response.error) {
                            displayMessage(error_messages.login());
                        } else if (config.only_virtual && !Client.get('is_virtual')) {
                            displayMessage(error_messages.only_virtual);
                        } else if (config.only_real && Client.get('is_virtual')) {
                            displayMessage(error_messages.only_real);
                        } else {
                            active_script.onLoad();
                        }
                    });
            }
        } else if (config.not_authenticated && Client.isLoggedIn()) {
            BinaryPjax.load(defaultRedirectUrl(), true);
        } else {
            active_script.onLoad();
        }
        BinarySocket.setOnDisconnect(active_script.onDisconnect);
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

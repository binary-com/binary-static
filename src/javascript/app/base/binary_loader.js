const BinaryPjax          = require('./binary_pjax');
const pages_config        = require('./binary_pages');
const Client              = require('./client');
const Header              = require('./header');
const NetworkMonitor      = require('./network_monitor');
const Page                = require('./page');
const BinarySocket        = require('./socket');
const ContentVisibility   = require('../common/content_visibility');
const GTM                 = require('../../_common/base/gtm');
const Login               = require('../../_common/base/login');
const getElementById      = require('../../_common/common_functions').getElementById;
const urlLang             = require('../../_common/language').urlLang;
const localizeForLang     = require('../../_common/localize').forLang;
const localize            = require('../../_common/localize').localize;
const ScrollToAnchor      = require('../../_common/scroll_to_anchor');
const isStorageSupported  = require('../../_common/storage').isStorageSupported;
const ThirdPartyLinks     = require('../../_common/third_party_links');
const urlFor              = require('../../_common/url').urlFor;
const createElement       = require('../../_common/utility').createElement;

const BinaryLoader = (() => {
    let container;
    let active_script = null;

    const init = () => {
        if (!/\.html$/i.test(window.location.pathname)) {
            window.location.pathname += '.html';
            return;
        }

        if (!isStorageSupported(localStorage) || !isStorageSupported(sessionStorage)) {
            Header.displayNotification(localize('[_1] requires your browser\'s web storage to be enabled in order to function properly. Please enable it or exit private browsing mode.', ['Binary.com']),
                true, 'STORAGE_NOT_SUPPORTED');
            getElementById('btn_login').classList.add('button-disabled');
        }

        localizeForLang(urlLang());

        Page.showNotificationOutdatedBrowser();

        Client.init();
        NetworkMonitor.init();

        container = getElementById('content-holder');
        container.addEventListener('binarypjax:before', beforeContentChange);
        container.addEventListener('binarypjax:after',  afterContentChange);
        BinaryPjax.init(container, '#content');

        ThirdPartyLinks.init();
    };

    const beforeContentChange = () => {
        if (active_script) {
            BinarySocket.removeOnDisconnect();
            if (typeof active_script.onUnload === 'function') {
                active_script.onUnload();
            }
            active_script = null;
        }
        ScrollToAnchor.cleanup();
    };

    const afterContentChange = (e) => {
        Page.onLoad();
        GTM.pushDataLayer({ event: 'page_load' });

        const this_page = e.detail.getAttribute('data-page');
        if (this_page in pages_config) {
            loadHandler(pages_config[this_page]);
        } else if (/\/get-started\//i.test(window.location.pathname)) {
            loadHandler(pages_config['get-started']);
        }

        ContentVisibility.init();
        ScrollToAnchor.init();
    };

    const error_messages = {
        login       : () => localize('Please [_1]log in[_2] or [_3]sign up[_4] to view this page.', [`<a href="${'javascript:;'}">`, '</a>', `<a href="${urlFor('new-account')}">`, '</a>']),
        only_virtual: () => localize('Sorry, this feature is available to virtual accounts only.'),
        only_real   : () => localize('This feature is not relevant to virtual-money accounts.'),
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
                            displayMessage(error_messages.only_virtual());
                        } else if (config.only_real && Client.get('is_virtual')) {
                            displayMessage(error_messages.only_real());
                        } else {
                            loadActiveScript(config);
                        }
                    });
            }
        } else if (config.not_authenticated && Client.isLoggedIn()) {
            BinaryPjax.load(Client.defaultRedirectUrl(), true);
        } else {
            loadActiveScript(config);
        }
        BinarySocket.setOnDisconnect(active_script.onDisconnect);
    };

    const loadActiveScript = (config) => {
        if (active_script && typeof active_script.onLoad === 'function') {
            // only pages that call formatMoney should wait for website_status
            if (config.needs_currency) {
                BinarySocket.wait('website_status').then(() => {
                    active_script.onLoad();
                });
            } else {
                active_script.onLoad();
            }
        }
    };

    const displayMessage = (localized_message) => {
        const content = container.querySelector('#content .container');
        if (!content) {
            return;
        }

        const div_container = createElement('div', { class: 'logged_out_title_container', html: content.getElementsByTagName('h1')[0] });
        const div_notice    = createElement('p', { class: 'center-text notice-msg', html: localized_message });

        div_container.appendChild(div_notice);

        content.html(div_container);

        const link = content.getElementsByTagName('a')[0];
        if (link) {
            link.addEventListener('click', () => { Login.redirectToLogin(); });
        }
    };

    return {
        init,
    };
})();

module.exports = BinaryLoader;

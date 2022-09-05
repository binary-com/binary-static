const pages_config          = require('./binary_pages');
const BinaryPjax            = require('./binary_pjax');
const Client                = require('./client');
const Header                = require('./header');
const NetworkMonitor        = require('./network_monitor');
const Page                  = require('./page');
const BinarySocket          = require('./socket');
const ContentVisibility     = require('../common/content_visibility');
const getElementById        = require('../../_common/common_functions').getElementById;
const urlLang               = require('../../_common/language').urlLang;
const localize              = require('../../_common/localize').localize;
const localizeForLang       = require('../../_common/localize').forLang;
const ScrollToAnchor        = require('../../_common/scroll_to_anchor');
const isStorageSupported    = require('../../_common/storage').isStorageSupported;
const ThirdPartyLinks       = require('../../_common/third_party_links');
const urlFor                = require('../../_common/url').urlFor;
const createElement         = require('../../_common/utility').createElement;
const ClientBase            = require('../../_common/base/client_base');
const GTM                   = require('../../_common/base/gtm');
const LiveChat              = require('../../_common/base/livechat');
const Login                 = require('../../_common/base/login');
const toTitleCase           = require('../../_common/string_util').toTitleCase;

const BinaryLoader = (() => {
    let container;
    let active_script = null;

    const init = () => {
        if (!/\.html$/i.test(window.location.pathname)) {
            window.location.pathname += '.html';
            return;
        }

        if (!isStorageSupported(localStorage) || !isStorageSupported(sessionStorage)) {
            Header.displayNotification(localize('[_1] requires your browser\'s web storage to be enabled in order to function properly. Please enable it or exit private browsing mode.', 'Binary.com'),
                true, 'STORAGE_NOT_SUPPORTED');
            getElementById('btn_login').classList.add('button-disabled');
        }

        localizeForLang(urlLang());

        checkAppidAndQAserver();

        Page.showNotificationOutdatedBrowser();

        Client.init();
        NetworkMonitor.init();
        container = getElementById('content-holder');
        container.addEventListener('binarypjax:before', beforeContentChange);
        window.addEventListener('beforeunload', beforeContentChange);
        container.addEventListener('binarypjax:after', afterContentChange);
        BinaryPjax.init(container, '#content');
        ThirdPartyLinks.init();

    };

    const checkAppidAndQAserver = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const qa_server = urlParams.get('qa_server');
        const app_id = urlParams.get('app_id');
        const URL_regex = /^(?:https?:\/\/)?(?!www | www\.)[A-Za-z0-9_-]+\.+[A-Za-z0-9.\/%&=\?_:;-]+$/i;
        if (qa_server && app_id && URL_regex.test(qa_server) && !isNaN(app_id)) {
            localStorage.setItem('config.server_url', qa_server);
            localStorage.setItem('config.app_id', app_id);
        }
    };

    const beforeContentChange = () => {
        if (active_script) {
            BinarySocket.removeOnDisconnect();
            BinarySocket.removeOnReconnect();
            if (typeof active_script.onUnload === 'function') {
                active_script.onUnload();
            }
            active_script = null;
        }

        ScrollToAnchor.cleanup();
    };

    const afterContentChange = (e) => {
        Page.onLoad();

        const this_page = e.detail.getAttribute('data-page');
        if (Object.prototype.hasOwnProperty.call(pages_config, this_page)) {
            loadHandler(this_page);
        } else if (/\/get-started\//i.test(window.location.pathname)) {
            loadHandler('get-started');
        }

        // Make sure content is properly loaded or visible before scrolling to anchor.
        ContentVisibility.init().then(() => {
            BinarySocket.wait('authorize', 'website_status', 'landing_company').then(() => {
                GTM.pushDataLayer({ event: 'page_load' }); // we need website_status.clients_country

                // reroute LiveChat group
                LiveChat.rerouteGroup();

                // first time load.
                const last_image = $('#content img').last();
                if (last_image) {
                    last_image.on('load', () => {
                        ScrollToAnchor.init();
                    });
                }

                ScrollToAnchor.init();

                ContentVisibility.centerAlignSelect(true);
            });
        });

        if (active_script) {
            BinarySocket.setOnReconnect(active_script.onReconnect);
        }
    };

    const error_messages = {
        login                  : () => localize('Please [_1]log in[_2] or [_3]sign up[_4] to view this page.', [`<a href="${'javascript:;'}">`, '</a>', `<a href="${urlFor('new-account')}">`, '</a>']),
        only_virtual           : () => localize('This feature is available to demo accounts only.'),
        only_real              : () => localize('You are using a demo account. Please switch to a real account or create one to access Cashier.'),
        not_authenticated      : () => localize('This page is only available to logged out clients.'),
        no_mf                  : () => localize('Binary options trading is not available in your Multipliers account.'),
        no_mf_switch_to_options: () => localize('Binary options trading is not available via your Multipliers account.<br/>Please switch back to your Options account.'),
        no_options_mf_mx       : () => localize('Sorry, options trading isn’t available in the United Kingdom and the Isle of Man'),
        options_blocked        : () => localize('Binary options trading is not available in your country.'),
        residence_blocked      : () => localize('This page is not available in your country of residence.'),
        not_deactivated        : () => localize('Page not available, you did not deactivate your account.'),
        only_deriv             : () => localize('Unfortunately, this service isn’t available in your country. If you’d like to trade multipliers, try DTrader on Deriv.'),
    };

    const error_actions = {
        only_deriv: () => ({ localized_title: localize('Go to DTrader'), target_url: 'https://app.deriv.com' }),
    };

    const loadHandler = (this_page) => {
        const config = { ...pages_config[this_page] };
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
                        } else if ((config.no_mf || config.only_virtual || window.location.href.includes('metatrader')) && ClientBase.get('residence') === 'fr') { // We don't offer service for France residence clients on Binary any more
                            displayMessage(error_messages.only_deriv(), error_actions.only_deriv());
                        } else {
                            loadActiveScript(config);
                        }
                    });
            }
        } else if (config.not_authenticated && Client.isLoggedIn()) {
            if (this_page === 'home' || this_page === 'new-account') {
                BinaryPjax.load(`${Client.defaultRedirectUrl()}${window.location.search}`, true);
            } else {
                handleNotAuthenticated();
            }
        } else {
            loadActiveScript(config);
        }
        if (config.no_mf && Client.isLoggedIn() && Client.isAccountOfType('financial')) {
            BinarySocket.wait('authorize').then((response) => {
                if (config.msg_residence_blocked) {
                    displayMessage(error_messages.residence_blocked());
                } else if (response.authorize.account_list.some(account => ['iom', 'malta'].includes(account.landing_company_name))) {
                    displayMessage(error_messages.no_mf_switch_to_options());
                } else {
                    displayMessage(error_messages.no_mf());
                }
            });
        }

        if (config.no_mf && Client.isLoggedIn()) {
            BinarySocket.wait('authorize').then((response) => {
                if (['gb', 'im'].includes(response.authorize.country)) {
                    displayMessage(error_messages.no_options_mf_mx());
                }
            });
        }

        if (this_page === 'deactivated-account' && Client.isLoggedIn()) {
            displayMessage(error_messages.not_deactivated());
        }

        BinarySocket.wait('authorize').then(() => {
            if (config.no_blocked_country && Client.isLoggedIn() && Client.isOptionsBlocked()) {
                if (ClientBase.get('residence') === 'fr') {
                    displayMessage(error_messages.only_deriv(), error_actions.only_deriv());
                } else if (config.msg_residence_blocked) {
                    displayMessage(error_messages.residence_blocked());
                } else {
                    displayMessage(error_messages.options_blocked());
                }
            }
        });
        // TODO: temporary condition; remove once BE Apple social signup is ready
        BinarySocket.wait('get_account_status').then((response) => {
            const { status, social_identity_provider } = response.get_account_status;
            const social_signup_identifier             = toTitleCase(social_identity_provider);
            const social_signup                        = status.includes('social_signup');
            const no_mt5_pass                          = status.includes('mt5_password_not_set');
            const account_pass_page                    = getElementById('change_password');

            if (config.is_social && social_signup && no_mt5_pass && social_signup_identifier === 'Apple') {
                $(account_pass_page).setVisibility(0);
            }
        });
        BinarySocket.setOnDisconnect(active_script && active_script.onDisconnect);
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

    const displayMessage = (localized_message, action) => {
        const content = container.querySelector('#content');

        if (!content) {
            return;
        }
        content.classList.add('container');

        const base_html_elements =
            Client.isAccountOfType('financial')
                || Client.isOptionsBlocked()
                || ClientBase.get('residence') === 'fr'
                || ClientBase.get('residence') === 'gb'
                || ClientBase.get('residence') === 'im'
                ? ''
                : content.getElementsByTagName('h1')[0] || '';
        const div_container = createElement('div', { class: 'logged_out_title_container', html: base_html_elements });
        const div_notice = createElement('p', { class: 'center-text notice-msg', html: localized_message });
        div_container.appendChild(div_notice);

        if (action) {
            const action_button = createElement('a', { class: 'button', href: action.target_url });
            const action_button_title = createElement('span', { text: action.localized_title });
            action_button.appendChild(action_button_title);
            div_container.appendChild(action_button);
        }

        content.html(div_container);

        if (!action) {
            const link = content.getElementsByTagName('a')[0];
            if (link) {
                link.addEventListener('click', () => { Login.redirectToLogin(); });
            }
        }
    };

    const handleNotAuthenticated = () => {
        const content = container.querySelector('#content');
        if (!content) {
            return;
        }
        content.classList.add('container');

        const outer_container = createElement('div', { class: 'logged_out_title_container' });
        outer_container.appendChild(container.querySelector('#page_info'));
        outer_container.appendChild(container.getElementsByTagName('h1')[0]);

        const rowDiv = (element) => {
            const row_element = createElement('div', { class: 'gr-padding-10' });
            row_element.appendChild(element);
            return row_element;
        };
        const inner_container = createElement('div', { class: 'center-text' });
        const error_msg = createElement('div', { class: 'center-text notice-msg', text: error_messages.not_authenticated() });
        const logout_cta = createElement('button');
        const logout_span = createElement('span', { text: localize('Sign out') });

        logout_cta.addEventListener('click', () => { Client.doLogout({ logout: 1 }); });
        logout_cta.appendChild(logout_span);
        inner_container.appendChild(rowDiv(error_msg));
        inner_container.appendChild(rowDiv(logout_cta));
        outer_container.append(inner_container);
        content.html(outer_container);
    };

    return {
        init,
    };
})();

module.exports = BinaryLoader;

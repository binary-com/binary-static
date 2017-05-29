const Client            = require('./client');
const Contents          = require('./contents');
const Header            = require('./header');
const Language          = require('./language');
const Localize          = require('./localize');
const localize          = require('./localize').localize;
const Login             = require('./login');
const Menu              = require('./menu');
const LocalStore        = require('./storage').LocalStore;
const State             = require('./storage').State;
const Url               = require('./url');
const checkLanguage     = require('../common_functions/country_base').checkLanguage;
const scrollToTop       = require('../common_functions/scroll').scrollToTop;
const TrafficSource     = require('../common_functions/traffic_source');
const BinarySocket      = require('../websocket_pages/socket');
const RealityCheck      = require('../websocket_pages/user/reality_check/reality_check');
const AffiliatePopup    = require('../../binary_japan/affiliate_popup');
const Cookies           = require('../../lib/js-cookie');
const PushNotification  = require('../../lib/push_notification');
require('../../lib/polyfills/array.includes');
require('../../lib/polyfills/string.includes');

const Page = (() => {
    'use strict';

    const init = () => {
        State.set('is_loaded_by_pjax', false);
        Url.init();
        PushNotification.init();
        onDocumentReady();
        inContextTranslation();
    };

    const onDocumentReady = () => {
        // LocalStorage can be used as a means of communication among
        // different windows. The problem that is solved here is what
        // happens if the user logs out or switches loginid in one
        // window while keeping another window or tab open. This can
        // lead to unintended trades. The solution is to reload the
        // page in all windows after switching loginid or after logout.

        // onLoad.queue does not work on the home page.
        // jQuery's ready function works always.
        $(document).ready(() => {
            // Cookies is not always available.
            // So, fall back to a more basic solution.
            let match = document.cookie.match(/\bloginid=(\w+)/);
            match = match ? match[1] : '';
            $(window).on('storage', (jq_event) => {
                switch (jq_event.originalEvent.key) {
                    case 'active_loginid':
                        if (jq_event.originalEvent.newValue === match) return;
                        if (jq_event.originalEvent.newValue === '') {
                            // logged out
                            reload();
                        } else if (!window.is_logging_in) {
                            // loginid switch
                            reload();
                        }
                        break;
                    case 'new_release_reload_time':
                        if (jq_event.originalEvent.newValue !== jq_event.originalEvent.oldValue) {
                            reload(true);
                        }
                        break;
                    // no default
                }
            });
            scrollToTop();
            LocalStore.set('active_loginid', match);
        });
    };

    const onLoad = () => {
        if (State.get('is_loaded_by_pjax')) {
            Url.reset();
        } else {
            init();
            Localize.forLang(Language.get());
            Header.onLoad();
            Language.setCookie();
            Menu.makeMobileMenu();
            recordAffiliateExposure();
            endpointNotification();
            showNotificationOutdatedBrowser();
        }
        Menu.init();
        Contents.onLoad();
        if (sessionStorage.getItem('showLoginPage')) {
            sessionStorage.removeItem('showLoginPage');
            Login.redirectToLogin();
        }
        if (Client.isLoggedIn()) {
            BinarySocket.wait('authorize').then(() => {
                checkLanguage();
                RealityCheck.onLoad();
            });
        } else {
            checkLanguage();
        }
        TrafficSource.setData();
    };

    const onUnload = () => {
        Menu.onUnload();
    };

    const inContextTranslation = () => {
        if (/^https:\/\/staging\.binary\.com\/translations\//i.test(window.location.href) && /ach/i.test(Language.get())) {
            window._jipt = [];
            window._jipt.push(['project', 'binary-static']);
            $('body').append($('<script/>', {
                type: 'text/javascript',
                src : `${document.location.protocol}//cdn.crowdin.com/jipt/jipt.js`,
            }));
        }
    };

    const recordAffiliateExposure = () => {
        const token = Url.param('t');
        if (!token || token.length !== 32) {
            return false;
        }

        AffiliatePopup.show();

        const token_length = token.length;
        const is_subsidiary = /\w{1}/.test(Url.param('s'));

        const cookie_token = Cookies.getJSON('affiliate_tracking');
        if (cookie_token) {
            // Already exposed to some other affiliate.
            if (is_subsidiary && cookie_token && cookie_token.t) {
                return false;
            }
        }

        // Record the affiliate exposure. Overwrite existing cookie, if any.
        const cookie_hash = {};
        if (token_length === 32) {
            cookie_hash.t = token.toString();
        }
        if (is_subsidiary) {
            cookie_hash.s = '1';
        }

        Cookies.set('affiliate_tracking', cookie_hash, {
            expires: 365, // expires in 365 days
            path   : '/',
            domain : `.${location.hostname.split('.').slice(-2).join('.')}`,
        });
        return true;
    };

    const reload = (forced_reload) => { window.location.reload(!!forced_reload); };

    const endpointNotification = () => {
        const server = localStorage.getItem('config.server_url');
        if (server && server.length > 0) {
            const message = `${(/www\.binary\.com/i.test(window.location.hostname) ? '' :
                `${localize('This is a staging server - For testing purposes only')} - `)}
                ${localize('The server <a href="[_1]">endpoint</a> is: [_2]', [Url.urlFor('endpoint'), server])}`;
            const $end_note = $('#end-note');
            $end_note.html(message).setVisibility(1);
            $('#footer').css('padding-bottom', $end_note.height());
        }
    };

    const showNotificationOutdatedBrowser = () => {
        const src = '//browser-update.org/update.min.js';
        if ($(`script[src*="${src}"]`).length) return;
        window.$buoop = {
            vs     : { i: 11, f: -4, o: -4, s: 9, c: -4 },
            api    : 4,
            l      : Language.get().toLowerCase(),
            url    : 'https://whatbrowser.org/',
            noclose: true, // Do not show the 'ignore' button to close the notification
        };
        $(document).ready(() => {
            $('body').append($('<script/>', { src: src }));
        });
    };

    return {
        onLoad  : onLoad,
        onUnload: onUnload,
    };
})();

module.exports = Page;

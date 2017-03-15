const Login             = require('./login').Login;
const LocalStore        = require('./storage').LocalStore;
const State             = require('./storage').State;
const localizeForLang   = require('./localize').localizeForLang;
const localize          = require('./localize').localize;
const getLanguage       = require('./language').getLanguage;
const setCookieLanguage = require('./language').setCookieLanguage;
const Url               = require('./url').Url;
const url_for           = require('./url').url_for;
const Client            = require('./client').Client;
const Header            = require('./header').Header;
const Menu              = require('./menu').Menu;
const Contents          = require('./contents').Contents;
const TrafficSource     = require('../common_functions/traffic_source').TrafficSource;
const checkLanguage     = require('../common_functions/country_base').checkLanguage;
const Cookies           = require('../../lib/js-cookie');
const PushNotification  = require('../../lib/push_notification');
require('../../lib/polyfills/array.includes');
require('../../lib/polyfills/string.includes');

const Page = function() {
    State.set('is_loaded_by_pjax', false);
    Client.init();
    this.url = new Url();
    Menu.init(this.url);
    PushNotification.init();
};

Page.prototype = {
    on_load: function() {
        this.url.reset();
        localizeForLang(getLanguage());
        Header.on_load();
        this.record_affiliate_exposure();
        Contents.on_load();
        setCookieLanguage();
        if (sessionStorage.getItem('showLoginPage')) {
            sessionStorage.removeItem('showLoginPage');
            Login.redirect_to_login();
        }
        checkLanguage();
        TrafficSource.setData();
        this.endpoint_notification();
        BinarySocket.init();
        this.show_notification_outdated_browser();
        Menu.make_mobile_menu();
    },
    on_unload: function() {
        Menu.on_unload();
        Contents.on_unload();
    },
    record_affiliate_exposure: function() {
        const token = this.url.param('t');
        if (!token || token.length !== 32) {
            return false;
        }
        const token_length = token.length;
        const is_subsidiary = /\w{1}/.test(this.url.param('s'));

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
            domain : '.' + location.hostname.split('.').slice(-2).join('.'),
        });
        return true;
    },
    reload: function(forcedReload) {
        window.location.reload(!!forcedReload);
    },
    endpoint_notification: function() {
        const server = localStorage.getItem('config.server_url');
        if (server && server.length > 0) {
            const message = (/www\.binary\.com/i.test(window.location.hostname) ? '' :
                localize('This is a staging server - For testing purposes only') + ' - ') +
                localize('The server <a href="[_1]">endpoint</a> is: [_2]', [url_for('endpoint'), server]),
                $end_note = $('#end-note');
            $end_note.html(message).removeClass('invisible');
            $('#footer').css('padding-bottom', $end_note.height());
        }
    },
    show_notification_outdated_browser: function() {
        const src = '//browser-update.org/update.min.js';
        if ($(`script[src*="${src}"]`).length) return;
        window.$buoop = {
            vs : { i: 11, f: -4, o: -4, s: 9, c: -4 },
            api: 4,
            l  : getLanguage().toLowerCase(),
            url: 'https://whatbrowser.org/',
        };
        $(document).ready(function() {
            $('body').append($('<script/>', { src: src }));
        });
    },
};

const page = new Page();

// LocalStorage can be used as a means of communication among
// different windows. The problem that is solved here is what
// happens if the user logs out or switches loginid in one
// window while keeping another window or tab open. This can
// lead to unintended trades. The solution is to reload the
// page in all windows after switching loginid or after logout.

// onLoad.queue does not work on the home page.
// jQuery's ready function works always.

$(document).ready(function () {
    // Cookies is not always available.
    // So, fall back to a more basic solution.
    let match = document.cookie.match(/\bloginid=(\w+)/);
    match = match ? match[1] : '';
    $(window).on('storage', function (jq_event) {
        switch (jq_event.originalEvent.key) {
            case 'active_loginid':
                if (jq_event.originalEvent.newValue === match) return;
                if (jq_event.originalEvent.newValue === '') {
                    // logged out
                    page.reload();
                } else if (!window.is_logging_in) {
                    // loginid switch
                    page.reload();
                }
                break;
            case 'new_release_reload_time':
                if (jq_event.originalEvent.newValue !== jq_event.originalEvent.oldValue) {
                    page.reload(true);
                }
                break;
            // no default
        }
    });
    LocalStore.set('active_loginid', match);
});

module.exports = {
    page: page,
};

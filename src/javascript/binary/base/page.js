const push_notification = require('pushwoosh-notification');
const Login             = require('./login').Login;
const template          = require('./utility').template;
const LocalStore        = require('./storage').LocalStore;
const State             = require('./storage').State;
const localizeForLang   = require('./localize').localizeForLang;
const localize          = require('./localize').localize;
const getLanguage       = require('./language').getLanguage;
const setCookieLanguage = require('./language').setCookieLanguage;
const Url               = require('./url').Url;
const url_for           = require('./url').url_for;
const url_for_static    = require('./url').url_for_static;
const Client            = require('./client').Client;
const Header            = require('./header').Header;
const Menu              = require('./menu').Menu;
const Contents          = require('./contents').Contents;
const TrafficSource     = require('../common_functions/traffic_source').TrafficSource;
const checkLanguage     = require('../common_functions/country_base').checkLanguage;
const ViewBalance       = require('../websocket_pages/user/viewbalance/viewbalance.init').ViewBalance;
const Cookies           = require('../../lib/js-cookie');
const RealityCheck      = require('../websocket_pages/user/reality_check/reality_check.init').RealityCheck;
const RealityCheckData  = require('../websocket_pages/user/reality_check/reality_check.data').RealityCheckData;
require('../../lib/polyfills/array.includes');
require('../../lib/polyfills/string.includes');

const Page = function() {
    State.set('is_loaded_by_pjax', false);
    Client.init();
    this.url = new Url();
    Menu.init(this.url);
    push_notification(url_for_static('/') + 'service-worker.js', 'web.com.pushwoosh.websiteid', 'D04E6-FA474');
};

Page.prototype = {
    on_load: function() {
        Client.set_check_tnc();
        this.url.reset();
        localizeForLang(getLanguage());
        Header.on_load();
        this.record_affiliate_exposure();
        Contents.on_load();
        if (State.get('is_loaded_by_pjax')) {
            if (Client.should_redirect_tax()) {
                return;
            }
            this.show_authenticate_message();
            if (RealityCheckData.get('delay_reality_init')) {
                RealityCheck.init();
            } else if (RealityCheckData.get('delay_reality_check')) {
                BinarySocket.send({ reality_check: 1 });
            }
        }
        if (Client.is_logged_in()) {
            ViewBalance.init();
        } else {
            LocalStore.set('reality_check.ack', 0);
        }
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
        const server  = localStorage.getItem('config.server_url');
        if (server && server.length > 0) {
            const message = (/www\.binary\.com/i.test(window.location.hostname) ? '' :
                localize('This is a staging server - For testing purposes only') + ' - ') +
                localize('The server <a href="[_1]">endpoint</a> is: [_2]', [url_for('endpoint'), server]),
                $end_note = $('#end-note');
            $end_note.html(message).removeClass('invisible');
            $('#footer').css('padding-bottom', $end_note.height());
        }
    },
    show_authenticate_message: function() {
        if ($('.authenticate-msg').length !== 0 || /authenticatews\.html/.test(window.location.pathname)) return;

        const p = $('<p/>', { class: 'authenticate-msg notice-msg' });
        let span;

        if (Client.status_detected('unwelcome')) {
            const purchase_button = $('.purchase_button');
            if (purchase_button.length > 0 && !purchase_button.parent().hasClass('button-disabled')) {
                $.each(purchase_button, function() {
                    $(this).off('click dblclick').removeAttr('data-balloon').parent()
                        .addClass('button-disabled');
                });
            }
        }

        if (Client.status_detected('unwelcome, cashier_locked', 'any')) {
            const if_balance_zero = $('#if-balance-zero');
            if (if_balance_zero.length > 0 && !if_balance_zero.hasClass('button-disabled')) {
                if_balance_zero.removeAttr('href').addClass('button-disabled');
            }
        }

        const href = window.location.href,
            cashier_page = /cashier[\/\w]*\.html/.test(href),
            withdrawal_page = cashier_page && !/(deposit|payment_agent_listws)/.test(href);

        if (Client.status_detected('authenticated, unwelcome', 'all')) {
            span = $('<span/>', { html: template(localize('Your account is currently suspended. Only withdrawals are now permitted. For further information, please contact [_1].', ['<a href="mailto:support@binary.com">support@binary.com</a>'])) });
        } else if (Client.status_detected('unwelcome')) {
            span = this.general_authentication_message();
        } else if (Client.status_detected('authenticated, cashier_locked', 'all') && cashier_page) {
            span = $('<span/>', { html: template(localize('Deposits and withdrawal for your account is not allowed at this moment. Please contact [_1] to unlock it.', ['<a href="mailto:support@binary.com">support@binary.com</a>'])) });
        } else if (Client.status_detected('cashier_locked') && cashier_page) {
            span = this.general_authentication_message();
        } else if (Client.status_detected('authenticated, withdrawal_locked', 'all') && withdrawal_page) {
            span = $('<span/>', { html: template(localize('Withdrawal for your account is not allowed at this moment. Please contact [_1] to unlock it.', ['<a href="mailto:support@binary.com">support@binary.com</a>'])) });
        } else if (Client.status_detected('withdrawal_locked') && withdrawal_page) {
            span = this.general_authentication_message();
        }
        if (span) {
            $('#content').find('> .container').prepend(p.append(span));
        }
    },
    general_authentication_message: function() {
        const div = $('<div/>', { text: localize('Please send us the following documents in order to verify your identity and authenticate your account:') });
        const ul  = $('<ul/>',  { class: 'checked' });
        const li1 = $('<li/>',  { text: localize('Proof of identity - A scanned copy of your passport, driving license (either provisional or full), or identity card that shows your full name and date of birth.') });
        const li2 = $('<li/>',  { text: localize('Proof of address - A scanned copy of a utility bill or bank statement that\'s not more than three months old.') });
        const p   = $('<p/>',   { html: localize('If you have any questions, kindly contact our Customer Support team at <a href="mailto:[_1]">[_1]</a>.', ['support@binary.com']) });
        return div.append(ul.append(li1, li2)).append(p);
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

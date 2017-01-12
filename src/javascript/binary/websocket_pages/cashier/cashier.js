const japanese_client = require('../../common_functions/country_base').japanese_client;
const Client   = require('../../base/client').Client;
const Header   = require('../../base/header').Header;
const url_for  = require('../../base/url').url_for;

const Cashier = (function() {
    'use strict';

    const lock_unlock_cashier = function(action, lock_type) {
        const toggle = action === 'lock' ? 'disable' : 'enable';
        $.each($('.' + lock_type), function() {
            replace_button(toggle, $(this).parent());
        });
    };

    const check_locked = function() {
        if (Client.get_boolean('is_virtual')) return;
        if (Client.status_detected('cashier_locked')) {
            lock_unlock_cashier('lock', 'deposit, .withdraw');
        } else if (Client.status_detected('withdrawal_locked')) {
            lock_unlock_cashier('lock', 'withdraw');
        } else if (Client.status_detected('unwelcome')) {
            lock_unlock_cashier('lock', 'deposit');
        } else if (sessionStorage.getItem('client_status') === null) {
            BinarySocket.send({ get_account_status: '1', passthrough: { dispatch_to: 'Cashier' } });
        }
    };

    const check_top_up_withdraw = function() {
        if (is_cashier_page) {
            const currency = Client.get_value('currency'),
                balance = Client.get_value('balance');
            if (Client.get_boolean('is_virtual')) {
                if ((currency !== 'JPY' && balance > 1000) ||
                    (currency === 'JPY' && balance > 100000)) {
                    replace_button('disable', '#VRT_topup_link');
                }
            } else if (!currency || +balance === 0) {
                lock_unlock_cashier('lock', 'withdraw');
            } else {
                lock_unlock_cashier('unlock', 'withdraw');
            }
        }
    };

    const replace_button = function(action, elementToReplace) {
        const $a = $(elementToReplace);
        if ($a.length === 0) return;
        const classToReplace = action === 'disable' ? 'pjaxload' : 'button-disabled',
            Replacement = action === 'disable' ? 'button-disabled' : 'pjaxload';
        // use replaceWith, to disable previously caught pjax event
        const new_element = { class: $a.attr('class').replace(classToReplace, Replacement), html: $a.html() },
            id = $a.attr('id');

        if (id) new_element.id = id;
        $a.replaceWith($('<a/>', new_element));
    };

    const onLoad = function() {
        if (is_cashier_page && Client.get_boolean('is_logged_in')) {
            Cashier.check_locked();
            Cashier.check_top_up_withdraw();
            Header.topbar_message_visibility(Client.landing_company());
        }
    };

    const is_cashier_page = function () {
        return /\/cashier\.html/.test(window.location.pathname);
    };

    const onLoadPaymentMethods = function() {
        if (japanese_client()) {
            window.location.href = url_for('/');
        }
        if (Client.get_boolean('is_logged_in') && !Client.get_boolean('is_virtual')) {
            Cashier.check_locked();
        }
    };

    return {
        check_locked         : check_locked,
        check_top_up_withdraw: check_top_up_withdraw,
        onLoad               : onLoad,
        onLoadPaymentMethods : onLoadPaymentMethods,
    };
})();

module.exports = {
    Cashier: Cashier,
};

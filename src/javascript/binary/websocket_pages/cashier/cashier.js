const japanese_client      = require('../../common_functions/country_base').japanese_client;
const japanese_residence   = require('../../common_functions/country_base').japanese_residence;
const BinaryPjax           = require('../../base/binary_pjax');
const Client               = require('../../base/client').Client;
const Header               = require('../../base/header').Header;
const default_redirect_url = require('../../base/url').default_redirect_url;

const Cashier = (function() {
    'use strict';

    let withdrawal_locked;

    const lock_unlock_cashier = function(action, lock_type) {
        const toggle = action === 'lock' ? 'disable' : 'enable';
        if (/withdraw/.test(lock_type) && withdrawal_locked) {
            return;
        }
        $.each($('.' + lock_type), function() {
            replace_button(toggle, $(this).parent());
        });
    };

    const check_locked = function() {
        if (Client.get('is_virtual')) return;
        if (japanese_client() && !japanese_residence()) BinaryPjax.load(default_redirect_url());
        if (Client.status_detected('cashier_locked')) {
            lock_unlock_cashier('lock', 'deposit, .withdraw');
            withdrawal_locked = true;
        } else if (Client.status_detected('withdrawal_locked')) {
            lock_unlock_cashier('lock', 'withdraw');
            withdrawal_locked = true;
        } else if (Client.status_detected('unwelcome')) {
            lock_unlock_cashier('lock', 'deposit');
        } else if (sessionStorage.getItem('client_status') === null) {
            BinarySocket.send({ get_account_status: '1', passthrough: { dispatch_to: 'Cashier' } });
        }
    };

    const check_top_up_withdraw = function() {
        BinarySocket.wait('authorize').then(() => {
            if (/cashier[\/\w]*\.html/.test(window.location.pathname)) {
                const currency = Client.get('currency'),
                    balance = Client.get('balance');
                if (Client.get('is_virtual')) {
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
        });
    };

    const replace_button = function(action, elementToReplace) {
        const $a = $(elementToReplace);
        if ($a.length === 0) return;
        const replace = ['button-disabled', 'toggle'];
        const disable = action === 'disable';
        const id = $a.attr('id');
        const href = $a.attr('href');
        const data_href = $a.attr('data-href');

        // use replaceWith, to disable previously caught pjax event
        const new_element = {
            class      : $a.attr('class').replace(replace[+disable], replace[+!disable]),
            id         : id,
            html       : $a.html(),
            href       : href || data_href,
            'data-href': href,
        };

        if (disable) {
            delete new_element.href;
        } else {
            delete new_element['data-href'];
        }
        if (!id) {
            delete new_element.id;
        }

        $a.replaceWith($('<a/>', new_element));
    };

    const onLoad = function() {
        if (Client.is_logged_in()) {
            withdrawal_locked = false;
            Cashier.check_locked();
            Cashier.check_top_up_withdraw();
            Header.topbar_message_visibility(); // To handle the upgrade buttons visibility
        }
    };

    return {
        check_locked         : check_locked,
        check_top_up_withdraw: check_top_up_withdraw,
        onLoad               : onLoad,

        PaymentMethods: { onLoad: () => { onLoad(); } },
    };
})();

module.exports = Cashier;

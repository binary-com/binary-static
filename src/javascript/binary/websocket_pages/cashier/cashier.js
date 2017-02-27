const japanese_client      = require('../../common_functions/country_base').japanese_client;
const japanese_residence   = require('../../common_functions/country_base').japanese_residence;
const Client               = require('../../base/client').Client;
const Header               = require('../../base/header').Header;
const default_redirect_url = require('../../base/url').default_redirect_url;

const Cashier = (function() {
    'use strict';

    let withdrawal_locked;

    const lockUnlockCashier = function(action, lock_type) {
        const toggle = action === 'lock' ? 'disable' : 'enable';
        if (/withdraw/.test(lock_type) && withdrawal_locked) {
            return;
        }
        $.each($('.' + lock_type), function() {
            replaceButton(toggle, $(this).parent());
        });
    };

    const checkLocked = function() {
        if (!Client.is_logged_in()) return;
        BinarySocket.wait('authorize').then(() => {
            if (Client.get('is_virtual')) return;
            if (japanese_client() && !japanese_residence()) {
                window.location.href = default_redirect_url();
                return;
            }
            checkTopUpWithdraw();
            BinarySocket.wait('get_account_status').then(() => {
                if (Client.status_detected('cashier_locked')) {
                    lockUnlockCashier('lock', 'deposit, .withdraw');
                    withdrawal_locked = true;
                } else if (Client.status_detected('withdrawal_locked')) {
                    lockUnlockCashier('lock', 'withdraw');
                    withdrawal_locked = true;
                } else if (Client.status_detected('unwelcome')) {
                    lockUnlockCashier('lock', 'deposit');
                }
            });
        });
    };

    const checkTopUpWithdraw = function() {
        BinarySocket.wait('balance').then(() => {
            const currency = Client.get('currency');
            const balance = Client.get('balance');
            if (Client.get('is_virtual')) {
                if ((currency !== 'JPY' && balance > 1000) ||
                    (currency === 'JPY' && balance > 100000)) {
                    replaceButton('disable', '#VRT_topup_link');
                }
            } else if (!currency || +balance === 0) {
                lockUnlockCashier('lock', 'withdraw');
            } else {
                lockUnlockCashier('unlock', 'withdraw');
            }
        });
    };

    const replaceButton = function(action, el_to_replace) {
        const $a = $(el_to_replace);
        if ($a.length === 0) return;
        const replace = ['button-disabled', 'pjaxload'];
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
            checkLocked();
            Header.topbar_message_visibility(Client.landing_company());
        }
    };

    return {
        checkLocked: checkLocked,
        onLoad     : onLoad,
    };
})();

module.exports = Cashier;

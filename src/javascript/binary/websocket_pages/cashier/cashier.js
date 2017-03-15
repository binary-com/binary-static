const BinaryPjax           = require('../../base/binary_pjax');
const Client               = require('../../base/client').Client;
const Header               = require('../../base/header').Header;
const default_redirect_url = require('../../base/url').default_redirect_url;
const url_for              = require('../../base/url').url_for;
const japanese_client      = require('../../common_functions/country_base').japanese_client;
const japanese_residence   = require('../../common_functions/country_base').japanese_residence;

const Cashier = (function() {
    'use strict';

    let href = '';
    const hidden_class = 'invisible';

    const showContent = () => {
        Client.activate_by_client_type();
    };

    const displayTopUpButton = () => {
        BinarySocket.wait('balance').then((response) => {
            const currency = response.balance.currency;
            const balance = +response.balance.balance;
            const can_topup = (currency !== 'JPY' && balance < 1000) || (currency === 'JPY' && balance < 100000);
            const top_up_id = '#VRT_topup_link';
            const $a = $(top_up_id);
            const classes = ['toggle', 'button-disabled'];
            const new_el = { class: $a.attr('class').replace(classes[+can_topup], classes[1 - +can_topup]), html: $a.html(), id: $a.attr('id') };
            if (can_topup) {
                href = href || url_for('/cashier/top_up_virtualws');
                new_el.href = href;
            }
            $a.replaceWith($('<a/>', new_el));
            $(top_up_id).parent().removeClass(hidden_class);
        });
    };

    const onLoad = function() {
        if (japanese_client() && !japanese_residence()) {
            BinaryPjax(default_redirect_url());
        }
        if (Client.is_logged_in()) {
            BinarySocket.wait('authorize').then(() => {
                Header.upgrade_message_visibility(); // To handle the upgrade buttons visibility
                const is_virtual = Client.get('is_virtual');
                if (is_virtual) {
                    displayTopUpButton();
                }
                if (is_virtual || /CR/.test(Client.get('loginid'))) {
                    $('#payment-agent-section').removeClass(hidden_class);
                }
                if (Client.has_gaming_financial_enabled()) {
                    $('#account-transfer-section').removeClass(hidden_class);
                }
            });
        }
        showContent();
    };

    return {
        onLoad        : onLoad,
        PaymentMethods: { onLoad: () => { showContent(); } },
    };
})();

module.exports = Cashier;

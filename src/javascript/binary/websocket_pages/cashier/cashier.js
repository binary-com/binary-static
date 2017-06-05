const BinarySocket       = require('../socket');
const BinaryPjax         = require('../../base/binary_pjax');
const Client             = require('../../base/client');
const Header             = require('../../base/header');
const defaultRedirectUrl = require('../../base/url').defaultRedirectUrl;
const urlFor             = require('../../base/url').urlFor;
const jpClient           = require('../../common_functions/country_base').jpClient;
const jpResidence        = require('../../common_functions/country_base').jpResidence;
const isCryptocurrency   = require('../../common_functions/currency_to_symbol').isCryptocurrency;

const Cashier = (() => {
    'use strict';

    let href = '';

    const showContent = () => {
        Client.activateByClientType();
    };

    const displayTopUpButton = () => {
        BinarySocket.wait('balance').then((response) => {
            const currency = response.balance.currency;
            const balance = +response.balance.balance;
            const can_topup = (currency !== 'JPY' && balance <= 1000) || (currency === 'JPY' && balance <= 100000);
            const top_up_id = '#VRT_topup_link';
            const $a = $(top_up_id);
            const classes = ['toggle', 'button-disabled'];
            const new_el = { class: $a.attr('class').replace(classes[+can_topup], classes[1 - +can_topup]), html: $a.html(), id: $a.attr('id') };
            if (can_topup) {
                href = href || urlFor('/cashier/top_up_virtualws');
                new_el.href = href;
            }
            $a.replaceWith($('<a/>', new_el));
            $(top_up_id).parent().setVisibility(1);
        });
    };

    const onLoad = () => {
        if (jpClient() && !jpResidence()) {
            BinaryPjax.load(defaultRedirectUrl());
        }
        if (Client.isLoggedIn()) {
            BinarySocket.wait('authorize').then(() => {
                Header.upgradeMessageVisibility(); // To handle the upgrade buttons visibility
                const is_virtual = Client.get('is_virtual');
                const is_crypto = isCryptocurrency(Client.get('currency'));
                if (is_virtual) {
                    displayTopUpButton();
                }
                if (is_virtual || (/CR/.test(Client.get('loginid')) && !is_crypto)) {
                    $('#payment-agent-section').setVisibility(1);
                }
                $(is_crypto ? '.crypto_currency' : '.normal_currency').setVisibility(1);
                if (Client.hasGamingFinancialEnabled()) {
                    $('#account-transfer-section').setVisibility(1);
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

const BinaryPjax           = require('../../base/binary_pjax');
const Client               = require('../../base/client').Client;
const Header               = require('../../base/header').Header;
const default_redirect_url = require('../../base/url').default_redirect_url;
const japanese_client      = require('../../common_functions/country_base').japanese_client;
const japanese_residence   = require('../../common_functions/country_base').japanese_residence;

const Cashier = (function() {
    'use strict';

    const showContent = () => {
        Client.activate_by_client_type();
    };

    const onLoad = function() {
        if (Client.is_logged_in()) {
            Header.upgrade_message_visibility(); // To handle the upgrade buttons visibility
            if (Client.get('is_virtual') || /CR/.test(Client.get('loginid'))) {
                $('#payment-agent-section').removeClass('invisible');
            }
            if (Client.has_gaming_financial_enabled()) {
                $('#account-transfer-section').removeClass('invisible');
            }
            if (japanese_client() && !japanese_residence()) {
                BinaryPjax(default_redirect_url());
                return;
            }
        }
        showContent();
    };

    return {
        onLoad        : onLoad,
        PaymentMethods: { onLoad: () => { showContent(); } },
    };
})();

module.exports = Cashier;

const BinarySocket         = require('../../socket');
const BinaryPjax           = require('../../../base/binary_pjax');
const Client               = require('../../../base/client');
const localize             = require('../../../base/localize').localize;
const State                = require('../../../base/storage').State;
const defaultRedirectUrl   = require('../../../base/url').defaultRedirectUrl;
const appendTextValueChild = require('../../../common_functions/common_functions').appendTextValueChild;

const SubAccOpening = (() => {
    'use strict';

    const form = '#frm_sub_account';
    const select_currency = 'select_currency';

    const onLoad = () => {
        const authorize = State.get(['response', 'authorize', 'authorize']);
        // only clients with omnibus flag set are allowed to create sub accounts
        if (!authorize.allow_omnibus) {
            BinaryPjax.load(defaultRedirectUrl());
            return;
        }

        const currencies = Client.get('currencies').split(',');
        /* TODO: filter currencies that are shown to client based on their master account currency
            and any existing sub-accounts' currencies when BTC is added to payout currencies call */
        currencies.forEach((c) => {
            appendTextValueChild(select_currency, c, c);
        });
        $(form).on('submit', (e) => {
            e.preventDefault();
            BinarySocket.send({ new_sub_account: 1 }).then((response) => {
                if (response.error) {
                    showError(response.error.message);
                } else {
                    handleNewAccount(response);
                }
            });
        });
    };

    const handleNewAccount = (response) => {
        const new_account = response.new_sub_account;
        BinarySocket.send({ authorize: new_account.oauth_token }).then((response_authorize) => {
            if (response_authorize.error) {
                showError(response_authorize.error.message);
            } else {
                BinarySocket.send({ set_account_currency: $(`#${select_currency}`).val() }).then((response_set_account_currency) => {
                    if (response_set_account_currency.error) {
                        showError(response_set_account_currency.error.message);
                    } else {
                        Client.processNewAccount(new_account.email, new_account.client_id, new_account.oauth_token);
                    }
                });
            }
        });
    };

    const showError = (message) => {
        $('#error-account-opening').setVisibility(1).text(localize(message));
    };

    return {
        onLoad: onLoad,
    };
})();

module.exports = SubAccOpening;

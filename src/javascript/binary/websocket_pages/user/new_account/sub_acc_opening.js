const BinarySocket         = require('../../socket');
const BinaryPjax           = require('../../../base/binary_pjax');
const Client               = require('../../../base/client');
const localize             = require('../../../base/localize').localize;
const State                = require('../../../base/storage').State;
const defaultRedirectUrl   = require('../../../base/url').defaultRedirectUrl;
const appendTextValueChild = require('../../../common_functions/common_functions').appendTextValueChild;
const Currency             = require('../../../common_functions/currency_to_symbol');

const SubAccOpening = (() => {
    'use strict';

    const select_currency = 'select_currency';

    const onLoad = () => {
        const authorize = State.get(['response', 'authorize', 'authorize']);
        // only clients with omnibus flag set are allowed to create sub accounts
        if (!authorize || !authorize.allow_omnibus) {
            BinaryPjax.load(defaultRedirectUrl());
            return;
        }

        const currencies = getCurrencies(authorize.sub_accounts);
        if (!currencies.length) {
            BinaryPjax.load(defaultRedirectUrl());
            return;
        }
        currencies.forEach((c) => {
            appendTextValueChild(select_currency, c, c);
        });

        $('#frm_sub_account').on('submit', (e) => {
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

    const getCurrencies = (sub_accounts) => {
        const client_currency  = Client.get('currency');
        const currencies       = Client.get('currencies').split(',');
        const is_crypto        = Currency.isCryptocurrency(client_currency);
        const cryptocurrencies = Currency.getCryptocurrencies();
        const sub_currencies   = sub_accounts.length ? sub_accounts.map(a => a.currency) : [];

        const has_fiat_sub = sub_accounts.length ? sub_currencies.some(currency => currency && new RegExp(currency, 'i').test(currencies)) : false;
        const available_crypto =
            cryptocurrencies.filter(c => sub_currencies.concat(is_crypto ? client_currency : []).indexOf(c) < 0);
        const can_open_crypto = available_crypto.length;

        let currencies_to_show = [];
        // only allow client to open more sub accounts if the last currency is not to be reserved for master account
        if ((client_currency && (can_open_crypto || !has_fiat_sub)) ||
            (!client_currency && (available_crypto.length > 1 || (can_open_crypto && !has_fiat_sub)))) {
            // if have sub account with fiat currency, or master account is fiat currency, only show cryptocurrencies
            // else show all
            currencies_to_show =
                has_fiat_sub || (!is_crypto && client_currency) ?
                    cryptocurrencies : currencies;
            // remove client's currency and sub account currencies from list of currencies to show
            currencies_to_show = currencies_to_show.filter(c => sub_currencies.concat(client_currency).indexOf(c) < 0);
        }

        return currencies_to_show;
    };

    const handleNewAccount = (response) => {
        const new_account = response.new_sub_account;
        BinarySocket.send({ authorize: new_account.oauth_token }, { forced: true }).then((response_authorize) => {
            if (response_authorize.error) {
                showError(response_authorize.error.message);
            } else {
                BinarySocket.send({ set_account_currency: $(`#${select_currency}`).val() }).then((response_set_account_currency) => {
                    if (response_set_account_currency.error) {
                        showError(response_set_account_currency.error.message);
                    } else {
                        Client.processNewAccount(Client.get('email'), new_account.client_id, new_account.oauth_token);
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

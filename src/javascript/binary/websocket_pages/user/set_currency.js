const getCurrencyValues  = require('./sub_account').getCurrencyValues;
const BinarySocket       = require('../socket');
const BinaryPjax         = require('../../base/binary_pjax');
const Client             = require('../../base/client');
const localize           = require('../../base/localize').localize;
const State              = require('../../base/storage').State;
const urlFor             = require('../../base/url').urlFor;
const urlForStatic       = require('../../base/url').urlForStatic;
const defaultRedirectUrl = require('../../base/url').defaultRedirectUrl;
const Currency           = require('../../common_functions/currency');

const SetCurrency = (() => {
    'use strict';

    const onLoad = () => {
        if (Client.get('currency')) {
            BinaryPjax.load(defaultRedirectUrl());
            return;
        }
        const hash_value = window.location.hash;
        const el = /new_account/.test(hash_value) ? 'show' : 'hide';
        $(`#${el}_new_account`).setVisibility(1);
        BinarySocket.wait('landing_company').then((response) => {
            const authorize = State.get(['response', 'authorize', 'authorize']) || {};
            const currencies = getCurrencies(authorize, response.landing_company);
            const $currency_list = $('#currency_list');
            currencies.forEach((c) => {
                $currency_list
                    .append($('<div/>', { class: 'gr-3 currency_wrapper', id: c })
                        .append($('<div/>').append($('<img/>', { src: urlForStatic(`images/pages/set_currency/${c.toLowerCase()}.svg`) })))
                        .append($('<div/>', { text: `${Currency.formatCurrency(c)} ${c}` })));
            });

            $('#set_currency_loading').remove();
            $('#set_currency').setVisibility(1);

            const allow_omnibus = authorize.allow_omnibus;
            $('.currency_wrapper').on('click', function () {
                $currency_list.find('> div').removeClass('selected');
                $(this).addClass('selected');
                if (allow_omnibus) {
                    const chosen_currency = $(this).attr('id');
                    $('#chosen_currency_type').text(Currency.isCryptocurrency(chosen_currency) ? localize('Cryptocurrency') : localize('Fiat Currency'));
                    $('#chosen_currency').text(chosen_currency);
                    $('#currency_notice').setVisibility(1);
                }
            });

            const $form = $('#frm_set_currency');
            const $error = $form.find('.error-msg');
            $form.on('submit', (evt) => {
                evt.preventDefault();
                $error.setVisibility(0);
                const $selected_currency = $currency_list.find('.selected');
                if ($selected_currency.length) {
                    BinarySocket.send({ set_account_currency: $selected_currency.attr('id') }).then((response_c) => {
                        if (response_c.error) {
                            $error.text(response_c.error.message).setVisibility(1);
                        } else {
                            let redirect_url = 'user/accounts',
                                hash = '';
                            if (/deposit/.test(hash_value)) {
                                redirect_url = 'cashier/forwardws';
                                hash = '#deposit';
                            } else if (/withdraw/.test(hash_value)) {
                                redirect_url = 'cashier/forwardws';
                                hash = '#withdraw';
                            }
                            window.location.href = urlFor(redirect_url) + hash; // load without pjax
                        }
                    });
                } else {
                    $error.text(localize('Please choose a currency')).setVisibility(1);
                }
            });
        });
    };

    const getCurrencies = (authorize, landing_company) => {
        let currencies_to_show;
        const currency_values = getCurrencyValues(authorize.sub_accounts, landing_company);
        const currencies      = currency_values.currencies;
        if (authorize.allow_omnibus) {
            const sub_currencies  = currency_values.sub_currencies;

            currencies_to_show = currencies.filter(c => sub_currencies.indexOf(c) < 0);

            const has_fiat_sub = currency_values.has_fiat_sub;
            if (has_fiat_sub) {
                const fiat_currencies = currency_values.fiat_currencies;
                currencies_to_show = currencies_to_show.filter(c => fiat_currencies.indexOf(c) < 0);
            }
        } else {
            const cryptocurrencies = currency_values.cryptocurrencies;
            currencies_to_show = currencies.filter(c => cryptocurrencies.indexOf(c) < 0);
        }

        return currencies_to_show;
    };

    return {
        onLoad: onLoad,
    };
})();

module.exports = SetCurrency;

const getCurrencyValues = require('./sub_account').getCurrencyValues;
const BinarySocket      = require('../socket');
const BinaryPjax        = require('../../base/binary_pjax');
const Client            = require('../../base/client');
const localize          = require('../../base/localize').localize;
const State             = require('../../base/storage').State;
const Url               = require('../../base/url');
const isCryptocurrency  = require('../../common_functions/currency').isCryptocurrency;

const SetCurrency = (() => {
    'use strict';

    const onLoad = () => {
        const hash_value = window.location.hash;
        const el = /new_account/.test(hash_value) ? 'show' : 'hide';
        $(`#${el}_new_account`).setVisibility(1);

        if (Client.get('currency')) {
            if (/new_account/.test(hash_value)) {
                $('#set_currency_loading').remove();
                $('#has_currency, #set_currency').setVisibility(1);
            } else {
                BinaryPjax.load(Url.defaultRedirectUrl());
            }
            return;
        }

        BinarySocket.wait('payout_currencies').then((response) => {
            const authorize = State.getResponse('authorize');
            const payout_currencies = response.payout_currencies;
            const currency_values = getCurrencyValues(authorize.sub_accounts);
            const currencies = getCurrencies(authorize, payout_currencies, currency_values);
            const $fiat_currencies = $('<div/>');
            const $cryptocurrencies = $('<div/>');
            currencies.forEach((c) => {
                (isCryptocurrency(c) ? $cryptocurrencies : $fiat_currencies)
                    .append($('<div/>', { class: 'gr-3 currency_wrapper', id: c })
                        .append($('<div/>').append($('<img/>', { src: Url.urlForStatic(`images/pages/set_currency/${c.toLowerCase()}.svg`) })))
                        .append($('<div/>', { html: c })));
            });
            const fiat_currencies = $fiat_currencies.html();
            if (fiat_currencies) {
                $('#fiat_currencies').setVisibility(1);
                $('#fiat_currency_list').html(fiat_currencies);
            }
            const crytpo_currencies = $cryptocurrencies.html();
            if (crytpo_currencies) {
                $('#crypto_currencies').setVisibility(1);
                $('#crypto_currency_list').html(crytpo_currencies);
            }

            $('#set_currency_loading').remove();
            $('#set_currency, .select_currency').setVisibility(1);

            const $currency_list = $('.currency_list');
            $('.currency_wrapper').on('click', function () {
                $currency_list.find('> div').removeClass('selected');
                $(this).addClass('selected');
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
                            Client.set('currency', response_c.echo_req.set_account_currency);
                            BinarySocket.send({ balance: 1 });
                            BinarySocket.send({ payout_currencies: 1 }, { forced: true });

                            let redirect_url,
                                hash;
                            if (/deposit/.test(hash_value)) {
                                redirect_url = 'cashier/forwardws';
                                hash = '#deposit';
                            } else if (/withdraw/.test(hash_value)) {
                                redirect_url = 'cashier/forwardws';
                                hash = '#withdraw';
                            }
                            if (redirect_url) {
                                window.location.href = Url.urlFor(redirect_url) + hash; // load without pjax
                            } else {
                                $('.select_currency').setVisibility(0);
                                $('#has_currency').setVisibility(1);
                            }
                        }
                    });
                } else {
                    $error.text(localize('Please choose a currency')).setVisibility(1);
                }
            });
        });
    };

    const getCurrencies = (authorize, payout_currencies, currency_values) => {
        let currencies_to_show = payout_currencies;
        if (authorize.allow_omnibus) {
            const sub_currencies  = currency_values.sub_currencies;

            currencies_to_show = currencies_to_show.filter(c => sub_currencies.indexOf(c) < 0);

            const has_fiat_sub = currency_values.has_fiat_sub;
            if (has_fiat_sub) {
                const fiat_currencies = currency_values.fiat_currencies;
                currencies_to_show = currencies_to_show.filter(c => fiat_currencies.indexOf(c) < 0);
            }
        }

        return currencies_to_show;
    };

    return {
        onLoad: onLoad,
    };
})();

module.exports = SetCurrency;

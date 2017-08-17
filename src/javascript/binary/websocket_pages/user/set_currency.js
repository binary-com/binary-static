const BinarySocket     = require('../socket');
const BinaryPjax       = require('../../base/binary_pjax');
const Client           = require('../../base/client');
const Header           = require('../../base/header');
const localize         = require('../../base/localize').localize;
const State            = require('../../base/storage').State;
const Url              = require('../../base/url');
const isCryptocurrency = require('../../common_functions/currency').isCryptocurrency;

const SetCurrency = (() => {
    'use strict';

    let is_new_account;

    const onLoad = () => {
        is_new_account = localStorage.getItem('is_new_account');
        localStorage.removeItem('is_new_account');
        const el = is_new_account ? 'show' : 'hide';
        $(`#${el}_new_account`).setVisibility(1);

        if (Client.get('currency')) {
            if (is_new_account) {
                $('#set_currency_loading').remove();
                $('#has_currency, #set_currency').setVisibility(1);
            } else {
                BinaryPjax.loadPreviousUrl();
            }
            return;
        }

        BinarySocket.wait('payout_currencies').then((response) => {
            const payout_currencies = response.payout_currencies;
            const $fiat_currencies = $('<div/>');
            const $cryptocurrencies = $('<div/>');
            payout_currencies.forEach((c) => {
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
                            Header.displayAccountStatus();

                            let redirect_url;
                            if (is_new_account) {
                                if (Client.isAccountOfType('financial')) {
                                    const get_account_status = State.getResponse('get_account_status');
                                    if (!/authenticated/.test(get_account_status.status)) {
                                        redirect_url = Url.urlFor('user/authenticate');
                                    }
                                }
                            } else {
                                redirect_url = BinaryPjax.getPreviousUrl();
                            }
                            if (redirect_url) {
                                window.location.href = redirect_url; // load without pjax
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

    return {
        onLoad: onLoad,
    };
})();

module.exports = SetCurrency;

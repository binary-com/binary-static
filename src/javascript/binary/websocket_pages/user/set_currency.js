const BinarySocket       = require('../socket');
const BinaryPjax         = require('../../base/binary_pjax');
const Client             = require('../../base/client');
const localize           = require('../../base/localize').localize;
const urlFor             = require('../../base/url').urlFor;
const urlForStatic       = require('../../base/url').urlForStatic;
const defaultRedirectUrl = require('../../base/url').defaultRedirectUrl;
const formatCurrency     = require('../../common_functions/currency').formatCurrency;

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
            const loginid_array = Client.get('loginid_array');
            const current_account = loginid_array.find(login => Client.get('loginid') === login.id);
            const currencies = Client.getLandingCompanyValue(current_account, response.landing_company, 'legal_allowed_currencies');
            const $currency_list = $('#currency_list');
            currencies.forEach((c) => {
                $currency_list
                    .append($('<div/>', { class: 'gr-3 currency_wrapper', id: c })
                        .append($('<div/>').append($('<img/>', { src: urlForStatic(`images/pages/set_currency/${c.toLowerCase()}.svg`) })))
                        .append($('<div/>', { text: `${formatCurrency(c)} ${c}` })));
            });

            $('#set_currency_loading').remove();
            $('#set_currency').setVisibility(1);

            $('.currency_wrapper').on('click', function () {
                $currency_list.find('> div').removeClass('selected');
                $(this).addClass('selected');
            });

            const $form = $('#frm_set_currency');
            const $error = $form.find('.error-msg');
            $form.on('submit', (evt) => {
                evt.preventDefault();
                $error.setVisibility(0);
                const selected_currency = $currency_list.find('.selected');
                if (selected_currency.length) {
                    BinarySocket.send({ set_account_currency: selected_currency.attr('id') }).then((response_c) => {
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

    return {
        onLoad: onLoad,
    };
})();

module.exports = SetCurrency;

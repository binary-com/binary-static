const getCurrencies    = require('./get_currency').getCurrencies;
const BinaryPjax       = require('../../base/binary_pjax');
const Client           = require('../../base/client');
const Header           = require('../../base/header');
const BinarySocket     = require('../../base/socket');
const getCurrencyName  = require('../../common/currency').getCurrencyName;
const isCryptocurrency = require('../../common/currency').isCryptocurrency;
const localize         = require('../../../_common/localize').localize;
const State            = require('../../../_common/storage').State;
const Url              = require('../../../_common/url');
const getPropertyValue = require('../../../_common/utility').getPropertyValue;

const SetCurrency = (() => {
    let is_new_account;

    const onLoad = () => {
        is_new_account = localStorage.getItem('is_new_account');
        const el = is_new_account ? 'show' : 'hide';
        $(`#${el}_new_account`).setVisibility(1);

        const { can_upgrade, type } = Client.getUpgradeInfo();
        $('#upgrade_to_mf').setVisibility(can_upgrade && type === 'financial');

        if (Client.get('currency')) {
            if (is_new_account) {
                $('#set_currency_loading').remove();
                $('#deposit_btn, #set_currency').setVisibility(1);
            } else {
                BinaryPjax.loadPreviousUrl();
            }
            return;
        }

        BinarySocket.wait('payout_currencies', 'landing_company').then(() => {
            const landing_company  = State.getResponse('landing_company');
            const default_currency = getPropertyValue(landing_company.financial_company, 'legal_default_currency') ||
                getPropertyValue(landing_company.gaming_company, 'legal_default_currency') || '';
            let currencies         = State.getResponse('payout_currencies');

            if (Client.get('landing_company_shortcode') === 'costarica') {
                currencies = getCurrencies(landing_company);
            }
            const $fiat_currencies  = $('<div/>');
            const $cryptocurrencies = $('<div/>');
            currencies.forEach((c) => {
                (isCryptocurrency(c) ? $cryptocurrencies : $fiat_currencies)
                    .append($('<div/>', { class: 'gr-2 gr-3-m currency_wrapper', id: c })
                        .append($('<div/>').append($('<img/>', { src: Url.urlForStatic(`images/pages/set_currency/${c.toLowerCase()}.svg`) })))
                        .append($('<div/>', { class: 'currency-name', html: (isCryptocurrency(c) ? `${getCurrencyName(c)}<br />(${c})` : c) })));
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

            if (default_currency) {
                $(`#${default_currency}`).addClass('selected');
            }

            const $currency_list = $('.currency_list');
            const popup_selector = '#set_currency_popup_container';
            $('.currency_wrapper').on('click', function () {
                $currency_list.find('> div').removeClass('selected');
                $(this).addClass('selected');
                const $popup_container = $('#set_currency_popup');
                const $popup_content   = $('#set_currency_popup_content');

                let localized_text = '';
                if (isCryptocurrency($(this).attr('id'))) {
                    localized_text = localize('You have chosen [_1] as the currency for this account. You cannot change this later. You can have more than one cryptocurrency account.', $(this).attr('id'));
                } else {
                    localized_text = localize('You have chosen [_1] as the currency for this account. You cannot change this later. You can have one fiat currency account only.', $(this).attr('id'));
                }
                $popup_content.text(localized_text).setVisibility(1);
                $('body').append($('<div/>', { id: 'set_currency_popup_container', class: 'lightbox' }).append($popup_container.clone().setVisibility(1)));

                const $popup = $(popup_selector);

                $popup.find('#btn_confirm, #btn_back').off('click').bind('click', function (e) {
                    e.preventDefault();
                    const $error = $popup_container.find('.error-msg');
                    $error.setVisibility(0);
                    if ($(this).attr('id') === 'btn_confirm') {
                        const $selected_currency = $currency_list.find('.selected');
                        if ($selected_currency.length) {
                            BinarySocket.send({ set_account_currency: $selected_currency.attr('id') }).then((response_c) => {
                                if (response_c.error) {
                                    $error.text(response_c.error.message).setVisibility(1);
                                } else {
                                    localStorage.removeItem('is_new_account');
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
                                        // Do not redirect MX clients to cashier, because they need to set max limit before making deposit
                                        if (!redirect_url && !/^(iom)$/i.test(Client.get('landing_company_shortcode'))) {
                                            redirect_url = Url.urlFor('cashier');
                                        }
                                    } else {
                                        redirect_url = BinaryPjax.getPreviousUrl();
                                    }

                                    if (redirect_url) {
                                        window.location.href = redirect_url; // load without pjax
                                    } else {
                                        Header.populateAccountsList(); // update account title
                                        $('.select_currency').setVisibility(0);
                                        $('#deposit_btn').setVisibility(1);
                                    }
                                }
                            });
                        } else {
                            $error.text(localize('Please choose a currency')).setVisibility(1);
                        }
                    } else {
                        $currency_list.find('> div').removeClass('selected');
                    }
                    $popup.remove();
                });
            });
        });
    };

    return {
        onLoad,
    };
})();

module.exports = SetCurrency;

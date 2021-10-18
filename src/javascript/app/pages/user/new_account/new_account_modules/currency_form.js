const BinarySocket = require('../../../../base/socket');
const Currency     = require('../../../../common/currency');
const localize     = require('../../../../../_common/localize').localize;
const Url          = require('../../../../../_common/url');

const SetCurrency = (() => {
    let $error,
        $currency_list;

    const currencies_display_order = [
        'USD',
        'EUR',
        'GBP',
        'AUD',
        'BTC',
        'ETH',
        'LTC',
        'UST',
        'eUSDT',
        'BUSD',
        'DAI',
        'EURS',
        'IDK',
        'PAX',
        'TUSD',
        'USDC',
        'USDK',
    ];

    const init = async (fields, real_account_signup_target) => {
        $currency_list = $('.currency_list');
        $error = $('#set_currency').find('.error-msg');
        const default_value = fields[0].default_value;
        const landing_company = (await BinarySocket.wait('landing_company')).landing_company;
        populateCurrencies(getAvailableCurrencies(landing_company, real_account_signup_target));
        onSelection(true);

        if (default_value) $currency_list.find(`#${default_value}`).addClass('selected');
    };

    const getAvailableCurrencies = (landing_company, real_account_signup_target) => {
        const target = getTargetCompany(landing_company, real_account_signup_target);
        if (landing_company[`${target}_company`]) {
            return getSortedCurrencies(landing_company[`${target}_company`].legal_allowed_currencies);
        }
        return [];
    };
    
    const getTargetCompany = (landing_company, real_account_signup_target) => {
        if (real_account_signup_target === 'maltainvest') return 'financial';
        return landing_company.gaming_company ? 'gaming' : 'financial';
    };

    const getSortedCurrencies = (currency_list) => currency_list.sort((a, b) => {
        if (currencies_display_order.indexOf(a) < currencies_display_order.indexOf(b)) {
            return -1;
        }
        if (currencies_display_order.indexOf(a) > currencies_display_order.indexOf(b)) {
            return 1;
        }
        return 0;
    });

    const populateCurrencies = (currencies) => {
        const $fiat_currencies = $('<div/>');
        const $cryptocurrencies = $('<div/>');
        currencies.forEach((c) => {
            const $wrapper = $('<div/>', { class: 'gr-2 gr-6-m currency_wrapper', id: c });
            const $image = $('<div/>').append($('<img/>', { src: Url.urlForStatic(`images/pages/set_currency/${c.toLowerCase()}.svg`) }));
            const $name = $('<div/>', { class: 'currency-name' });

            if (Currency.isCryptocurrency(c)) {
                const $display_name = $('<span/>', {
                    text: Currency.getCurrencyName(c) || c,
                    ...(/^UST$/.test(c) && {
                        'data-balloon'       : localize('Tether Omni (USDT) is a version of Tether that\'s pegged to USD and is built on the Bitcoin blockchain.'),
                        'data-balloon-length': 'medium',
                        'data-balloon-pos'   : 'top',
                        'class'              : 'show-mobile',
                    }),
                    ...(/^eUSDT/.test(c) && {
                        'data-balloon'       : localize('Tether ERC20 (eUSDT) is a version of Tether that\'s pegged to USD and is hosted on the Ethereum platform.'),
                        'data-balloon-length': 'medium',
                        'data-balloon-pos'   : 'top',
                        'class'              : 'show-mobile',
                    }),
                });

                $name.append($display_name).append($('<br/>')).append(`(${Currency.getCurrencyDisplayCode(c)})`);
            } else {
                $name.text(c);
            }

            $wrapper.append($image).append($name);
            (Currency.isCryptocurrency(c) ? $cryptocurrencies : $fiat_currencies).append($wrapper);
        });
        const fiat_currencies = $fiat_currencies.html();
        if (fiat_currencies) {
            $('#fiat_currencies').setVisibility(1);
            $('#fiat_currency_list').html(fiat_currencies).parent().setVisibility(1);
        }
        const crypto_currencies = $cryptocurrencies.html();
        if (crypto_currencies) {
            $('#crypto_currencies').setVisibility(1);
            $('#crypto_currency_list').html(crypto_currencies).parent().setVisibility(1);
        }

        $('#set_currency, .select_currency').setVisibility(1);
    };

    const onSelection = () => {
        $('.currency_wrapper').off('click dblclick').on('click dblclick', function () {
            if ($error) $error.setVisibility(0);
            const $clicked_currency = $(this);
            $currency_list.find('> div').removeClass('selected');
            $clicked_currency.addClass('selected');
        });
    };

    return {
        init,
    };
})();

module.exports = SetCurrency;

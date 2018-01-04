const BinaryPjax   = require('../../base/binary_pjax');
const Client       = require('../../base/client');
const Currency     = require('../../common/currency');
const Validation   = require('../../common/form_validation');
const localize     = require('../../../_common/localize').localize;
const paramsHash   = require('../../../_common/url').paramsHash;
const urlFor       = require('../../../_common/url').urlFor;

const BitcoinVoucher = (() => {
    const form_selector = '#mainform123';
    let $container,
        currency;

    const onLoad = () => {
        if (Client.get('residence') !== 'id') {
            BinaryPjax.loadPreviousUrl();
            return;
        }

        currency = Client.get('currency');
        if (!currency) {
            BinaryPjax.load('user/set-currency');
            return;
        }

        $container = $('#voucher_container').setVisibility(1);
        const show_success_message = paramsHash(window.location.href).success === 'true';
        $container.find(show_success_message ? '#message_container' : '#form_container').setVisibility(1);
        if (show_success_message) return;

        const login_id = Client.get('loginid');
        $container.find('#id123-control36043376').val(login_id);
        $container.find('#lbl_loginid').text(login_id);

        const email   = Client.get('email');
        $container.find('#id123-control36043400').val(email);
        $container.find('#lbl_email').text(email);

        $container.find('#id123-control36104883').val(currency);
        $container.find('#lbl_currency').html(Currency.formatCurrency(currency));

        // Form validation
        const min_fiat = 50;
        if (!Currency.isCryptocurrency(currency)) {
            $.getJSON('https://api.coinmarketcap.com/v1/ticker/', (rates) => {
                const rate       = rates.find(r => r.symbol === currency);
                const min_amount = rate && rate.price_usd ? (min_fiat / rate.price_usd).toFixed(4) :
                    Currency.getMinWithdrawal(currency);
                initValidation(min_amount);
            });
        } else {
            initValidation(min_fiat);
        }

        $container.find('#form_container button').on('click', (e) => {
            if (!Validation.validate(form_selector)) e.preventDefault();
        });
    };

    const initValidation = (min_amount) => {
        const decimals  = Currency.getDecimalPlaces(currency);
        const balance   = Client.get('balance');
        const amount_id = '#id123-control36043409';
        Validation.init(form_selector, [
            { selector: amount_id, validations: ['req', ['number', { type: 'float', min: min_amount, decimals }], ['custom', { func: () => (balance && (+balance >= +$(amount_id).val())), message: localize('You have insufficient funds in your Binary account, please <a href="[_1]">add funds</a>.', [urlFor('cashier')]) }]] },
        ]);
    };

    return {
        onLoad,
    };
})();

module.exports = BitcoinVoucher;

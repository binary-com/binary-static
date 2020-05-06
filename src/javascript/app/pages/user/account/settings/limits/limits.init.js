const LimitsUI           = require('./limits.ui');
const Client             = require('../../../../../base/client');
const BinarySocket       = require('../../../../../base/socket');
const Currency           = require('../../../../../common/currency');
const elementTextContent = require('../../../../../../_common/common_functions').elementTextContent;
const getElementById     = require('../../../../../../_common/common_functions').getElementById;
const localize           = require('../../../../../../_common/localize').localize;
const getPropertyValue   = require('../../../../../../_common/utility').getPropertyValue;

const LimitsInit = (() => {
    const limitsHandler = async (response, response_active_symbols) => {
        const limits = response.get_limits;
        LimitsUI.fillLimitsTable(limits, response_active_symbols);

        const el_withdraw_limit = getElementById('withdrawal-limit');

        const response_get_account_status = await BinarySocket.wait('get_account_status');
        if (/authenticated/.test(getPropertyValue(response_get_account_status, ['get_account_status', 'status']))) {
            elementTextContent(el_withdraw_limit, localize('Your account is fully authenticated and your withdrawal limits have been lifted.'));
        } else {
            const el_withdrawn = getElementById('already-withdraw');

            const currency         = Client.get('currency') || Client.currentLandingCompany().legal_default_currency;
            const base_currency    = 'USD';
            const should_convert   = currency !== base_currency;
            const display_currency = Currency.getCurrencyDisplayCode(currency);

            let exchange_rate;
            if (should_convert) {
                const response_exchange_rates = await BinarySocket.send({ exchange_rates: 1, base_currency });
                exchange_rate = getPropertyValue(response_exchange_rates, ['exchange_rates', 'rates', currency]);
            }

            const getCoversionText = (amount) => should_convert ? ` (${amount} ${Currency.getCurrencyDisplayCode(base_currency)})` : '';

            const days_limit = Currency.formatMoney(currency, limits.num_of_days_limit, 1);
            const days_limit_converted =
                Currency.formatMoney(base_currency, limits.num_of_days_limit / exchange_rate, 1);

            if (Client.get('landing_company_shortcode') === 'iom') {
                const withdrawal_for_days = Currency.formatMoney(currency, limits.withdrawal_for_x_days_monetary, 1);
                const withdrawal_for_days_converted =
                    Currency.formatMoney(base_currency, limits.withdrawal_for_x_days_monetary / exchange_rate, 1);

                elementTextContent(el_withdraw_limit,
                    localize('Your [_1] day withdrawal limit is currently [_2][_3].', [
                        limits.num_of_days,
                        `${days_limit} ${display_currency}`,
                        getCoversionText(days_limit_converted),
                    ]));
                elementTextContent(el_withdrawn,
                    localize('You have already withdrawn [_1][_2] in aggregate over the last [_3] days.', [
                        `${withdrawal_for_days} ${display_currency}`,
                        getCoversionText(withdrawal_for_days_converted),
                        limits.num_of_days,
                    ]));
            } else {
                const withdrawal_since_inception = Currency.formatMoney(
                    currency,
                    limits.withdrawal_since_inception_monetary,
                    1);

                const withdrawal_since_inception_converted = Currency.formatMoney(
                    base_currency,
                    limits.withdrawal_since_inception_monetary / exchange_rate,
                    1);

                elementTextContent(el_withdraw_limit,
                    localize('Your withdrawal limit is [_1][_2].', [
                        `${days_limit} ${display_currency}`,
                        getCoversionText(days_limit_converted),
                    ]));
                elementTextContent(el_withdrawn,
                    localize('You have already withdrawn [_1][_2].', [
                        `${withdrawal_since_inception} ${display_currency}`,
                        getCoversionText(withdrawal_since_inception_converted),
                    ]));
            }

            const el_withdraw_limit_agg = getElementById('withdrawal-limit-aggregate');
            const remainder = Currency.formatMoney(currency, limits.remainder, 1);
            const remainder_converted = should_convert ? Currency.formatMoney(base_currency, limits.remainder / exchange_rate, 1) : '';

            elementTextContent(el_withdraw_limit_agg,
                localize('Hence, your withdrawable balance is only up to [_1][_2], subject to your account’s available funds.', [
                    `${remainder} ${display_currency}`,
                    getCoversionText(remainder_converted),
                ]));

            if (should_convert) {
                $('#withdrawal-limits').setVisibility(1);
            }
        }

        $('#loading').remove();
    };

    const initTable = () => {
        LimitsUI.clearTableContent();
    };

    return {
        limitsHandler,
        clean: initTable,
    };
})();

module.exports = LimitsInit;

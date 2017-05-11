const LimitsUI           = require('./limits.ui');
const Client             = require('../../../../../base/client');
const localize           = require('../../../../../base/localize').localize;
const elementTextContent = require('../../../../../common_functions/common_functions').elementTextContent;
const formatMoney        = require('../../../../../common_functions/currency_to_symbol').formatMoney;

const LimitsInit = (() => {
    'use strict';

    const limitsHandler = (response) => {
        const limits = response.get_limits;
        LimitsUI.fillLimitsTable(limits);

        const el_withdraw_limit     = document.getElementById('withdrawal-limit');
        const el_withdrawn          = document.getElementById('already-withdraw');
        const el_withdraw_limit_agg = document.getElementById('withdrawal-limit-aggregate');

        if (limits.lifetime_limit === 99999999 && limits.num_of_days_limit === 99999999) {
            elementTextContent(el_withdraw_limit, localize('Your account is fully authenticated and your withdrawal limits have been lifted.'));
        } else {
            let txt_withdraw_lim           = 'Your withdrawal limit is [_1] [_2] (or equivalent in other currency).',
                txt_withdraw_amt           = 'You have already withdrawn the equivalent of [_1] [_2].',
                txt_current_max_withdrawal = 'Therefore your current immediate maximum withdrawal (subject to your account having sufficient funds) is [_1] [_2] (or equivalent in other currency).',
                currency                   = 'EUR';
            const days_limit               = formatMoney(currency, limits.num_of_days_limit, 1);
            // no need for formatMoney since it is already string like "1,000"
            const withdrawn                = limits.withdrawal_since_inception_monetary;
            const remainder                = formatMoney(currency, limits.remainder, 1);

            if ((/^(iom)$/i).test(Client.get('landing_company_name'))) { // MX
                txt_withdraw_lim  = 'Your [_1] day withdrawal limit is currently [_2] [_3] (or equivalent in other currency).';
                txt_withdraw_amt = 'You have already withdrawn the equivalent of [_1] [_2] in aggregate over the last [_3] days.';
                elementTextContent(el_withdraw_limit,
                    localize(txt_withdraw_lim, [limits.num_of_days, currency, days_limit]));
                elementTextContent(el_withdrawn,
                    localize(txt_withdraw_amt,  [currency, withdrawn, limits.num_of_days]));
            } else {
                if ((/^(costarica|japan)$/i).test(Client.get('landing_company_name'))) { // CR , JP
                    txt_withdraw_lim           = 'Your withdrawal limit is [_1] [_2].';
                    txt_withdraw_amt           = 'You have already withdrawn [_1] [_2].';
                    txt_current_max_withdrawal = 'Therefore your current immediate maximum withdrawal (subject to your account having sufficient funds) is [_1] [_2].';
                    currency                   = Client.get('currency') || Client.get('default_currency');
                }
                elementTextContent(el_withdraw_limit, localize(txt_withdraw_lim, [currency, days_limit]));
                elementTextContent(el_withdrawn, localize(txt_withdraw_amt,  [currency, withdrawn]));
            }
            elementTextContent(el_withdraw_limit_agg, localize(txt_current_max_withdrawal, [currency, remainder]));
        }
    };

    const limitsError = (error) => {
        document.getElementById('withdrawal-title').setAttribute('style', 'display:none');
        document.getElementById('limits-title').setAttribute('style', 'display:none');
        $('#limits_error').append($('<p/>', { class: 'center-text notice-msg', text: error && error.message ? error.message : localize('Sorry, an error occurred while processing your request.') }));
    };

    const initTable = () => {
        LimitsUI.clearTableContent();
    };

    return {
        limitsHandler: limitsHandler,
        limitsError  : limitsError,
        clean        : initTable,
    };
})();

module.exports = LimitsInit;

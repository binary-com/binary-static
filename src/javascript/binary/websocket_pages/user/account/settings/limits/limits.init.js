const template = require('../../../../../base/utility').template;
const Content  = require('../../../../../common_functions/content').Content;
const addComma = require('../../../../../common_functions/string_util').addComma;
const LimitsUI = require('./limits.ui');
const localize = require('../../../../../base/localize').localize;
const Client   = require('../../../../../base/client').Client;
const elementTextContent  = require('../../../../../common_functions/common_functions').elementTextContent;
const elementInnerHtml    = require('../../../../../common_functions/common_functions').elementInnerHtml;

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
            let txt_withdraw_lim           = localize('Your withdrawal limit is [_1] [_2] (or equivalent in other currency).'),
                txt_withdraw_amt           = localize('You have already withdrawn the equivalent of [_1] [_2].'),
                txt_current_max_withdrawal = localize('Therefore your current immediate maximum withdrawal (subject to your account having sufficient funds) is [_1] [_2] (or equivalent in other currency).'),
                currency                   = 'EUR';
            const days_limit               = addComma(limits.num_of_days_limit).split('.')[1] === '00' ? addComma(limits.num_of_days_limit).split('.')[0] : addComma(limits.num_of_days_limit);
            // no need for addComma since it is already string like "1,000"
            const withdrawn                = limits.withdrawal_since_inception_monetary;
            const remainder                = addComma(limits.remainder).split('.')[1] === '00' ? addComma(limits.remainder).split('.')[0] : addComma(limits.remainder);

            if ((/^(iom)$/i).test(Client.get('landing_company_name'))) { // MX
                txt_withdraw_lim  = localize('Your [_1] day withdrawal limit is currently [_2] [_3] (or equivalent in other currency).');
                txt_withdraw_amt = localize('You have already withdrawn the equivalent of [_1] [_2] in aggregate over the last [_3] days.');
                elementTextContent(el_withdraw_limit,
                    template(txt_withdraw_lim, [limits.num_of_days, currency, days_limit]));
                elementTextContent(el_withdrawn,
                    template(txt_withdraw_amt,  [currency, withdrawn, limits.num_of_days]));
            } else {
                if ((/^(costarica|japan)$/i).test(Client.get('landing_company_name'))) { // CR , JP
                    txt_withdraw_lim           = localize('Your withdrawal limit is [_1] [_2].');
                    txt_withdraw_amt           = localize('You have already withdrawn [_1] [_2].');
                    txt_current_max_withdrawal = localize('Therefore your current immediate maximum withdrawal (subject to your account having sufficient funds) is [_1] [_2].');
                    currency                   = Client.get('currency') || Client.get('default_currency');
                }
                elementTextContent(el_withdraw_limit, template(txt_withdraw_lim, [currency, days_limit]));
                elementTextContent(el_withdrawn, template(txt_withdraw_amt,  [currency, withdrawn]));
            }
            elementTextContent(el_withdraw_limit_agg, template(txt_current_max_withdrawal, [currency, remainder]));
        }
    };

    const limitsError = (error) => {
        Content.populate();
        document.getElementById('withdrawal-title').setAttribute('style', 'display:none');
        document.getElementById('limits-title').setAttribute('style', 'display:none');
        const errorElement = document.getElementsByClassName('notice-msg')[0];
        if (error && error.message) {
            elementInnerHtml(errorElement, error.message);
        } else {
            elementInnerHtml(errorElement, localize('An error occured') + '.');
        }
        document.getElementById('client_message').setAttribute('style', 'display:block');
    };

    const initTable = () => {
        const client_message = document.getElementById('client_message');
        if (!client_message) return;
        client_message.setAttribute('style', 'display:none');
        LimitsUI.clearTableContent();
    };

    return {
        limitsHandler: limitsHandler,
        limitsError  : limitsError,
        clean        : initTable,
    };
})();

module.exports = LimitsInit;

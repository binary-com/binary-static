const template = require('../../../../../base/utility').template;
const Content  = require('../../../../../common_functions/content').Content;
const addComma = require('../../../../../common_functions/string_util').addComma;
const LimitsUI = require('./limits.ui').LimitsUI;
const localize = require('../../../../../base/localize').localize;
const Client   = require('../../../../../base/client').Client;
const elementTextContent  = require('../../../../../common_functions/common_functions').elementTextContent;
const elementInnerHtml    = require('../../../../../common_functions/common_functions').elementInnerHtml;

const LimitsWS = (function() {
    'use strict';

    const limitsHandler = function(response) {
        const limits = response.get_limits;
        LimitsUI.fillLimitsTable(limits);

        const elWithdrawLimit    = document.getElementById('withdrawal-limit');
        const elWithdrawn        = document.getElementById('already-withdraw');
        const elWithdrawLimitAgg = document.getElementById('withdrawal-limit-aggregate');

        if (limits.lifetime_limit === 99999999 && limits.num_of_days_limit === 99999999) {
            elementTextContent(elWithdrawLimit, Content.localize().textAuthenticatedWithdrawal);
        } else {
            let txtWithdrawLim             = Content.localize().textWithdrawalLimitsEquivalant,
                txtWithdrawAmt             = Content.localize().textWithrawalAmountEquivalant,
                text_CurrentMaxWithdrawal  = Content.localize().textCurrentMaxWithdrawalEquivalant,
                currency                   = 'EUR';
            const daysLimit                = addComma(limits.num_of_days_limit).split('.')[1] === '00' ? addComma(limits.num_of_days_limit).split('.')[0] : addComma(limits.num_of_days_limit);
            // no need for addComma since it is already string like "1,000"
            const withdrawn                = limits.withdrawal_since_inception_monetary;
            const remainder                = addComma(limits.remainder).split('.')[1] === '00' ? addComma(limits.remainder).split('.')[0] : addComma(limits.remainder);

            if ((/^(iom)$/i).test(Client.get('landing_company_name'))) { // MX
                txtWithdrawLim = Content.localize().textWithdrawalLimitsEquivalantDay;
                txtWithdrawAmt  = Content.localize().textWithrawalAmountEquivalantDay;
                elementTextContent(elWithdrawLimit,
                   template(txtWithdrawLim, [limits.num_of_days, currency, daysLimit]));
                elementTextContent(elWithdrawn, template(txtWithdrawAmt,  [currency, withdrawn, limits.num_of_days]));
            } else {
                if ((/^(costarica|japan)$/i).test(Client.get('landing_company_name'))) { // CR , JP
                    txtWithdrawLim            = Content.localize().textWithdrawalLimits;
                    txtWithdrawAmt            = Content.localize().textWithrawalAmount;
                    text_CurrentMaxWithdrawal = Content.localize().textCurrentMaxWithdrawal;
                    currency                  = Client.get('currency') || Client.get('default_currency');
                }
                elementTextContent(elWithdrawLimit, template(txtWithdrawLim, [currency, daysLimit]));
                elementTextContent(elWithdrawn, template(txtWithdrawAmt,  [currency, withdrawn]));
            }
            elementTextContent(elWithdrawLimitAgg, template(text_CurrentMaxWithdrawal, [currency, remainder]));
        }
    };

    const limitsError = function(error) {
        Content.populate();
        document.getElementById('withdrawal-title').setAttribute('style', 'display:none');
        document.getElementById('limits-title').setAttribute('style', 'display:none');
        const errorElement = document.getElementsByClassName('notice-msg')[0];
        if ((error && error.code === 'FeatureNotAvailable' && Client.get('is_virtual')) || Client.get('is_virtual')) {
            elementInnerHtml(errorElement, Content.localize().featureNotRelevantToVirtual);
        } else if (error && error.message) {
            elementInnerHtml(errorElement, error.message);
        } else {
            elementInnerHtml(errorElement, localize('An error occured') + '.');
        }
        document.getElementById('client_message').setAttribute('style', 'display:block');
    };

    const initTable = function() {
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

module.exports = {
    LimitsWS: LimitsWS,
};

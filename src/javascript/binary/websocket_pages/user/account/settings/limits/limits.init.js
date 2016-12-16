var template = require('../../../../../base/utility').template;
var Content  = require('../../../../../common_functions/content').Content;
var addComma = require('../../../../../common_functions/string_util').addComma;
var LimitsUI = require('./limits.ui').LimitsUI;
var localize     = require('../../../../../base/localize').localize;

var LimitsWS = (function() {
    'use strict';

    function limitsHandler(response) {
        var limits = response.get_limits;
        LimitsUI.fillLimitsTable(limits);

        var elWithdrawLimit    = document.getElementById('withdrawal-limit');
        var elWithdrawn        = document.getElementById('already-withdraw');
        var elWithdrawLimitAgg = document.getElementById('withdrawal-limit-aggregate');

        if (limits.lifetime_limit === 99999999 && limits.num_of_days_limit === 99999999) {
            elWithdrawLimit.textContent = Content.localize().textAuthenticatedWithdrawal;
        } else {
            var txtWithdrawLim            = Content.localize().textWithdrawalLimitsEquivalant;
            var txtWithdrawAmt             = Content.localize().textWithrawalAmountEquivalant;
            var text_CurrentMaxWithdrawal = Content.localize().textCurrentMaxWithdrawalEquivalant;
            var currency                  = 'EUR';
            var daysLimit                 = addComma(limits.num_of_days_limit).split('.')[1] === '00' ? addComma(limits.num_of_days_limit).split('.')[0] : addComma(limits.num_of_days_limit);
            // no need for addComma since it is already string like "1,000"
            var withdrawn                 = limits.withdrawal_since_inception_monetary;
            var remainder                 = addComma(limits.remainder).split('.')[1] === '00' ? addComma(limits.remainder).split('.')[0] : addComma(limits.remainder);

            if ((/^(iom)$/i).test(TUser.get().landing_company_name)) { // MX
                txtWithdrawLim = Content.localize().textWithdrawalLimitsEquivalantDay;
                txtWithdrawAmt  = Content.localize().textWithrawalAmountEquivalantDay;
                elWithdrawLimit.textContent  = template(txtWithdrawLim, [limits.num_of_days, currency, daysLimit]);
                elWithdrawn.textContent      = template(txtWithdrawAmt,  [currency, withdrawn, limits.num_of_days]);
            } else {
                if ((/^(costarica|japan)$/i).test(TUser.get().landing_company_name)) { // CR , JP
                    txtWithdrawLim            = Content.localize().textWithdrawalLimits;
                    txtWithdrawAmt             = Content.localize().textWithrawalAmount;
                    text_CurrentMaxWithdrawal = Content.localize().textCurrentMaxWithdrawal;
                    currency                  = TUser.get().currency || page.client.get_storage_value('currencies');
                }
                elWithdrawLimit.textContent  = template(txtWithdrawLim, [currency, daysLimit]);
                elWithdrawn.textContent      = template(txtWithdrawAmt,  [currency, withdrawn]);
            }
            elWithdrawLimitAgg.textContent = template(text_CurrentMaxWithdrawal, [currency, remainder]);
        }
    }

    function limitsError(error) {
        document.getElementById('withdrawal-title').setAttribute('style', 'display:none');
        document.getElementById('limits-title').setAttribute('style', 'display:none');
        var errorElement = document.getElementsByClassName('notice-msg')[0];
        if ((error && error.code === 'FeatureNotAvailable' && page.client.is_virtual()) || page.client.is_virtual()) {
            errorElement.innerHTML = localize('This feature is not relevant to virtual-money accounts.');
        } else if (error && error.message) {
            errorElement.innerHTML = error.message;
        } else {
            errorElement.innerHTML = localize('An error occured') + '.';
        }
        document.getElementById('client_message').setAttribute('style', 'display:block');
    }

    function initTable() {
        var client_message = document.getElementById('client_message');
        if (!client_message) return;
        client_message.setAttribute('style', 'display:none');
        LimitsUI.clearTableContent();
    }

    return {
        limitsHandler: limitsHandler,
        limitsError  : limitsError,
        clean        : initTable,
    };
})();

module.exports = {
    LimitsWS: LimitsWS,
};

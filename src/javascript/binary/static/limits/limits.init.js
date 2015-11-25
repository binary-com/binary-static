var LimitsWS = (function(){
    "use strict";

    function limitsHandler(response){
        var limits = response.get_limits;
        Content.limitsTranslation();
        LimitsUI.fillLimitsTable(limits);

        var equivalent = " (" + Content.localize().textCurrencyEquivalent + ").";

        var withdrawal_limit = document.getElementById("withdrawal-limit");
        var already_withdraw = document.getElementById("already-withdraw");
        var withdrawal_limit_aggregate = document.getElementById("withdrawal-limit-aggregate");

        if(limits['lifetime_limit'] === 99999999) {
            withdrawal_limit.textContent = Content.localize().textAuthenticatedWithdrawal;
        } else if(limits['num_of_days_limit'] === limits['lifetime_limit']) {
            withdrawal_limit.textContent = Content.localize().textWithdrawalLimits + " " + addComma(limits['num_of_days_limit']) + equivalent;
            already_withdraw.textContent = Content.localize().textWithrawalAmount + " " + addComma(limits["withdrawal_since_inception_monetary"]) + ".";
        } else {
            withdrawal_limit.textContent = Content.localize().textYour + " " + limits['num_of_days'] + " " + Content.localize().textDayWithdrawalLimit + " " + addComma(limits['num_of_days_limit']) + equivalent;
            already_withdraw.textContent = Content.localize().textWithrawalAmount + " " + limits['withdrawal_for_x_days_monetary'] + " " + Content.localize().textAggregateOverLast + " " + limits['num_of_days'] + " " + Content.localize().textDurationDays;
            if(limits["lifetime_limit"] < 99999999) {
                withdrawal_limit_aggregate.textContent = Content.localize().textWithdrawalForEntireDuration + " " + addComma(limits["lifetime_limit"]) + equivalent;
                document.getElementById("already-withdraw-aggregate").textContent = Content.localize().textWithrawalAmount + " " + addComma(limits["withdrawal_since_inception_monetary"]) + " " + Content.localize().textInAggregateOverLifetime;
            }
            if(limits['remainder'] === 0) {
                withdrawal_limit_aggregate.textContent = Content.localize().textNotAllowedToWithdraw;
            } else if (limits['remainder'] !== 0) {
                withdrawal_limit_aggregate.textContent = Content.localize().textCurrentMaxWithdrawal + " " + addComma(limits['remainder']) + equivalent;
            }

        }
    }

    function initTable(){
        $(".error-msg").text("");
        LimitsUI.clearTableContent();
    }

    function initPage(){
        LimitsData.getLimits();
    }

    return {
        limitsHandler: limitsHandler,
        clean: initTable,
        init: initPage
    };
}());

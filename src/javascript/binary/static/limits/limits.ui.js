var LimitsUI = (function(){
    "use strict";

    function fillLimitsTable(limits){
        var open_positions = addComma(limits['open_positions']);
        var account_balance = addComma(limits['account_balance']);
        var daily_turnover = addComma(limits['daily_turnover']);
        var payout = addComma(limits['payout']);

        document.getElementById('item').textContent = Content.localize().textItem;
        
        var currency = TUser.get().currency;
        var limit = document.getElementById('limit');
        if (currency === "") {
            limit.textContent = Content.localize().textLimit;
        } else {
            limit.textContent = Content.localize().textLimit + " (" + currency + ")";
        }
        $('#max-open-position').prepend(Content.localize().textMaxOpenPosition);
        document.getElementById('max-open-position-tooltip').setAttribute('title', Content.localize().textMaxOpenPositionTooltip);
        document.getElementById('open-positions').textContent = open_positions;
        
        $('#max-acc-balance').prepend(Content.localize().textMaxAccBalance);
        document.getElementById('max-acc-balance-tooltip').setAttribute('title', Content.localize().textMaxAccBalanceTooltip);
        document.getElementById('account-balance').textContent = account_balance;
        
        $('#max-daily-turnover').prepend(Content.localize().textMaxDailyTurnover);
        document.getElementById('max-daily-turnover-tooltip').setAttribute('title', Content.localize().textMaxDailyTurnoverTooltip);
        document.getElementById('daily-turnover').textContent = daily_turnover;
        
        $('#max-aggregate').prepend(Content.localize().textMaxAggregate);
        document.getElementById('max-aggregate-tooltip').setAttribute('title', Content.localize().textMaxAggregateTooltip);
        document.getElementById('payout').textContent = payout;
    }

    function clearTableContent(){
        Table.clearTableBody('client-limits');
        $("#limits-title>tfoot").hide();
    }

    
    
    return {
        clearTableContent: clearTableContent,
        fillLimitsTable: fillLimitsTable
    };
}());

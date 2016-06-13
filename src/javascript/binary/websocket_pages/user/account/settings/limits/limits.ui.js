var LimitsUI = (function(){
    "use strict";

    function fillLimitsTable(limits){
        var open_positions = addComma(limits['open_positions']);
        var account_balance = addComma(limits['account_balance']);
        var payout = addComma(limits['payout']);
        var marketSpecific = limits.market_specific;

        document.getElementById('item').textContent = Content.localize().textItem;

        var currency = TUser.get().currency;
        var limit = document.getElementsByClassName('limit');
        if (currency === "") {
            limit[0].textContent = Content.localize().textLimit;
            limit[1].textContent = Content.localize().textLimit;
        } else {
            limit[0].textContent = Content.localize().textLimit + " (" + currency + ")";
            limit[1].textContent = Content.localize().textLimit + " (" + currency + ")";
        }
        $('#max-open-position').prepend(Content.localize().textMaxOpenPosition);
        document.getElementById('max-open-position-tooltip').setAttribute('title', Content.localize().textMaxOpenPositionTooltip);
        document.getElementById('open-positions').textContent = open_positions;

        $('#max-acc-balance').prepend(Content.localize().textMaxAccBalance);
        document.getElementById('max-acc-balance-tooltip').setAttribute('title', Content.localize().textMaxAccBalanceTooltip);
        document.getElementById('account-balance').textContent = account_balance;

        $('#max-daily-turnover').prepend(Content.localize().textMaxDailyTurnover);
        document.getElementById('max-daily-turnover-tooltip').setAttribute('title', Content.localize().textMaxDailyTurnoverTooltip);

        $('#max-aggregate').prepend(Content.localize().textMaxAggregate);
        document.getElementById('max-aggregate-tooltip').setAttribute('title', Content.localize().textMaxAggregateTooltip);
        document.getElementById('payout').textContent = payout;

        if (marketSpecific && Object.keys(marketSpecific).length > 0) {
          var key;
          for (key in marketSpecific) {
            if (marketSpecific.hasOwnProperty(key)) {
              var object = marketSpecific[key];
              if (object.length && object.length > 0) {
                appendRowTable(key.charAt(0).toUpperCase() + key.slice(1), '', 'auto', 'bold');
                for (key in object) {
                  if (object.hasOwnProperty(key)) {
                    appendRowTable(object[key].name, object[key].turnover_limit !== 'null' ? addComma(object[key].turnover_limit) : 0, '25px', 'normal');
                  }
                }
              } else {
                appendRowTable(object.name, object.turnover_limit !== 'null' ? addComma(object.turnover_limit) : 0, 'auto', 'bold');
              }
            }
          }
        }
        if (page.client.is_logged_in && !page.client.is_virtual()) {
            var loginId = page.client.loginid;

            var tradingLimits = document.getElementById("trading-limits");
            tradingLimits.textContent = loginId + " - " + text.localize('Trading Limits');

            var withdrawalTitle = document.getElementById("withdrawal-title");
            withdrawalTitle.textContent = loginId + " - " + text.localize('Withdrawal Limits');
        }
        document.getElementById('client-limits').setAttribute('style', 'display:table');
    }

    function appendRowTable(name, turnover_limit, padding, font_weight) {
      $('#client-limits').append('<tr class="flex-tr">' +
                            '<td class="flex-tr-child" style="padding-left: ' + padding + '; font-weight: ' + font_weight + ';">' +
                              text.localize(name) +
                            '</td>' +
                            '<td>' +
                              turnover_limit +
                            '</td>' +
                          '</tr>');
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

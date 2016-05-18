if (isJapanTrading()) {

    var marketsOrder = function(market) {
        var order = {
            higherlower: 1,
            touchnotouch: 2,
            endsinout: 3,
            staysinout: 4,
        };

        return order[market];
    };

    var displayContractForms = function(id, elements, selected) {
        var $menu = $('#market_menu');

        $menu.empty();

        var markets = Object.keys(elements).filter(function(el) {
            return marketsOrder(el);
        }).sort(function(a, b) {
            return marketsOrder(a) - marketsOrder(b);
        });


        $.each(markets, function(key, value) {
            $menu
                .append(
                    $('<li />').append(
                        $("<input />")
                        .attr("type", "radio")
                        .attr("name", "market_menu")
                        .attr("value", value)
                        .attr('id', value),
                        $("<label />")
                        .text(elements[value])
                        .attr('for', value)
                    ).click());
        });

        $('#' + selected).attr('checked', 'checked');
        $menu.find('input[name=market_menu]').change(function(e) {
            sessionStorage.setItem('formname', e.target.value);
            processContractForm();
            TradingAnalysis.request();
        });
    };


}

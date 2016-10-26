/*
 * Contract object mocks the trading form we have on our website
 * It parses the contracts json we get from socket.send({contracts_for: 'R_50'})
 */
var MBContract = (function() {
    'use strict';

    var getContracts = function(underlying) {
        BinarySocket.send({ contracts_for: underlying, currency: (TUser.get().currency || 'JPY'), region: 'japan' });
    };

    var durationText = function(dur) {
        return dur.replace('m', page.text.localize('minutes'))
                  .replace('h', page.text.localize('hours'))
                  .replace('d', page.text.localize('days'))
                  .replace('W', page.text.localize('{JAPAN ONLY}weeks')).replace('{JAPAN ONLY}', '')
                  .replace('M', page.text.localize('months'))
                  .replace('Y', page.text.localize('years'));
    };

    // use function to generate elements and append them
    // e.g. element is select and element to append is option
    var appendTextValueChild = function(element, text, value){
        var option = document.createElement("option");
        option.text = text;
        option.value = value;
        element.appendChild(option);
        return;
    };

    var populateDurations = function(contracts) {
        if (!contracts) return;
        var trading_period, start_end, duration, trading_period_text,
            trading_period_array = [],
            available_contracts = contracts.contracts_for.available,
            selected_option = $('#category-select').val();
        if (!selected_option) return;
        loop1:
        for (var i = 0; i < available_contracts.length; i++) {
            if (available_contracts[i].contract_category !== selected_option) continue;
            trading_period = available_contracts[i].trading_period;
            start_end = trading_period.date_start.epoch + '_' + trading_period.date_expiry.epoch;
            loop2:
            for (var k = 0; k < trading_period_array.length; k++) {
                if (trading_period_array[k][1] === start_end) {
                    continue loop1;
                }
            }
            duration = durationText(trading_period.duration.replace('0d', '1d'));
            trading_period_text = moment.utc(available_contracts[i].trading_period.date_expiry.epoch * 1000)
                                        .zone('+09:00').format("MM[" + page.text.localize('month') + "] " +
                                        "DD[" + page.text.localize('day') + "] HH:mm [(" +
                                        duration + ")]").replace(/08:59/, '09:00«');
            trading_period_array.push([trading_period_text, start_end]);
        }
        trading_period_array.sort(function(a, b) {
            var b0 = b[1].split('_')[0],
                b1 = b[1].split('_')[1],
                a0 = a[1].split('_')[0],
                a1 = a[1].split('_')[1],
                duration1 = a0 - a1,
                duration2 = b0 - b1;
            if (duration1 === duration2) {
                return a0 - b0;
            } else {
                return duration2 - duration1;
            }
        });
        $('#durations').empty();
        for (var j = 0; j < trading_period_array.length; j++) {
            appendTextValueChild(document.getElementById('durations'), trading_period_array[j][0], trading_period_array[j][1]);
        }
    };

    var populateOptions = function(contracts) {
        var category,
            contracts_array = [],
            available_contracts = contracts.contracts_for.available;
        var categoryNames = {
            callput: page.text.localize('{JAPAN ONLY}HIGH/LOW'),
            touchnotouch: page.text.localize('{JAPAN ONLY}TOUCH/NO-TOUCH'),
            endsinout: page.text.localize('{JAPAN ONLY}END-IN/END-OUT'),
            staysinout: page.text.localize('{JAPAN ONLY}STAY-IN/BREAK-OUT'),
        };
        var categoryOrder = {
            callput: 1,
            touchnotouch: 2,
            endsinout: 3,
            staysinout: 4
        };
        for (var i = 0; i < available_contracts.length; i++) {
            category = contracts.contracts_for.available[i].contract_category;
            if (contracts_array.indexOf(category) < 0) {
                contracts_array.push(category);
            }
        }
        contracts_array.sort(function(a, b){
            return categoryOrder[a] - categoryOrder[b];
        });
        $('#category-select').empty();
        for (var j = 0; j < contracts_array.length; j++) {
            appendTextValueChild(document.getElementById('category-select'), categoryNames[contracts_array[j]].replace('{JAPAN ONLY}', ''), contracts_array[j]);
        }
        populateDurations(window.contracts_for);
    };

    return {
        getContracts: getContracts,
        populateDurations: populateDurations,
        populateOptions: populateOptions
    };

})();

module.exports = {
    MBContract: MBContract,
};

/*
 * Contract object mocks the trading form we have on our website
 * It parses the contracts json we get from socket.send({contracts_for: 'R_50'})
 */
var MBContract = (function() {
    'use strict';

    var contracts_for_response;

    var getContracts = function(underlying) {
        var req = {
            contracts_for: (underlying || MBDefaults.get('underlying')),
            currency: (TUser.get().currency || 'JPY'),
            region: 'japan'
        };
        if (!underlying) {
            req.passthrough = {action: 'no-proposal'};
        }
        BinarySocket.send(req);
        setTimeout(getContracts, 15000);
    };

    var durationText = function(dur) {
        var durationMap = {
            'm': 'minutes',
            'h': 'hours',
            'd': 'days',
            'W': 'weeks',
            'M': 'months',
            'Y': 'years',
        };
        Object.keys(durationMap).forEach(function(key) {
            dur = dur.replace(key, MBProcess.removeJapanOnlyText(page.text.localize('{JAPAN ONLY}' + durationMap[key])));
        });
        return dur;
    };

    var PeriodText = function(trading_period) {
        var date_expiry, duration;
        if (typeof(trading_period) === 'object') {
            date_expiry = trading_period.date_expiry.epoch;
            duration = trading_period.duration;
        } else {
            date_expiry = trading_period.split('_')[1];
            duration = trading_period.split('_')[2];
        }
        return moment.utc(date_expiry * 1000).zone(japanese_client() ? '+09:00' : '+00:00')
                     .format("MM[" + page.text.localize('month') + "] " + "DD[" + page.text.localize('day') + "] HH:mm [(" +
                     durationText(duration.replace('0d', '1d')) + ")]").replace(/08:59/, '09:00«');
    };

    // use function to generate elements and append them
    // e.g. element is select and element to append is option
    var appendTextValueChild = function(element, text, value, isSelected){
        var option = document.createElement("option");
        option.text = text;
        option.value = value;
        if (isSelected) {
            option.setAttribute('selected', 'selected');
        }
        element.appendChild(option);
        return;
    };

    var populatePeriods = function(rebuild) {
        if (!contracts_for_response || !objectNotEmpty(contracts_for_response)) return;
        var trading_period, start_end, trading_period_text,
            trading_period_array = [],
            available_contracts = contracts_for_response.contracts_for.available,
            selected_option = MBDefaults.get('category'),
            $periodElement = $('#period');
        if (!selected_option || !available_contracts) return;
        for (var i = 0; i < available_contracts.length; i++) {
            if (available_contracts[i].contract_category !== selected_option) continue;
            trading_period = available_contracts[i].trading_period;
            if (!trading_period) return;
            start_end = trading_period.date_start.epoch + '_' + trading_period.date_expiry.epoch + '_' + trading_period.duration;
            if (trading_period_array.indexOf(start_end) > -1) {
                continue;
            }
            trading_period_array.push(start_end);
        }
        trading_period_array.sort(sortByExpiryTime);
        if (rebuild) {
            $periodElement.empty();
        }
        if ($periodElement.children().length === 0) {
            var default_value = MBDefaults.get('period');
            for (var j = 0; j < trading_period_array.length; j++) {
                appendTextValueChild(document.getElementById('period'), PeriodText(trading_period_array[j]), trading_period_array[j], trading_period_array[j] == default_value);
            }
            MBDefaults.set('period', $periodElement.val());
            MBContract.displayDescriptions();
            MBProcess.processRemainingTime();
        } else {
            var existing_array = [],
                missing_array = [];
            $("#period option").each(function() {
                existing_array.push($(this).val());
            });
            for (var l = 0; l < trading_period_array.length; l++) {
                if (existing_array.indexOf(trading_period_array[l]) < 0) {
                    missing_array.push(trading_period_array[l]);
                }
            }
            if (missing_array.length > 0) {
                var newOption;
                existing_array = existing_array.concat(missing_array).sort(sortByExpiryTime);
                for (var m = 0; m < existing_array.length; m++) {
                    if ($('#period option[value="' + existing_array[m] + '"]').length < 1) {
                        newOption = '<option value="' + existing_array[m] + '">' + PeriodText(existing_array[m]) + '</option>';
                        if (m < 1) {
                            $(newOption).insertBefore($periodElement.children().eq(m));
                        } else {
                            $(newOption).insertAfter($periodElement.children().eq(m-1));
                        }
                    }
                }
            }
        }
    };

    var sortByExpiryTime = function(a, b) {
        var a0 = a.split('_')[0],
            a1 = a.split('_')[1],
            b0 = b.split('_')[0],
            b1 = b.split('_')[1],
            duration1 = a1 - a0,
            duration2 = b1 - b0;
        if (a1 === b1) {
            return duration2 < duration1;
        } else {
            return b1 < a1;
        }
    };

    var populateOptions = function() {
        var category,
            contracts_array = [],
            available_contracts = contracts_for_response.contracts_for.available;
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
            category = contracts_for_response.contracts_for.available[i].contract_category;
            if (contracts_array.indexOf(category) < 0) {
                contracts_array.push(category);
            }
        }
        contracts_array.sort(function(a, b){
            return categoryOrder[a] - categoryOrder[b];
        });
        $('#category').empty();
        var default_value = MBDefaults.get('category');
        for (var j = 0; j < contracts_array.length; j++) {
            appendTextValueChild(document.getElementById('category'), MBProcess.removeJapanOnlyText(categoryNames[contracts_array[j]]), contracts_array[j], contracts_array[j] == default_value);
        }
        MBDefaults.set('category', $('#category').val());
        populatePeriods();
    };

    var getCurrentContracts = function() {
        var contracts = [],
            category  = MBDefaults.get('category'),
            periods   = MBDefaults.get('period').split('_');
        contracts_for_response.contracts_for.available.forEach(function(c) {
            if (c.contract_category === category &&
                c.trading_period.date_start.epoch  == periods[0] &&
                c.trading_period.date_expiry.epoch == periods[1]) {
                   contracts.push(c);
            }
        });
        return contracts;
    };

    var getTemplate = function(contract_type) {
        var templates = {
            "CALLE": {
                "opposite": "PUT",
                "order": 0,
                "name": "Higher",
                "description": "[_1] [_2] payout if [_3] is strictly higher or equal than Exercise price at close  on [_4]."
            },
            "PUT": {
                "opposite": "CALLE",
                "order": 1,
                "name": "Lower",
                "description": "[_1] [_2] payout if [_3] is strictly lower than Exercise price at close on [_4]."
            },
            "ONETOUCH": {
                "opposite": "NOTOUCH",
                "order": 0,
                "name": "Touches",
                "description": "[_1] [_2] payout if [_3] touches Exercise price through close on [_4]."
            },
            "NOTOUCH": {
                "opposite": "ONETOUCH",
                "order": 1,
                "name": "Does Not Touch",
                "description": "[_1] [_2] payout if [_3] does not touch Exercise price through close on [_4]."
            },
            "EXPIRYRANGEE": {
                "opposite": "EXPIRYMISS",
                "order": 0,
                "name": "Ends Between",
                "description": "[_1] [_2] payout if [_3] ends on or between low and high values of Exercise price at close on [_4]."
            },
            "EXPIRYMISS": {
                "opposite": "EXPIRYRANGEE",
                "order": 1,
                "name": "Ends Outside",
                "description": "[_1] [_2] payout if [_3] ends outside low and high values of Exercise price at close on [_4]."
            },
            "RANGE": {
                "opposite": "UPORDOWN",
                "order": 0,
                "name": "Stays Between",
                "description": "[_1] [_2] payout if [_3] stays between low and high values of Exercise price through close on [_4]."
            },
            "UPORDOWN": {
                "opposite": "RANGE",
                "order": 1,
                "name": "Goes Outside",
                "description": "[_1] [_2] payout if [_3] goes outside of low and high values of Exercise price through close on [_4]."
            },
        };
        return contract_type ? templates[contract_type] : templates;
    };

    var displayDescriptions = function() {
        var contracts = getCurrentContracts(),
            $desc_wrappers = $('.prices-wrapper'),
            currency = '¥',
            payout = Number(MBDefaults.get('payout') * 1000).toLocaleString(),
            display_name = MBSymbols.getName(contracts[0].underlying_symbol),
            date_expiry = PeriodText(contracts[0].trading_period).replace(/\s\(.*\)/, '');
        contracts.forEach(function(c) {
            var contract_type = c.contract_type,
                template = getTemplate(contract_type),
                $wrapper = $($desc_wrappers[template.order]);
            $wrapper.find('.details-heading').attr('class', 'details-heading ' + contract_type).text(page.text.localize(template.name));
            $wrapper.find('.descr').text(MBProcess.removeJapanOnlyText(page.text.localize('{JAPAN ONLY}' + template.description, [currency, payout, display_name, date_expiry])));
        });
    };

    return {
        getContracts        : getContracts,
        populatePeriods     : populatePeriods,
        populateOptions     : populateOptions,
        getCurrentContracts : getCurrentContracts,
        getTemplate         : getTemplate,
        displayDescriptions : displayDescriptions,
        getContractsResponse: function() { return contracts_for_response; },
        setContractsResponse: function(contracts_for) { contracts_for_response = contracts_for; },
    };
})();

module.exports = {
    MBContract: MBContract,
};

/*
 * Handles duration processing display
 *
 * It process `Contract.durations()` and display them according to
 * the current `Contract.form()` and `Contract.barriers()`
 *
 * It also populate expiry type select box i.e Durations and Endtime select
 *
 */

var Durations = (function(){
    'use strict';

    var trading_times = {};
    var expiry_time = '';

    var displayDurations = function(startType) {
        var durations = Contract.durations();
        if (durations === false) {
            document.getElementById('expiry_row').style.display = 'none';
            return false;
        }

        var target = document.getElementById('duration_units'),
            formName = Contract.form(),
            barrierCategory = Contract.barrier(),
            fragment = document.createDocumentFragment(), durationContainer = {};

        while (target && target.firstChild) {
            target.removeChild(target.firstChild);
        }

        for (var key in durations) {
            if (durations.hasOwnProperty(key)) {
                for (var form in durations[key][formName]) {
                    if (durations[key][formName].hasOwnProperty(form)) {
                        var obj = {};
                        if (barrierCategory) {
                            obj = durations[key][formName][barrierCategory];
                        } else {
                            obj = durations[key][formName][form];
                        }
                        for (var type in obj) {
                            if (obj.hasOwnProperty(type)) {
                                if (startType) {
                                    if (startType === type) {
                                        if(!durationContainer.hasOwnProperty(startType)) {
                                            durationContainer[key] = obj[startType];
                                        }
                                    }
                                } else {
                                    if(!durationContainer.hasOwnProperty(type)) {
                                        durationContainer[key] = obj[type];
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        var duration_list = {};
        for (var duration in durationContainer) {
            if(durationContainer.hasOwnProperty(duration)) {
                var min = durationContainer[duration]['min_contract_duration'],
                    textMapping = durationTextValueMappings(min);

                var option, content;
                if (duration === 'intraday') {
                    switch (textMapping['value']) {
                        case 's':
                            option = document.createElement('option');
                            content = document.createTextNode(textMapping['text']);
                            option.setAttribute('value', textMapping['value']);
                            option.setAttribute('data-minimum', textMapping['min']);
                            option.appendChild(content);
                            duration_list[textMapping['value']]=option;
                            option = document.createElement('option');
                            content = document.createTextNode(Content.localize().textDurationMinutes);
                            option.setAttribute('value', 'm');
                            option.setAttribute('data-minimum', 1);
                            option.setAttribute('selected', 'selected');
                            option.appendChild(content);
                            duration_list['m']=option;
                            option = document.createElement('option');
                            content = document.createTextNode(Content.localize().textDurationHours);
                            option.setAttribute('value', 'h');
                            option.setAttribute('data-minimum', 1);
                            option.appendChild(content);
                            duration_list['h']=option;
                            break;
                        case 'm':
                            option = document.createElement('option');
                            content = document.createTextNode(textMapping['text']);
                            option.setAttribute('value', textMapping['value']);
                            option.setAttribute('data-minimum', textMapping['min']);
                            option.setAttribute('selected', 'selected');
                            option.appendChild(content);
                            duration_list[textMapping['value']]=option;
                            option = document.createElement('option');
                            content = document.createTextNode(Content.localize().textDurationHours);
                            option.setAttribute('value', 'h');
                            option.setAttribute('data-minimum', 1);
                            option.appendChild(content);
                            duration_list['h']=option;
                            break;
                        case 'h':
                            option = document.createElement('option');
                            content = document.createTextNode(textMapping['text']);
                            option.setAttribute('value', textMapping['value']);
                            option.setAttribute('data-minimum', textMapping['min']);
                            option.appendChild(content);
                            duration_list[textMapping['value']]=option;
                            break;
                        default :
                            option = document.createElement('option');
                            content = document.createTextNode(textMapping['text']);
                            option.setAttribute('value', textMapping['value']);
                            option.setAttribute('data-minimum', textMapping['min']);
                            option.appendChild(content);
                            duration_list[textMapping['value']]=option;
                            break;
                    }
                } else if (duration === 'daily') {
                    option = document.createElement('option');
                    content = document.createTextNode(textMapping['text']);
                    option.setAttribute('value', textMapping['value']);
                    option.setAttribute('data-minimum', textMapping['min']);
                    option.appendChild(content);
                    duration_list[textMapping['value']]=option;
                } else if (duration === 'tick') {
                    option = document.createElement('option');
                    content = document.createTextNode(textMapping['text']);
                    option.setAttribute('value', textMapping['value']);
                    option.setAttribute('data-minimum', textMapping['min']);
                    option.appendChild(content);
                    duration_list[textMapping['value']]=option;
                }
            }
        }
        var list = Object.keys(duration_list).sort(function(a,b){
            if(durationOrder(a)>durationOrder(b)){
                return 1;
            }
            else{
                return -1;
            }
        });
        for(var k=0; k<list.length; k++){
            var d = list[k];
            if(duration_list.hasOwnProperty(d)){
                target.appendChild(duration_list[d]);
            }
        }

        durationPopulate();
    };

    var durationTextValueMappings = function(str) {
        var mapping = {
            s : Content.localize().textDurationSeconds,
            m : Content.localize().textDurationMinutes,
            h : Content.localize().textDurationHours,
            d : Content.localize().textDurationDays,
            t : Content.localize().textDurationTicks
        };

        var arry = str ? str.toString().match(/[a-zA-Z]+|[0-9]+/g) : [],
            obj = {};

        if (arry.length > 1) {
            obj['value'] = arry[1];
            obj['text'] = mapping[arry[1]];
            obj['min'] = arry[0];
        } else {
            obj['value'] = 't';
            obj['text'] = mapping['t'];
            obj['min'] = arry[0];
        }

        return obj;
    };

    var durationPopulate = function() {
        var unit = document.getElementById('duration_units');
        if (isVisible(unit)) {
            var unitValue = unit.options[unit.selectedIndex].getAttribute('data-minimum');
            document.getElementById('duration_amount').value = unitValue;
            document.getElementById('duration_minimum').textContent = unitValue;
            displayExpiryType(unit.value);
        } else {
            displayExpiryType();
        }

        // jquery for datepicker
        var amountElement = $('#duration_amount');
        if (unit.value === 'd') {
            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);

            amountElement.datepicker({
                minDate: tomorrow,
                onSelect: function() {
                    var date = $(this).datepicker('getDate');
                    var today = new Date();
                    var dayDiff = Math.ceil((date - today) / (1000 * 60 * 60 * 24));
                    amountElement.val(dayDiff);
                    amountElement.trigger('change');
                }
            });
        } else {
            amountElement.datepicker("destroy");
        }

        // we need to call it here as for days we need to show absolute barriers
        Barriers.display();
    };

    var displayExpiryType = function(unit) {
        var target = document.getElementById('expiry_type'),
            fragment = document.createDocumentFragment();

        var current_selected = target.value || 'duration',
            id = current_selected,
            hideId = (current_selected === 'duration') ? 'endtime' : 'duration';

        id = document.getElementById('expiry_type_' + id);
        if (id) {
            id.style.display = 'flex';
        }
        // need to hide the non selected one
        hideId = document.getElementById('expiry_type_' + hideId);
        if (hideId) {
            hideId.style.display = 'none';
        }

        while (target && target.firstChild) {
            target.removeChild(target.firstChild);
        }

        var option = document.createElement('option'),
            content = document.createTextNode(Content.localize().textDuration);

        option.setAttribute('value', 'duration');
        if (current_selected === 'duration') {
            option.setAttribute('selected', 'selected');
        }
        option.appendChild(content);
        fragment.appendChild(option);

        if (unit !== 't') {
            option = document.createElement('option');
            content = document.createTextNode(Content.localize().textEndTime);
            option.setAttribute('value', 'endtime');
            if (current_selected === 'endtime') {
                option.setAttribute('selected', 'selected');
            }
            option.appendChild(content);
            fragment.appendChild(option);
        }
        target.appendChild(fragment);
    };

    var processTradingTimesAnswer = function(response){
        if(!trading_times.hasOwnProperty(response.echo_req.trading_times) && response.hasOwnProperty('trading_times') && response.trading_times.hasOwnProperty('markets')){
            for(var i=0; i<response.trading_times.markets.length; i++){
                var submarkets = response.trading_times.markets[i].submarkets;
                if(submarkets){
                    for(var j=0; j<submarkets.length; j++){
                        var symbols = submarkets[j].symbols;
                        if(symbols){
                            for(var k=0; k<symbols.length; k++){
                                var symbol = symbols[k];
                                if(!trading_times[response.echo_req.trading_times]){
                                    trading_times[response.echo_req.trading_times] = {};
                                }
                                trading_times[response.echo_req.trading_times][symbol.symbol] = symbol.times.close;
                            }
                        }
                    }
                }
            }
        }
    };

    return {
        display: displayDurations,
        populate: durationPopulate,
        setTime: function(time){ expiry_time = time; },
        getTime: function(){ return expiry_time; },
        processTradingTimesAnswer: processTradingTimesAnswer,
        trading_times: function(){ return trading_times; }
    };
})();


var Barriers = require('./barriers').Barriers;
var Contract = require('./contract').Contract;
var Defaults = require('./defaults').Defaults;
var Content = require('../../common_functions/content').Content;
var moment = require('moment');
var State = require('../../base/storage').State;

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
    var selected_duration = {};
    var expiry_time = '';
    var has_end_date = 0;

    var displayDurations = function() {
        var startType;
        if(Defaults.get('date_start') !== 'now' && State.get('is_start_dates_displayed') && moment(Defaults.get('date_start')*1000).isAfter(moment())) {
            startType = 'forward';
        }
        else {
            startType = 'spot';
        }

        var durations = Contract.durations();
        if (durations === false) {
            document.getElementById('expiry_row').style.display = 'none';
            Defaults.remove('expiry_type', 'duration_amount', 'duration_units', 'expiry_date', 'expiry_time');
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
                var textMappingMin = durationTextValueMappings(durationContainer[duration]['min_contract_duration']),
                    textMappingMax = durationTextValueMappings(durationContainer[duration]['max_contract_duration']),
                    minUnit        = textMappingMin['unit'];

                if (duration === 'intraday') {
                    switch (minUnit) {
                        case 's':
                            duration_list[minUnit] = makeDurationOption(textMappingMin, textMappingMax);
                            duration_list['m']     = makeDurationOption(durationTextValueMappings('1m'), textMappingMax, true);
                            duration_list['h']     = makeDurationOption(durationTextValueMappings('1h'), textMappingMax);
                            break;
                        case 'm':
                            duration_list[minUnit] = makeDurationOption(textMappingMin, textMappingMax, true);
                            duration_list['h']     = makeDurationOption(durationTextValueMappings('1h'), textMappingMax);
                            break;
                        case 'h':
                            duration_list[minUnit] = makeDurationOption(textMappingMin, textMappingMax);
                            break;
                        default :
                            duration_list[minUnit] = makeDurationOption(textMappingMin, textMappingMax);
                            break;
                    }
                } else if (duration === 'daily' || duration === 'tick') {
                    duration_list[minUnit] = makeDurationOption(textMappingMin, textMappingMax);
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
        has_end_date = 0;
        for(var k=0; k<list.length; k++){
            var d = list[k];
            if(d!=='t'){
                has_end_date = 1;
            }
            if(duration_list.hasOwnProperty(d)){
                target.appendChild(duration_list[d]);
            }
        }

        if(selected_duration.unit){
            if(!selectOption(selected_duration.unit,target)){
                selected_duration = {};
            }
        }

        durationPopulate();
    };

    var makeDurationOption = function(mapMin, mapMax, isSelected){
        var option = document.createElement('option'),
            content = document.createTextNode(mapMin.text);
        option.setAttribute('value', mapMin.unit);
        option.setAttribute('data-minimum', mapMin.value);
        if (mapMax.value && mapMax.unit) {
            var max = convertDurationUnit(mapMax.value, mapMax.unit, mapMin.unit);
            if (max) {
                option.setAttribute('data-maximum', max);
            }
        }
        if (isSelected) {
            option.setAttribute('selected', 'selected');
        }
        option.appendChild(content);
        return option;
    };

    var convertDurationUnit = function(value, from_unit, to_unit){
        if (!value || !from_unit || !to_unit) return;
        if (from_unit === to_unit) return value;
        var seconds = {
            s: 1,
            m: 60,
            h: 3600,
            d: 3600 * 24,
        };
        return (value * seconds[from_unit] / seconds[to_unit]);
    };

    var displayEndTime = function(){
        var date_start = document.getElementById('date_start').value;
        var now = !date_start || date_start === 'now';
        var current_moment = moment((now ? window.time : parseInt(date_start) * 1000)).add(5, 'minutes').utc();
        var expiry_date = Defaults.get('expiry_date') || current_moment.format('YYYY-MM-DD'),
            expiry_time = Defaults.get('expiry_time') || current_moment.format('HH:mm');

        if (moment(expiry_date + " " + expiry_time).valueOf() < current_moment.valueOf()) {
            expiry_date = current_moment.format('YYYY-MM-DD');
            expiry_time = current_moment.format('HH:mm');
        }

        document.getElementById('expiry_date').value = expiry_date;
        document.getElementById('expiry_time').value = expiry_time;
        Defaults.set('expiry_date', expiry_date);
        Defaults.set('expiry_time', expiry_time);
        Durations.setTime(expiry_time);

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
            obj['unit'] = arry[1];
            obj['text'] = mapping[arry[1]];
            obj['value'] = arry[0];
        } else {
            obj['unit'] = 't';
            obj['text'] = mapping['t'];
            obj['value'] = arry[0];
        }

        return obj;
    };

    var durationPopulate = function() {
        var unit = document.getElementById('duration_units');
        if (!unit.options[unit.selectedIndex]) return;
        var unitMinValue = unit.options[unit.selectedIndex].getAttribute('data-minimum'),
            unitMaxValue = unit.options[unit.selectedIndex].getAttribute('data-maximum'),
            unitValue = Defaults.get('duration_amount') || unitMinValue;
        unit.value = Defaults.get('duration_units') &&
            document.querySelectorAll('select[id="duration_units"] [value="' + Defaults.get('duration_units') + '"]').length ?
                Defaults.get('duration_units') : unit.value;
        document.getElementById('duration_minimum').textContent = unitMinValue;
        document.getElementById('duration_maximum').textContent = unitMaxValue;
        if(selected_duration.amount && selected_duration.unit > unitValue){
            unitValue = selected_duration.amount;
        }
        document.getElementById('duration_amount').value = unitValue;
        Defaults.set('duration_amount', unitValue);
        displayExpiryType(unit.value);
        Defaults.set('duration_units', unit.value);

        // jquery for datepicker
        var amountElement = $('#duration_amount');
        if (unit.value === 'd') {
            var tomorrow = window.time ? new Date(window.time.valueOf()) : new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);

            amountElement.datepicker({
                minDate: tomorrow,
                onSelect: function(value) {
                    var dayDiff;
                    if($('#duration_amount').val()){
                        dayDiff = $('#duration_amount').val();
                    }
                    else{
                        var date = new Date(value);
                        var today = window.time ? window.time.valueOf() : new Date();
                        dayDiff = Math.ceil((date - today) / (1000 * 60 * 60 * 24));
                    }
                    amountElement.val(dayDiff);
                    amountElement.trigger('change');
                }
            });
        } else {
            amountElement.datepicker("destroy");
        }

        $('.pickadate').datepicker('destroy');
        $('.pickadate').datepicker({
            minDate: window.time ? window.time.format('YYYY-MM-DD') : new Date(),
            dateFormat: 'yy-mm-dd'
        });

        validateMinDurationAmount();
        // we need to call it here as for days we need to show absolute barriers
        Barriers.display();
    };

    var displayExpiryType = function(unit) {
        var target = document.getElementById('expiry_type'),
            fragment = document.createDocumentFragment();

        // in case of having endtime as expiry_type and change the form to contract types
        // which only have duration and do not support endtime, it should change the Default value
        // to get corrected based on contract situations
        if($('#expiry_type').find('option[value=' + Defaults.get('expiry_type') + ']').length === 0 && target.value) {
                Defaults.set('expiry_type', target.value);
        }
        var current_selected = Defaults.get('expiry_type') || target.value || 'duration',
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

        if (has_end_date) {
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

    var selectEndDate = function(end_date){
        var expiry_time = document.getElementById('expiry_time'),
            date_start  = document.getElementById('date_start');
        $('#expiry_date').val(end_date);
        Defaults.set('expiry_date', end_date);
        if (moment(end_date).isAfter(window.time.format('YYYY-MM-DD HH:mm'), 'day')) {
            Durations.setTime('');
            Defaults.remove('expiry_time');
            setNow(); // start time
            date_start.setAttribute('disabled', 'disabled');
            expiry_time.hide();
            processTradingTimesRequest(end_date);
        } else {
            date_start.removeAttribute('disabled');
            if(!expiry_time.value) {
                expiry_time.value = moment(window.time).add(5, 'minutes').utc().format('HH:mm');
            }
            Durations.setTime(expiry_time.value);
            Defaults.set('expiry_time', Defaults.get('expiry_time') || expiry_time.value);
            expiry_time.show();
            processPriceRequest();
        }

        Barriers.display();
    };

    var validateMinDurationAmount = function(){
        var durationAmountElement = document.getElementById('duration_amount'),
            durationMinElement    = document.getElementById('duration_minimum'),
            durationMaxElement    = document.getElementById('duration_maximum');
        if(!isVisible(durationAmountElement) || !isVisible(durationMinElement)) return;
        if(+durationAmountElement.value < +durationMinElement.textContent ||
           (+durationMaxElement.textContent && (+durationAmountElement.value > +durationMaxElement.textContent))) {
            durationAmountElement.classList.add('error-field');
        } else {
            durationAmountElement.classList.remove('error-field');
        }
    };

    var onStartDateChange = function(value){
        var $dateStartSelect = $('#date_start');
        if(!value || !$dateStartSelect.find('option[value='+value+']').length){
            return 0;
        }

        var yellowBorder = 'light-yellow-background';
        if (value !== 'now') {
            $dateStartSelect.addClass(yellowBorder);
        } else {
            $dateStartSelect.removeClass(yellowBorder);
        }

        $dateStartSelect.val(value);

        var make_price_request = 1;
        if (value !== 'now' && Defaults.get('expiry_type') === 'endtime') {
            make_price_request = -1;
            var end_time = moment(parseInt(value)*1000).add(5,'minutes').utc();
            Durations.setTime((timeIsValid($('#expiry_time')) && Defaults.get('expiry_time') ?
                               Defaults.get('expiry_time') : end_time.format("HH:mm")));
            Durations.selectEndDate((timeIsValid($('#expiry_time')) && Defaults.get('expiry_date') ?
                                    Defaults.get('expiry_date') : end_time.format("YYYY-MM-DD")));
        }
        timeIsValid($('#expiry_time'));
        Durations.display();
        return make_price_request;
    };

    var setNow = function() {
        if ($('#date_start option[value="now"]').length) {
            $('#date_start').val('now').removeClass('light-yellow-background');
            Defaults.set('date_start', 'now');
        }
    };

    return {
        display                  : displayDurations,
        displayEndTime           : displayEndTime,
        populate                 : durationPopulate,
        processTradingTimesAnswer: processTradingTimesAnswer,
        selectEndDate            : selectEndDate,
        validateMinDurationAmount: validateMinDurationAmount,
        onStartDateChange        : onStartDateChange,
        setTime      : function(time) { $('#expiry_time').val(time); Defaults.set('expiry_time', time); expiry_time = time; },
        getTime      : function() { return expiry_time; },
        trading_times: function() { return trading_times; },
        select_amount: function(a) { selected_duration.amount = a; },
        select_unit  : function(u) { selected_duration.unit = u; },
    };
})();

module.exports = {
    Durations: Durations,
};

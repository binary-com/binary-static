const Barriers_Beta    = require('./barriers').Barriers_Beta;
const Contract_Beta    = require('./contract').Contract_Beta;
const Price_Beta       = require('./price').Price_Beta;
const Defaults         = require('../defaults').Defaults;
const moment           = require('moment');
const localize         = require('../../../base/localize').localize;
const State            = require('../../../base/storage').State;
const isVisible        = require('../../../common_functions/common_functions').isVisible;
const durationOrder    = require('../common').durationOrder;
const selectOption     = require('../common').selectOption;
const timeIsValid      = require('../common').timeIsValid;
const showPriceOverlay = require('../common').showPriceOverlay;
const DatePicker       = require('../../../components/date_picker');
const toReadableFormat = require('../../../common_functions/string_util').toReadableFormat;
const toISOFormat      = require('../../../common_functions/string_util').toISOFormat;
const elementTextContent  = require('../../../common_functions/common_functions').elementTextContent;

/*
 * Handles duration processing display
 *
 * It process `Contract.durations()` and display them according to
 * the current `Contract.form()` and `Contract.barriers()`
 *
 * It also populate expiry type select box i.e Durations and Endtime select
 *
 */

const Durations_Beta = (function() {
    'use strict';

    let selected_duration = {},
        has_end_date      = 0;

    const displayDurations = function() {
        let startType;
        if (Defaults.get('date_start') !== 'now' && State.get('is_start_dates_displayed') && moment(Defaults.get('date_start') * 1000).isAfter(moment())) {
            startType = 'forward';
        } else {
            startType = 'spot';
        }

        const durations = Contract_Beta.durations();
        if (durations === false) {
            document.getElementById('expiry_row').style.display = 'none';
            Defaults.remove('expiry_type', 'duration_amount', 'duration_units', 'expiry_date', 'expiry_time');
            return false;
        }

        const target = document.getElementById('duration_units'),
            formName = Contract_Beta.form(),
            barrierCategory = Contract_Beta.barrier(),
            durationContainer = {};

        while (target && target.firstChild) {
            target.removeChild(target.firstChild);
        }

        Object.keys(durations).forEach(function(key) {
            Object.keys(durations[key][formName]).forEach(function(form) {
                if (durations[key][formName].hasOwnProperty(form)) {
                    let obj = {};
                    if (barrierCategory) {
                        obj = durations[key][formName][barrierCategory];
                    } else {
                        obj = durations[key][formName][form];
                    }
                    Object.keys(obj).forEach(function(type) {
                        if (startType) {
                            if (startType === type && !durationContainer.hasOwnProperty(startType)) {
                                durationContainer[key] = obj[startType];
                            }
                        } else if (!durationContainer.hasOwnProperty(type)) {
                            durationContainer[key] = obj[type];
                        }
                    });
                }
            });
        });

        const duration_list = {};
        Object.keys(durationContainer).forEach(function(duration) {
            const textMappingMin = durationTextValueMappings(durationContainer[duration].min_contract_duration),
                textMappingMax = durationTextValueMappings(durationContainer[duration].max_contract_duration),
                minUnit        = textMappingMin.unit;

            if (duration === 'intraday') {
                switch (minUnit) {
                    case 's':
                        duration_list[minUnit] = makeDurationOption(textMappingMin, textMappingMax);
                        duration_list.m        = makeDurationOption(durationTextValueMappings('1m'), textMappingMax, true);
                        duration_list.h        = makeDurationOption(durationTextValueMappings('1h'), textMappingMax);
                        break;
                    case 'm':
                        duration_list[minUnit] = makeDurationOption(textMappingMin, textMappingMax, true);
                        duration_list.h        = makeDurationOption(durationTextValueMappings('1h'), textMappingMax);
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
        });
        const list = Object.keys(duration_list).sort(function(a, b) {
            return (durationOrder(a) > durationOrder(b)) ? 1 : -1;
        });
        has_end_date = 0;
        for (let k = 0; k < list.length; k++) {
            const d = list[k];
            if (d !== 't') {
                has_end_date = 1;
            }
            if (duration_list.hasOwnProperty(d)) {
                target.appendChild(duration_list[d]);
            }
        }

        if (selected_duration.unit) {
            if (!selectOption(selected_duration.unit, target)) {
                selected_duration = {};
            }
        }

        durationPopulate();
        return true;
    };

    const makeDurationOption = function(mapMin, mapMax, isSelected) {
        const option = document.createElement('option'),
            content = document.createTextNode(mapMin.text);
        option.setAttribute('value', mapMin.unit);
        option.setAttribute('data-minimum', mapMin.value);
        if (mapMax.value && mapMax.unit) {
            const max = convertDurationUnit(mapMax.value, mapMax.unit, mapMin.unit);
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

    const convertDurationUnit = function(value, from_unit, to_unit) {
        if (!value || !from_unit || !to_unit) return null;
        if (from_unit === to_unit) return value;
        const seconds = {
            s: 1,
            m: 60,
            h: 3600,
            d: 3600 * 24,
        };
        return ((value * seconds[from_unit]) / seconds[to_unit]);
    };

    const displayEndTime = function() {
        const date_start = document.getElementById('date_start').value;
        const now = !date_start || date_start === 'now';
        const current_moment = moment((now ? window.time : parseInt(date_start) * 1000)).add(5, 'minutes').utc();
        let expiry_date = Defaults.get('expiry_date') ? moment(Defaults.get('expiry_date')) : current_moment,
            expiry_time = Defaults.get('expiry_time') || current_moment.format('HH:mm'),
            expiry_date_iso = toISOFormat(expiry_date);


        if (moment(expiry_date_iso + ' ' + expiry_time).valueOf() < current_moment.valueOf()) {
            expiry_date = current_moment;
            expiry_date_iso = toISOFormat(expiry_date);
            expiry_time = current_moment.format('HH:mm');
        }

        const expiry_date_el = document.getElementById('expiry_date'),
            expiry_time_el = document.getElementById('expiry_time');

        expiry_date_el.value = toReadableFormat(expiry_date);
        expiry_date_el.setAttribute('data-value', expiry_date_iso);
        expiry_time_el.value = expiry_time;
        expiry_time_el.setAttribute('data-value', expiry_time);
        Defaults.set('expiry_date', expiry_date_iso);
        Defaults.set('expiry_time', expiry_time);
        Durations_Beta.setTime(expiry_time);

        durationPopulate();
    };

    const durationTextValueMappings = function(str) {
        const mapping = {
            s: localize('seconds'),
            m: localize('minutes'),
            h: localize('hours'),
            d: localize('days'),
            t: localize('ticks'),
        };

        const arry = str ? str.toString().match(/[a-zA-Z]+|[0-9]+/g) : [],
            obj = {};

        if (arry.length > 1) {
            obj.unit  = arry[1];
            obj.text  = mapping[arry[1]];
            obj.value = arry[0];
        } else {
            obj.unit  = 't';
            obj.text  = mapping.t;
            obj.value = arry[0];
        }

        return obj;
    };

    const durationPopulate = function() {
        const unit = document.getElementById('duration_units');
        if (!unit.options[unit.selectedIndex]) return;
        const unitMinValue = unit.options[unit.selectedIndex].getAttribute('data-minimum'),
            unitMaxValue = unit.options[unit.selectedIndex].getAttribute('data-maximum');
        let unitValue = Defaults.get('duration_amount') || unitMinValue;
        unit.value = Defaults.get('duration_units') &&
            document.querySelectorAll('select[id="duration_units"] [value="' + Defaults.get('duration_units') + '"]').length ?
                Defaults.get('duration_units') : unit.value;
        elementTextContent(document.getElementById('duration_minimum'), unitMinValue);
        elementTextContent(document.getElementById('duration_maximum'), unitMaxValue);
        if (selected_duration.amount && selected_duration.unit > unitValue) {
            unitValue = selected_duration.amount;
        }
        document.getElementById('duration_amount').value = unitValue;
        Defaults.set('duration_amount', unitValue);
        displayExpiryType();
        Defaults.set('duration_units', unit.value);

        // jquery for datepicker
        const amountElement = $('#duration_amount');
        const duration_id = '#duration_amount';
        if (unit.value === 'd') {
            DatePicker.init({
                selector: duration_id,
                type    : 'diff',
                minDate : 1,
                maxDate : 364,
                native  : false,
            });
            amountElement.change(function(value) {
                let dayDiff;
                const $duration_amount_val = $('#duration_amount').val();
                if ($duration_amount_val) {
                    dayDiff = $duration_amount_val;
                } else {
                    value = value.target.getAttribute('data-value');
                    const date = value ? new Date(value) : new Date();
                    const today = window.time ? window.time.valueOf() : new Date();
                    dayDiff = Math.ceil((date - today) / (1000 * 60 * 60 * 24));
                }
                amountElement.val(dayDiff);
            });
        } else {
            DatePicker.hide(duration_id);
        }

        if ($('#expiry_date').is(':visible')) {
            DatePicker.init({
                selector: '#expiry_date',
                minDate : 0,
                maxDate : 364,
            });
        }

        validateMinDurationAmount();
        // we need to call it here as for days we need to show absolute barriers
        Barriers_Beta.display();
    };

    const displayExpiryType = function() {
        const target = document.getElementById('expiry_type'),
            fragment = document.createDocumentFragment();

        // in case of having endtime as expiry_type and change the form to contract types
        // which only have duration and do not support endtime, it should change the Default value
        // to get corrected based on contract situations
        if ($('#expiry_type').find('option[value=' + Defaults.get('expiry_type') + ']').length === 0 && target.value) {
            Defaults.set('expiry_type', target.value);
        }
        const current_selected = Defaults.get('expiry_type') || target.value || 'duration';
        let hideId = (current_selected === 'duration') ? 'endtime' : 'duration',
            id = current_selected;

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

        let option = document.createElement('option'),
            content = document.createTextNode(localize('Duration'));

        option.setAttribute('value', 'duration');
        if (current_selected === 'duration') {
            option.setAttribute('selected', 'selected');
        }
        option.appendChild(content);
        fragment.appendChild(option);

        if (has_end_date) {
            option = document.createElement('option');
            content = document.createTextNode(localize('End Time'));
            option.setAttribute('value', 'endtime');
            if (current_selected === 'endtime') {
                option.setAttribute('selected', 'selected');
            }
            option.appendChild(content);
            fragment.appendChild(option);
        }
        target.appendChild(fragment);
    };

    const selectEndDate = function(end_date) {
        const expiry_time = document.getElementById('expiry_time'),
            date_start  = document.getElementById('date_start'),
            end_date_readable = toReadableFormat(end_date),
            end_date_iso = toISOFormat(end_date);
        $('#expiry_date').val(end_date_readable)
                         .attr('data-value', end_date_iso);
        Defaults.set('expiry_date', end_date_iso);
        if (end_date.isAfter(window.time.format('YYYY-MM-DD HH:mm'), 'day')) {
            Durations_Beta.setTime('');
            Defaults.remove('expiry_time');
            setNow(); // start time
            date_start.setAttribute('disabled', 'disabled');
            expiry_time.hide();
            processTradingTimesRequest_Beta(end_date_iso);
        } else {
            date_start.removeAttribute('disabled');
            if (!expiry_time.value) {
                const new_time = moment(window.time).add(5, 'minutes').utc().format('HH:mm');
                expiry_time.value = new_time;
                expiry_time.setAttribute('data-value', new_time);
            }
            Durations_Beta.setTime(expiry_time.value);
            Defaults.set('expiry_time', Defaults.get('expiry_time') || expiry_time.value);
            expiry_time.show();
            Price_Beta.processPriceRequest_Beta();
        }

        Barriers_Beta.display();
    };

    const validateMinDurationAmount = function() {
        const durationAmountElement = document.getElementById('duration_amount'),
            durationMinElement    = document.getElementById('duration_minimum'),
            durationMaxElement    = document.getElementById('duration_maximum');
        if (!isVisible(durationAmountElement) || !isVisible(durationMinElement)) return;
        if (+durationAmountElement.value < +durationMinElement.textContent ||
           (+durationMaxElement.textContent && (+durationAmountElement.value > +durationMaxElement.textContent))) {
            durationAmountElement.classList.add('error-field');
        } else {
            durationAmountElement.classList.remove('error-field');
        }
    };

    const onStartDateChange = function(value) {
        const $dateStartSelect = $('#date_start');
        if (!value || !$dateStartSelect.find('option[value=' + value + ']').length) {
            return 0;
        }

        const yellowBorder = 'light-yellow-background';
        if (value !== 'now') {
            $dateStartSelect.addClass(yellowBorder);
        } else {
            $dateStartSelect.removeClass(yellowBorder);
        }

        $dateStartSelect.val(value);

        let make_price_request = 1;
        const $expiry_time = $('#expiry_time');
        if (value !== 'now' && Defaults.get('expiry_type') === 'endtime') {
            make_price_request = -1;
            const end_time = moment(parseInt(value) * 1000).add(5, 'minutes').utc();
            Durations_Beta.setTime((timeIsValid($expiry_time) && Defaults.get('expiry_time') ?
                                        Defaults.get('expiry_time') : end_time.format('HH:mm')));
            Durations_Beta.selectEndDate((timeIsValid($expiry_time) && (Defaults.get('expiry_date') ?
                                        moment(Defaults.get('expiry_date')) : end_time)));
        }
        timeIsValid($expiry_time);
        Durations_Beta.display();
        return make_price_request;
    };

    const setNow = function() {
        const $date_start = $('#date_start');
        if ($date_start.find('option[value="now"]').length) {
            $date_start.val('now').removeClass('light-yellow-background');
            Defaults.set('date_start', 'now');
        }
    };

    const processTradingTimesRequest_Beta = function(date) {
        const trading_times = Durations_Beta.trading_times();
        if (trading_times.hasOwnProperty(date)) {
            Price_Beta.processPriceRequest_Beta();
        } else {
            showPriceOverlay();
            BinarySocket.send({
                trading_times: date,
            });
        }
    };

    return {
        display                  : displayDurations,
        displayEndTime           : displayEndTime,
        populate                 : durationPopulate,
        selectEndDate            : selectEndDate,
        validateMinDurationAmount: validateMinDurationAmount,
        onStartDateChange        : onStartDateChange,

        setTime      : function(time) { $('#expiry_time').val(time); Defaults.set('expiry_time', time); },
        select_amount: function(a) { selected_duration.amount = a; },
        select_unit  : function(u) { selected_duration.unit = u; },
    };
})();

module.exports = {
    Durations_Beta: Durations_Beta,
};

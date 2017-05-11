const moment             = require('moment');
const Barriers           = require('./barriers');
const commonTrading      = require('./common');
const commonIndependent  = require('./common_independent');
const Contract           = require('./contract');
const Defaults           = require('./defaults');
const Price              = require('./price');
const BinarySocket       = require('../socket');
const localize           = require('../../base/localize').localize;
const State              = require('../../base/storage').State;
const elementTextContent = require('../../common_functions/common_functions').elementTextContent;
const isVisible          = require('../../common_functions/common_functions').isVisible;
const toISOFormat        = require('../../common_functions/string_util').toISOFormat;
const toReadableFormat   = require('../../common_functions/string_util').toReadableFormat;
const DatePicker         = require('../../components/date_picker');

/*
 * Handles duration processing display
 *
 * It process `Contract.durations()` and display them according to
 * the current `Contract.form()` and `Contract.barriers()`
 *
 * It also populate expiry type select box i.e Durations and Endtime select
 *
 */

const Durations = (() => {
    'use strict';

    let selected_duration = {},
        has_end_date = 0;

    const displayDurations = () => {
        let start_type;
        if (Defaults.get('date_start') !== 'now' && State.get('is_start_dates_displayed') && moment(Defaults.get('date_start') * 1000).isAfter(moment())) {
            start_type = 'forward';
        } else {
            start_type = 'spot';
        }

        const durations = Contract.durations();
        if (durations === false) {
            document.getElementById('expiry_row').style.display = 'none';
            Defaults.remove('expiry_type', 'duration_amount', 'duration_units', 'expiry_date', 'expiry_time');
            return;
        }

        const target = document.getElementById('duration_units');
        const form_name = Contract.form();
        const barrier_category = Contract.barrier();
        const duration_container = {};

        while (target && target.firstChild) {
            target.removeChild(target.firstChild);
        }

        Object.keys(durations).forEach((key) => {
            Object.keys(durations[key][form_name]).forEach((form) => {
                let obj = {};
                if (barrier_category) {
                    obj = durations[key][form_name][barrier_category];
                } else {
                    obj = durations[key][form_name][form];
                }
                Object.keys(obj).forEach((type) => {
                    if (start_type) {
                        if (start_type === type) {
                            if (!duration_container.hasOwnProperty(start_type)) {
                                duration_container[key] = obj[start_type];
                            }
                        }
                    } else if (!duration_container.hasOwnProperty(type)) {
                        duration_container[key] = obj[type];
                    }
                });
            });
        });

        const duration_list = {};
        Object.keys(duration_container).forEach((duration) => {
            const text_mapping_min = durationTextValueMappings(duration_container[duration].min_contract_duration);
            const text_mapping_max = durationTextValueMappings(duration_container[duration].max_contract_duration);
            const min_unit         = text_mapping_min.unit;

            if (duration === 'intraday') {
                switch (min_unit) {
                    case 's':
                        duration_list[min_unit] = makeDurationOption(text_mapping_min, text_mapping_max);
                        duration_list.m         = makeDurationOption(durationTextValueMappings('1m'), text_mapping_max, true);
                        duration_list.h         = makeDurationOption(durationTextValueMappings('1h'), text_mapping_max);
                        break;
                    case 'm':
                        duration_list[min_unit] = makeDurationOption(text_mapping_min, text_mapping_max, true);
                        duration_list.h         = makeDurationOption(durationTextValueMappings('1h'), text_mapping_max);
                        break;
                    case 'h':
                        duration_list[min_unit] = makeDurationOption(text_mapping_min, text_mapping_max);
                        break;
                    default :
                        duration_list[min_unit] = makeDurationOption(text_mapping_min, text_mapping_max);
                        break;
                }
            } else if (duration === 'daily' || duration === 'tick') {
                duration_list[min_unit] = makeDurationOption(text_mapping_min, text_mapping_max);
            }
        });
        const list = Object.keys(duration_list).sort((a, b) => (
            commonTrading.durationOrder(a) > commonTrading.durationOrder(b) ? 1 : -1
        ));
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
            if (!commonTrading.selectOption(selected_duration.unit, target)) {
                selected_duration = {};
            }
        }

        durationPopulate();
    };

    const makeDurationOption = (map_min, map_max, is_selected) => {
        const option = document.createElement('option');
        const content = document.createTextNode(map_min.text);
        option.setAttribute('value', map_min.unit);
        option.setAttribute('data-minimum', map_min.value);
        if (map_max.value && map_max.unit) {
            const max = convertDurationUnit(map_max.value, map_max.unit, map_min.unit);
            if (max) {
                option.setAttribute('data-maximum', max);
            }
        }
        if (is_selected) {
            option.setAttribute('selected', 'selected');
        }
        option.appendChild(content);
        return option;
    };

    const convertDurationUnit = (value, from_unit, to_unit) => {
        if (!value || !from_unit || !to_unit) return null;
        if (from_unit === to_unit) return value;
        const seconds = {
            s: 1,
            m: 60,
            h: 3600,
            d: 3600 * 24,
        };
        return (value * seconds[from_unit]) / seconds[to_unit];
    };

    const displayEndTime = () => {
        const date_start = document.getElementById('date_start').value;
        const now = !date_start || date_start === 'now';
        const current_moment = moment((now ? window.time : parseInt(date_start) * 1000)).add(5, 'minutes').utc();
        let expiry_date = Defaults.get('expiry_date') ? moment(Defaults.get('expiry_date')) : current_moment,
            expiry_time = Defaults.get('expiry_time') || current_moment.format('HH:mm'),
            expiry_date_iso = toISOFormat(expiry_date);

        if (moment(`${expiry_date_iso} ${expiry_time}`).valueOf() < current_moment.valueOf()) {
            expiry_date = current_moment;
            expiry_date_iso = toISOFormat(expiry_date);
            expiry_time = current_moment.format('HH:mm');
        }

        const expiry_date_el = document.getElementById('expiry_date');
        const expiry_time_el = document.getElementById('expiry_time');

        expiry_date_el.value = toReadableFormat(expiry_date);
        expiry_date_el.setAttribute('data-value', expiry_date_iso);
        expiry_time_el.value = expiry_time;
        expiry_time_el.setAttribute('data-value', expiry_time);
        Defaults.set('expiry_date', expiry_date_iso);
        Defaults.set('expiry_time', expiry_time);
        Durations.setTime(expiry_time);

        durationPopulate();
    };

    const durationTextValueMappings = (str) => {
        const mapping = {
            s: localize('seconds'),
            m: localize('minutes'),
            h: localize('hours'),
            d: localize('days'),
            t: localize('ticks'),
        };

        const arry = str ? str.toString().match(/[a-zA-Z]+|[0-9]+/g) : [];
        const obj = {};

        if (arry.length > 1) {
            obj.unit = arry[1];
            obj.text = mapping[arry[1]];
            obj.value = arry[0];
        } else {
            obj.unit = 't';
            obj.text = mapping.t;
            obj.value = arry[0];
        }

        return obj;
    };

    const durationPopulate = () => {
        const unit = document.getElementById('duration_units');
        if (!unit.options[unit.selectedIndex]) return;
        const unit_min_value = unit.options[unit.selectedIndex].getAttribute('data-minimum');
        const unit_max_value = unit.options[unit.selectedIndex].getAttribute('data-maximum');
        let unit_value = Defaults.get('duration_amount') || unit_min_value;
        unit.value = Defaults.get('duration_units') &&
            document.querySelectorAll(`select[id="duration_units"] [value="${Defaults.get('duration_units')}"]`).length ?
                Defaults.get('duration_units') : unit.value;
        elementTextContent(document.getElementById('duration_minimum'), unit_min_value);
        elementTextContent(document.getElementById('duration_maximum'), unit_max_value);
        if (selected_duration.amount && selected_duration.unit > unit_value) {
            unit_value = selected_duration.amount;
        }
        document.getElementById('duration_amount').value = unit_value;
        Defaults.set('duration_amount', unit_value);
        displayExpiryType();
        Defaults.set('duration_units', unit.value);

        // jquery for datepicker
        const amount_element = $('#duration_amount');
        const duration_id = '#duration_amount';
        if (unit.value === 'd') {
            const tomorrow = window.time ? new Date(window.time.valueOf()) : new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            DatePicker.init({
                selector: duration_id,
                type    : 'diff',
                minDate : 1,
                maxDate : 364,
                native  : false,
            });
            amount_element.change((value) => {
                let day_diff;
                const $duration_amount_val = $('#duration_amount').val();
                if ($duration_amount_val) {
                    day_diff = $duration_amount_val;
                } else {
                    value = value.target.getAttribute('data-value');
                    const date = value ? new Date(value) : new Date();
                    const today = window.time ? window.time.valueOf() : new Date();
                    day_diff = Math.ceil((date - today) / (1000 * 60 * 60 * 24));
                }
                amount_element.val(day_diff);
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
        Barriers.display();
    };

    const displayExpiryType = () => {
        const target = document.getElementById('expiry_type');
        const fragment = document.createDocumentFragment();

        // in case of having endtime as expiry_type and change the form to contract types
        // which only have duration and do not support endtime, it should change the Default value
        // to get corrected based on contract situations
        if ($('#expiry_type').find(`option[value=${Defaults.get('expiry_type')}]`).length === 0 && target.value) {
            Defaults.set('expiry_type', target.value);
        }
        const current_selected = Defaults.get('expiry_type') || target.value || 'duration';
        let id = current_selected,
            hide_id = (current_selected === 'duration') ? 'endtime' : 'duration';

        id = document.getElementById(`expiry_type_${id}`);
        if (id) {
            id.style.display = 'flex';
        }
        // need to hide the non selected one
        hide_id = document.getElementById(`expiry_type_${hide_id}`);
        if (hide_id) {
            hide_id.style.display = 'none';
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

    const selectEndDate = (end_date) => {
        const expiry_time = document.getElementById('expiry_time');
        const date_start  = document.getElementById('date_start');
        const end_date_readable = toReadableFormat(end_date);
        const end_date_iso      = toISOFormat(end_date);
        $('#expiry_date').val(end_date_readable)
                         .attr('data-value', end_date_iso);
        Defaults.set('expiry_date', end_date_iso);
        if (end_date.isAfter(window.time.format('YYYY-MM-DD HH:mm'), 'day')) {
            Durations.setTime('');
            Defaults.remove('expiry_time');
            setNow(); // start time
            date_start.setAttribute('disabled', 'disabled');
            expiry_time.hide();
            Barriers.display();
            processTradingTimesRequest(end_date_iso);
        } else {
            date_start.removeAttribute('disabled');
            if (!expiry_time.value) {
                const new_time = moment(window.time).add(5, 'minutes').utc().format('HH:mm');
                expiry_time.value = new_time;
                expiry_time.setAttribute('data-value', new_time);
            }
            Durations.setTime(expiry_time.value);
            Defaults.set('expiry_time', Defaults.get('expiry_time') || expiry_time.value);
            expiry_time.show();
            Barriers.display();
            Price.processPriceRequest();
        }
    };

    const processTradingTimesRequest = (date) => {
        const trading_times = commonIndependent.getTradingTimes();
        if (trading_times.hasOwnProperty(date)) {
            Price.processPriceRequest();
        } else {
            commonTrading.showPriceOverlay();
            BinarySocket.send({ trading_times: date }).then((response) => {
                commonIndependent.processTradingTimesAnswer(response);
                Price.processPriceRequest();
            });
        }
    };

    const validateMinDurationAmount = () => {
        const duration_amount_element = document.getElementById('duration_amount');
        const duration_min_element    = document.getElementById('duration_minimum');
        const duration_max_element    = document.getElementById('duration_maximum');
        if (!isVisible(duration_amount_element) || !isVisible(duration_min_element)) return;
        if (+duration_amount_element.value < +duration_min_element.textContent ||
           (+duration_max_element.textContent &&
           (+duration_amount_element.value > +duration_max_element.textContent))) {
            duration_amount_element.classList.add('error-field');
        } else {
            duration_amount_element.classList.remove('error-field');
        }
    };

    const onStartDateChange = (value) => {
        const $date_start_select = $('#date_start');
        if (!value || !$date_start_select.find(`option[value=${value}]`).length) {
            return 0;
        }

        const yellow_border = 'light-yellow-background';
        if (value !== 'now') {
            $date_start_select.addClass(yellow_border);
        } else {
            $date_start_select.removeClass(yellow_border);
        }

        $date_start_select.val(value);

        let make_price_request = 1;
        const $expiry_time = $('#expiry_time');
        if (value !== 'now' && Defaults.get('expiry_type') === 'endtime') {
            make_price_request = -1;
            const end_time = moment(parseInt(value) * 1000).add(5, 'minutes').utc();
            Durations.setTime((commonTrading.timeIsValid($expiry_time) && Defaults.get('expiry_time') ?
                               Defaults.get('expiry_time') : end_time.format('HH:mm')));
            Durations.selectEndDate((commonTrading.timeIsValid($expiry_time) && (Defaults.get('expiry_date') ? moment(Defaults.get('expiry_date')) : end_time)));
        }
        commonTrading.timeIsValid($expiry_time);
        Durations.display();
        return make_price_request;
    };

    const setNow = () => {
        const $date_start = $('#date_start');
        if ($date_start.find('option[value="now"]').length) {
            $date_start.val('now').removeClass('light-yellow-background');
            Defaults.set('date_start', 'now');
        }
    };

    return {
        display                  : displayDurations,
        displayEndTime           : displayEndTime,
        populate                 : durationPopulate,
        selectEndDate            : selectEndDate,
        validateMinDurationAmount: validateMinDurationAmount,
        onStartDateChange        : onStartDateChange,
        setTime                  : (time) => { $('#expiry_time').val(time); Defaults.set('expiry_time', time); },
        selectAmount             : (a) => { selected_duration.amount = a; },
        selectUnit               : (u) => { selected_duration.unit = u; },
    };
})();

module.exports = Durations;

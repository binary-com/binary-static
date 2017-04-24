const moment           = require('moment');
const MBDefaults       = require('./mb_defaults');
const MBSymbols        = require('./mb_symbols');
const Client           = require('../../base/client');
const getLanguage      = require('../../base/language').get;
const localize         = require('../../base/localize').localize;
const isEmptyObject    = require('../../base/utility').isEmptyObject;
const elementInnerHtml = require('../../common_functions/common_functions').elementInnerHtml;
const jpClient         = require('../../common_functions/country_base').jpClient;
const formatCurrency   = require('../../common_functions/currency_to_symbol').formatCurrency;

/*
 * Contract object mocks the trading form we have on our website
 * It parses the contracts json we get from socket.send({contracts_for: 'R_50'})
 */
const MBContract = (() => {
    'use strict';

    let contracts_for_response;

    const durationText = (dur) => {
        const duration_map = {
            m: 'min',
            h: 'h',
            d: 'day',
            W: 'week',
            M: 'month',
            Y: 'year',
        };
        Object.keys(duration_map).forEach((key) => {
            dur = dur.replace(key, localize(duration_map[key] + (+dur[0] === 1 || /h/.test(key) ? '' : 's')));
        });
        if (!jpClient()) {
            dur = dur.replace(/(\d+)([a-z]+)/ig, '$1 $2 ').trim();
        }
        return dur;
    };

    const PeriodText = (trading_period) => {
        let date_expiry,
            duration;
        if (typeof trading_period === 'object') {
            date_expiry = trading_period.date_expiry.epoch;
            duration = trading_period.duration;
        } else {
            date_expiry = trading_period.split('_')[1];
            duration = trading_period.split('_')[2];
        }
        let text_value = moment.utc(date_expiry * 1000)
                            .utcOffset(jpClient() ? '+09:00' : '+00:00')
                            .locale(getLanguage().toLowerCase())
                            .format('MMM Do, HH:mm');
        if (jpClient()) {
            text_value = `${text_value.replace(/08:59/, '09:00«')} (${durationText(duration.replace('0d', '1d'))})`;
        }
        return text_value.toString();
    };

    // use function to generate elements and append them
    // e.g. element is select and element to append is option
    const appendTextValueChild = (element, string, value, is_selected) => {
        if (element && !element.nodeName) {
            if (typeof element === 'string') {
                element = document.getElementById(element);
            } else {
                element = undefined;
            }
        }
        if (!element) return;
        const option = document.createElement('option');
        option.text = string;
        option.value = value;
        if (is_selected) {
            option.setAttribute('selected', 'selected');
        }
        element.appendChild(option);
    };

    const populatePeriods = (rebuild) => {
        if (!contracts_for_response || isEmptyObject(contracts_for_response)) return;
        let trading_period,
            start_end;
        const trading_period_array = [];
        const available_contracts = contracts_for_response.contracts_for.available;
        const selected_option = MBDefaults.get('category');
        const $period_element = $('#period');
        if (!selected_option || !available_contracts) return;
        for (let i = 0; i < available_contracts.length; i++) {
            if (available_contracts[i].contract_category === selected_option) {
                trading_period = available_contracts[i].trading_period;
                if (!trading_period) return;
                start_end = [trading_period.date_start.epoch, trading_period.date_expiry.epoch, trading_period.duration].join('_');
                if (trading_period_array.indexOf(start_end) < 0) {
                    trading_period_array.push(start_end);
                }
            }
        }
        trading_period_array.sort(sortByExpiryTime);
        if (rebuild) {
            $period_element.empty();
        }
        if ($period_element.children().length === 0) { // populate for the first time
            const default_value = MBDefaults.get('period');
            for (let j = 0; j < trading_period_array.length; j++) {
                appendTextValueChild(
                    'period',
                    PeriodText(trading_period_array[j]),
                    trading_period_array[j],
                    trading_period_array[j] === default_value);
            }
            MBDefaults.set('period', $period_element.val());
            MBContract.displayDescriptions();
            MBContract.displayRemainingTime(true);
        } else { // update options
            let existing_array = [];
            const missing_array  = [];
            $period_element.find('option').each(function() {
                existing_array.push($(this).val());
            });

            // add new periods to dropdown
            for (let l = 0; l < trading_period_array.length; l++) {
                if (existing_array.indexOf(trading_period_array[l]) < 0) {
                    missing_array.push(trading_period_array[l]);
                }
            }
            if (missing_array.length > 0) {
                let $new_option;
                existing_array = existing_array.concat(missing_array).sort(sortByExpiryTime);
                for (let m = 0; m < existing_array.length; m++) {
                    if ($period_element.find(`option[value="${existing_array[m]}"]`).length < 1) {
                        $new_option = $('<option/>', { value: existing_array[m], text: PeriodText(existing_array[m]) });
                        if (m < 1) {
                            $new_option.insertBefore($period_element.children().eq(m));
                        } else {
                            $new_option.insertAfter($period_element.children().eq(m - 1));
                        }
                    }
                }
            }

            // remove periods that no longer exist
            existing_array.forEach((period) => {
                if (trading_period_array.indexOf(period) < 0) {
                    $period_element.find(`option[value="${period}"]`).remove();
                }
            });
        }
    };

    let period_value,
        $count_down_timer,
        remaining_time_element,
        remaining_timeout;
    const displayRemainingTime = (recalculate) => {
        if (typeof period_value === 'undefined' || recalculate) {
            period_value = document.getElementById('period').value;
            $count_down_timer = $('.countdown-timer');
            remaining_time_element = document.getElementById('remaining-time');
        }
        if (!period_value) return;
        const time_left = parseInt(period_value.split('_')[1]) - window.time.unix();
        if (time_left <= 0) {
            location.reload();
        } else if (time_left < 120) {
            $count_down_timer.addClass('alert');
        }
        const remaining_time_string = [];
        const duration = moment.duration(time_left * 1000);
        const all_durations = {
            month : duration.months(),
            day   : duration.days(),
            hour  : duration.hours(),
            minute: duration.minutes(),
            second: duration.seconds(),
        };
        Object.keys(all_durations).forEach((key) => {
            if (all_durations[key]) {
                remaining_time_string.push(all_durations[key] + (jpClient() ? '' : ' ') + localize((key + (+all_durations[key] === 1 ? '' : 's'))));
            }
        });
        elementInnerHtml(remaining_time_element, remaining_time_string.join(' '));
        if (remaining_timeout) clearRemainingTimeout();
        remaining_timeout = setTimeout(displayRemainingTime, 1000);
    };

    const clearRemainingTimeout = () => { clearTimeout(remaining_timeout); };

    const sortByExpiryTime = (first, second) => {
        const a = first.split('_');
        const b = second.split('_');
        const duration1 = a[1] - a[0];
        const duration2 = b[1] - b[0];
        return a[1] === b[1] ? duration1 - duration2 : a[1] - b[1];
    };

    const populateOptions = (rebuild) => {
        if (!contracts_for_response || isEmptyObject(contracts_for_response)) return;
        let  category;
        const contracts_array = [];
        const available_contracts = contracts_for_response.contracts_for.available;
        const $category_element = $('#category');
        const category_names = {
            callput     : localize('Higher/Lower'),
            touchnotouch: localize('Touch/No Touch'),
            endsinout   : localize('Ends In/Out'),
            staysinout  : localize('Stays In/Goes Out'),
        };
        const category_order = {
            callput     : 1,
            touchnotouch: 2,
            endsinout   : 3,
            staysinout  : 4,
        };
        for (let i = 0; i < available_contracts.length; i++) {
            category = contracts_for_response.contracts_for.available[i].contract_category;
            if (contracts_array.indexOf(category) < 0) {
                contracts_array.push(category);
            }
        }
        contracts_array.sort((a, b) => category_order[a] - category_order[b]);
        if (rebuild) {
            $category_element.empty();
        }
        if ($category_element.children().length === 0) {
            const default_value = MBDefaults.get('category');
            for (let j = 0; j < contracts_array.length; j++) {
                appendTextValueChild(
                    'category',
                    category_names[contracts_array[j]],
                    contracts_array[j],
                    contracts_array[j] === default_value);
            }
            MBDefaults.set('category', $category_element.val());
        }
        populatePeriods(rebuild);
    };

    const getCurrentContracts = () => {
        if (!contracts_for_response || isEmptyObject(contracts_for_response)) return [];
        const contracts = [];
        const category  = MBDefaults.get('category');
        const periods   = MBDefaults.get('period').split('_');
        contracts_for_response.contracts_for.available.forEach((c) => {
            if (c.contract_category === category && c.trading_period &&
                    +c.trading_period.date_start.epoch  === +periods[0] &&
                    +c.trading_period.date_expiry.epoch === +periods[1]) {
                contracts.push(c);
            }
        });
        return contracts;
    };

    const getTemplate = (contract_type) => {
        const templates = {
            PUT: {
                opposite   : 'CALLE',
                order      : 0,
                name       : 'Lower',
                description: '[_1] [_2] payout if [_3] is strictly lower than Barrier at close on [_4].',
            },
            CALLE: {
                opposite   : 'PUT',
                order      : 1,
                name       : 'Higher',
                description: '[_1] [_2] payout if [_3] is strictly higher than or equal to Barrier at close on [_4].',
            },
            ONETOUCH: {
                opposite   : 'NOTOUCH',
                order      : 0,
                name       : 'Touches',
                description: '[_1] [_2] payout if [_3] touches Barrier through close on [_4].',
            },
            NOTOUCH: {
                opposite   : 'ONETOUCH',
                order      : 1,
                name       : 'Does Not Touch',
                description: '[_1] [_2] payout if [_3] does not touch Barrier through close on [_4].',
            },
            EXPIRYRANGEE: {
                opposite   : 'EXPIRYMISS',
                order      : 0,
                name       : 'Ends Between',
                description: '[_1] [_2] payout if [_3] ends on or between low and high values of Barrier at close on [_4].',
            },
            EXPIRYMISS: {
                opposite   : 'EXPIRYRANGEE',
                order      : 1,
                name       : 'Ends Outside',
                description: '[_1] [_2] payout if [_3] ends outside low and high values of Barrier at close on [_4].',
            },
            RANGE: {
                opposite   : 'UPORDOWN',
                order      : 0,
                name       : 'Stays Between',
                description: '[_1] [_2] payout if [_3] stays between low and high values of Barrier through close on [_4].',
            },
            UPORDOWN: {
                opposite   : 'RANGE',
                order      : 1,
                name       : 'Goes Outside',
                description: '[_1] [_2] payout if [_3] goes outside of low and high values of Barrier through close on [_4].',
            },
        };
        return contract_type ? templates[contract_type] : templates;
    };

    const displayDescriptions = () => {
        const contracts = getCurrentContracts();
        const $desc_wrappers = $('.prices-wrapper');
        const currency = (formatCurrency(Client.get('currency')) || formatCurrency(document.getElementById('currency').value) || '¥');
        const payout = Number(MBDefaults.get('payout') * (jpClient() ? 1000 : 1)).toLocaleString();
        const display_name = MBSymbols.getName(MBDefaults.get('underlying'));
        const date_expiry = PeriodText(contracts[0].trading_period).replace(/\s\(.*\)/, '');
        contracts.forEach((c) => {
            const contract_type = c.contract_type;
            const template = getTemplate(contract_type);
            const $wrapper = $($desc_wrappers[template.order]);
            $wrapper.find('.contract-type').attr('class', `contract-type ${contract_type}${template.order ? ' negative-color' : ''}`).text(localize(template.name));
            $wrapper.find('.descr').html(localize(template.description, [currency, payout, display_name, date_expiry]));
        });
    };

    const getCurrency = () => (
        (Client.get('currency') || document.getElementById('currency').value || 'JPY')
    );

    return {
        populatePeriods     : populatePeriods,
        populateOptions     : populateOptions,
        displayRemainingTime: displayRemainingTime,
        getCurrentContracts : getCurrentContracts,
        getTemplate         : getTemplate,
        displayDescriptions : displayDescriptions,
        getCurrency         : getCurrency,
        getContractsResponse: () => contracts_for_response,
        setContractsResponse: (contracts_for) => { contracts_for_response = contracts_for; },
        onUnload            : () => {
            clearRemainingTimeout(); contracts_for_response = {}; period_value = undefined;
        },
    };
})();

module.exports = MBContract;

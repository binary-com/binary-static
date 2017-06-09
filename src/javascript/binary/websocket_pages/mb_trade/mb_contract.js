const moment           = require('moment');
const MBDefaults       = require('./mb_defaults');
const Client           = require('../../base/client');
const getLanguage      = require('../../base/language').get;
const localize         = require('../../base/localize').localize;
const isEmptyObject    = require('../../base/utility').isEmptyObject;
const jpClient         = require('../../common_functions/country_base').jpClient;
const padLeft          = require('../../common_functions/string_util').padLeft;

/*
 * Contract object mocks the trading form we have on our website
 * It parses the contracts json we get from socket.send({contracts_for: 'R_50'})
 */
const MBContract = (() => {
    'use strict';

    let contracts_for_response;

    const periodText = (trading_period) => {
        let date_start,
            date_expiry,
            duration;
        if (typeof trading_period === 'object') {
            date_start = trading_period.date_start.epoch;
            date_expiry = trading_period.date_expiry.epoch;
            duration = trading_period.duration;
        } else {
            date_start = trading_period.split('_')[0];
            date_expiry = trading_period.split('_')[1];
            duration = trading_period.split('_')[2];
        }

        const toDate = (date) => {
            let text_value = moment.utc(date * 1000)
                .utcOffset(jpClient() ? '+09:00' : '+00:00')
                .locale(getLanguage().toLowerCase())
                .format('MMM Do, HH:mm');
            if (jpClient()) {
                text_value = text_value.replace(/08:59/, '09:00«');
            }
            return text_value;
        };
        return {
            start   : toDate(date_start),
            end     : toDate(date_expiry),
            duration: duration ? duration.replace('0d', '1d') : '',
        };
    };

    const populatePeriods = (rebuild) => {
        if (!contracts_for_response || isEmptyObject(contracts_for_response)) return;
        let trading_period,
            start_end;
        const trading_period_array = [],
            available_contracts = contracts_for_response.contracts_for.available,
            selected_option = MBDefaults.get('category'),
            $period = $('#period');
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
        const $list = $period.find('.list');
        if (rebuild) {
            $list.empty();
        }
        const makeItem = (period) => {
            const text = periodText(period);
            const duration = text.duration.toUpperCase().replace(/([A-Z])/, '$1<br>');
            return $('<div/>', {
                value: period,
                html : `<div class="duration gr-3">${duration}</div><div class="end gr-5">${text.end}</div><div class="remaining-time gr-4"></div>`,
                class: 'gr-row',
            });
        };
        if ($list.children().length === 0) { // populate for the first time
            let default_value = MBDefaults.get('period');
            if (trading_period_array.indexOf(default_value) === -1) default_value = '';
            trading_period_array.forEach((period, idx) => {
                const is_current = (!default_value && idx === 0) || period === default_value;
                const $current = makeItem(period);
                $list.append($current);
                if (is_current) {
                    setCurrentItem($period, period);
                }
            });
            MBDefaults.set('period', $period.attr('value'));
            MBContract.displayRemainingTime(true);
        } else { // update options
            let existing_array = [];
            const missing_array  = [];
            $list.find('> div').each(function() {
                existing_array.push($(this).val());
            });

            // add new periods to dropdown
            trading_period_array.forEach((period) => {
                if (existing_array.indexOf(period) < 0) {
                    missing_array.push(period);
                }
            });
            if (missing_array.length > 0) {
                let $new_item;
                existing_array = existing_array.concat(missing_array).sort(sortByExpiryTime);
                existing_array.forEach((existing, idx) => {
                    if ($list.find(`[value="${existing}"]`).length < 1) {
                        $new_item = makeItem(existing);
                        if (idx < 1) {
                            $($new_item).insertBefore($list.children().eq(idx));
                        } else {
                            $($new_item).insertAfter($list.children().eq(idx - 1));
                        }
                    }
                });
            }

            // remove periods that no longer exist
            existing_array.forEach((period) => {
                if (trading_period_array.indexOf(period) < 0) {
                    $list.find(`[value="${period}"]`).remove();
                }
            });
        }
    };

    let period_value,
        $count_down_timer,
        remaining_timeout;
    const displayRemainingTime = (recalculate) => {
        if (typeof period_value === 'undefined' || recalculate) {
            period_value = MBDefaults.get('period');
            $count_down_timer = $('.remaining-time');
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
                remaining_time_string.push(padLeft(all_durations[key], 2, '0'));
            }
        });
        $count_down_timer.text(remaining_time_string.join(':'));
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
        const available_contracts = contracts_for_response.contracts_for.available,
            $category = $('#category');
        const categories = [
            { value: 'callput',      type1: 'PUT',          type2: 'CALLE'      },
            { value: 'touchnotouch', type1: 'ONETOUCH',     type2: 'NOTOUCH'    },
            { value: 'endsinout',    type1: 'EXPIRYRANGEE', type2: 'EXPIRYMISS' },
            { value: 'staysinout',   type1: 'RANGE',        type2: 'UPORDOWN'   },
        ];

        const $list = $category.find('.list');
        if (rebuild) {
            $list.empty();
        }
        if ($list.children().length === 0) {
            const default_value = MBDefaults.get('category');
            categories.forEach((category, idx) => {
                if (available_contracts.find(contract => contract.contract_category === category.value)) {
                    const is_current = (!default_value && idx === 0) || category.value === default_value;
                    const $current   = $('<div/>', {
                        value: category.value,
                        html : `<span class="contract-type gr-6 ${category.type1}">${localize(getTemplate(category.type1).name)}</span>
                                <span class="contract-type gr-6 ${category.type2} negative-color">${localize(getTemplate(category.type2).name)}</span>`,
                        class: 'gr-row',
                    });
                    $list.append($current);
                    if (is_current) {
                        setCurrentItem($category, category.value);
                    }
                }
            });
            MBDefaults.set('category', $category.attr('value'));
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

    const getCurrency = () => (Client.get('currency') || $('#currency').attr('value') || 'JPY');

    const setCurrentItem = ($container, value) => {
        const $selected = $container.find(`.list [value="${value}"]`);
        if ($selected.length) {
            $container.attr('value', value).find('> .current').html($selected.clone());

            const hidden_class = 'invisible';
            $container.find(`.list .${hidden_class}`).removeClass(hidden_class);
            $selected.addClass(hidden_class);
        }
    };

    return {
        populatePeriods     : populatePeriods,
        populateOptions     : populateOptions,
        displayRemainingTime: displayRemainingTime,
        getCurrentContracts : getCurrentContracts,
        getTemplate         : getTemplate,
        getCurrency         : getCurrency,
        getContractsResponse: () => contracts_for_response,
        setContractsResponse: (contracts_for) => { contracts_for_response = contracts_for; },
        setCurrentItem      : setCurrentItem,
        onUnload            : () => {
            clearRemainingTimeout(); contracts_for_response = {}; period_value = undefined;
        },
    };
})();

module.exports = MBContract;

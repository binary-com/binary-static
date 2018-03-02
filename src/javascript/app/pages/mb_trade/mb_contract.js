const moment        = require('moment');
const MBDefaults    = require('./mb_defaults');
const Client        = require('../../base/client');
const SocketCache   = require('../../base/socket_cache');
const jpClient      = require('../../common/country_base').jpClient;
const getLanguage   = require('../../../_common/language').get;
const localize      = require('../../../_common/localize').localize;
const padLeft       = require('../../../_common/string_util').padLeft;
const isEmptyObject = require('../../../_common/utility').isEmptyObject;

/*
 * Contract object mocks the trading form we have on our website
 * It parses the contracts json we get from socket.send({contracts_for: 'R_50'})
 */
const MBContract = (() => {
    let contracts_for_response,
        remaining_timeout,
        current_time_left,
        $period,
        $durations,
        $duration,
        $count_down_timer;

    const hidden_class = 'invisible';

    const duration_map = {
        m: 'minute',
        h: 'h',
        d: 'day',
        W: 'week',
        M: 'month',
        Y: 'year',
    };

    const durationText = (duration) => {
        let dur = duration;
        if (dur && jpClient()) {
            dur = dur.replace(/([a-z])/, '$1<br>');
            Object.keys(duration_map).forEach((key) => {
                dur = dur.replace(key, localize(duration_map[key] + (+dur[0] === 1 || /h/.test(key) ? '' : 's')));
            });
        }
        return dur.toUpperCase();
    };

    const periodText = (trading_period) => {
        let date_start,
            date_expiry,
            duration;
        if (typeof trading_period === 'object') {
            date_start  = trading_period.date_start.epoch;
            date_expiry = trading_period.date_expiry.epoch;
            duration    = trading_period.duration;
        } else {
            date_start  = trading_period.split('_')[0];
            date_expiry = trading_period.split('_')[1];
            duration    = trading_period.split('_')[2];
        }
        duration = duration ? duration.replace('0d', '1d') : '';

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
            duration: durationText(duration),
        };
    };

    const populatePeriods = (should_rebuild) => {
        if (!contracts_for_response || isEmptyObject(contracts_for_response)) return;
        let trading_period,
            start_end;
        const trading_period_array = [];
        const available_contracts  = contracts_for_response.contracts_for.available;
        const selected_option      = MBDefaults.get('category');
        $period                    = $('#period');
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
        if (should_rebuild) {
            $list.empty();
        }
        const makeItem = (period) => {
            const text = periodText(period);
            return $('<div/>', {
                value: period,
                html : `<div class="duration gr-3 gr-no-gutter">${text.duration}</div><div class="end gr-6 gr-5-m">${text.end}</div><div class="remaining-time gr-3 gr-4-m gr-no-gutter"></div>`,
                class: 'gr-row',
            });
        };
        if ($list.children().length === 0) { // populate for the first time
            let default_value = MBDefaults.get('period');
            if (trading_period_array.indexOf(default_value) === -1) default_value = '';
            trading_period_array.forEach((period, idx) => {
                const is_current = (!default_value && idx === 0) || period === default_value;
                const $current   = makeItem(period);
                $list.append($current);
                if (is_current) {
                    setCurrentItem($period, period);
                }
            });
            MBDefaults.set('period', $period.attr('value'));
            MBContract.displayRemainingTime(true);
        } else { // update options
            let existing_array  = [];
            const missing_array = [];
            $list.find('> div').each(function () {
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

    const displayRemainingTime = (recalculate) => {
        if (typeof $durations === 'undefined' || recalculate) {
            // period_value = MBDefaults.get('period');
            $period    = $('#period');
            $durations = $period.find('.list > div, .current > div');
        }
        if (!$durations) return;
        $durations.each((idx) => {
            $duration         = $($durations[idx]);
            $count_down_timer = $duration.find('.remaining-time');

            const time_left = parseInt($duration.attr('value').split('_')[1]) - window.time.unix();
            if (time_left <= 0) {
                // clear the expired contracts_for response
                SocketCache.remove('contracts_for', 1);
                location.reload();
            } else if (time_left < 120) {
                $count_down_timer.addClass('alert');
            }
            const remaining_month_day_string = [];
            const remaining_time_string      = [];

            const duration = moment.duration(time_left * 1000);

            const all_durations = {
                month : duration.months(),
                day   : duration.days(),
                hour  : duration.hours(),
                minute: duration.minutes(),
                second: duration.seconds(),
            };

            Object.keys(all_durations).forEach((key) => {
                if (/month|day/.test(key)) {
                    if (all_durations[key]) {
                        remaining_month_day_string.push(all_durations[key] + localize(key[0].toUpperCase()));
                    }
                } else {
                    remaining_time_string.push(padLeft(all_durations[key] || 0, 2, '0'));
                }
            });

            $count_down_timer.text(`${remaining_month_day_string.join('')} ${remaining_time_string.join(':')}`);
        });
        current_time_left = parseInt($period.attr('value').split('_')[1]) - window.time.unix();
        if (current_time_left < 120) {
            // make all price buttons inactive if less than 2 minutes remaining
            $('.price-button').addClass('inactive');
        }
        if (remaining_timeout) clearRemainingTimeout();
        remaining_timeout = setTimeout(displayRemainingTime, 500);
    };

    const clearRemainingTimeout = () => { clearTimeout(remaining_timeout); };

    const sortByExpiryTime = (first, second) => {
        const a = first.split('_');
        const b = second.split('_');

        const duration1 = a[1] - a[0];
        const duration2 = b[1] - b[0];

        return a[1] === b[1] ? duration1 - duration2 : a[1] - b[1];
    };

    const categories  = [
        { value: 'callput',      type1: 'PUT',          type2: 'CALLE' },
        { value: 'touchnotouch', type1: 'ONETOUCH',     type2: 'NOTOUCH' },
        { value: 'endsinout',    type1: 'EXPIRYRANGEE', type2: 'EXPIRYMISS' },
        { value: 'staysinout',   type1: 'RANGE',        type2: 'UPORDOWN' },
    ];

    const populateOptions = (should_rebuild) => {
        if (!contracts_for_response || isEmptyObject(contracts_for_response)) return;
        const available_contracts = contracts_for_response.contracts_for.available;

        const $category = $('#category');
        const $list     = $category.find('.list');
        if (should_rebuild) {
            $list.empty();
        }
        if ($list.children().length === 0) {
            const default_value = MBDefaults.get('category');
            categories.forEach((category, idx) => {
                if (available_contracts.find(contract => contract.contract_category === category.value)) {
                    const is_current = (!default_value && idx === 0) || category.value === default_value;
                    const $current   = $('<div/>', {
                        value: category.value,
                        html : `<span class="contract-type gr-6 ${category.type1}"><span>${localize(getTemplate(category.type1).name)}</span></span>
                                <span class="contract-type gr-6 ${category.type2} negative-color"><span>${localize(getTemplate(category.type2).name)}</span></span>`,
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
        populatePeriods(should_rebuild);
    };

    const getCurrentContracts = () => {
        if (!contracts_for_response || isEmptyObject(contracts_for_response)) return [];
        const contracts = [];
        const category  = MBDefaults.get('category');
        const periods   = MBDefaults.get('period').split('_');
        contracts_for_response.contracts_for.available.forEach((c) => {
            if (c.contract_category === category && c.trading_period &&
                +c.trading_period.date_start.epoch === +periods[0] &&
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

    const setCurrentItem = ($container, value, is_underlying) => {
        const $selected = $container.find(`.list [value="${value}"]`);
        if ($selected.length) {
            if (is_underlying) {
                $container.attr('value', value).find('> .current').find('img').attr('src', $selected.find('img').attr('src'))
                    .end()
                    .find('.name')
                    .text($selected.text());
            } else {
                $container.attr('value', value).find('> .current').html($selected.clone());
            }

            $container.find(`.list .${hidden_class}`).removeClass(hidden_class);
            $selected.addClass(hidden_class);
        }
    };

    return {
        populatePeriods,
        populateOptions,
        displayRemainingTime,
        getCurrentContracts,
        getTemplate,
        getCurrency,
        setCurrentItem,
        getRemainingTime    : () => current_time_left,
        getContractsResponse: () => contracts_for_response,
        setContractsResponse: (contracts_for) => { contracts_for_response = contracts_for; },
        onUnload            : () => {
            clearRemainingTimeout(); contracts_for_response = {}; $durations = undefined;
        },
    };
})();

module.exports = MBContract;

const moment           = require('moment');
const MBDefaults       = require('./mb_defaults').MBDefaults;
const MBSymbols        = require('./mb_symbols').MBSymbols;
const Client           = require('../../base/client');
const getLanguage      = require('../../base/language').get;
const localize         = require('../../base/localize').localize;
const objectNotEmpty   = require('../../base/utility').objectNotEmpty;
const elementInnerHtml = require('../../common_functions/common_functions').elementInnerHtml;
const jpClient         = require('../../common_functions/country_base').jpClient;
const formatCurrency   = require('../../common_functions/currency_to_symbol').formatCurrency;

/*
 * Contract object mocks the trading form we have on our website
 * It parses the contracts json we get from socket.send({contracts_for: 'R_50'})
 */
const MBContract = (function() {
    'use strict';

    let contracts_for_response,
        contract_timeout;

    const getContracts = function(underlying) {
        const req = {
            contracts_for: (underlying || MBDefaults.get('underlying')),
            currency     : getCurrency(),
            product_type : 'multi_barrier',
        };
        if (!underlying) {
            req.passthrough = { action: 'no-proposal' };
        }
        BinarySocket.send(req);
        if (contract_timeout) clearContractTimeout(contract_timeout);
        contract_timeout = setTimeout(getContracts, 15000);
    };

    const clearContractTimeout = function(timoutID) {
        if (timoutID) {
            clearTimeout(timoutID);
        } else {
            clearTimeout(contract_timeout);
            clearTimeout(remainingTimeout);
        }
    };

    const periodText = function(trading_period) {
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

    const populatePeriods = function(rebuild) {
        if (!contracts_for_response || !objectNotEmpty(contracts_for_response)) return;
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
                start_end = trading_period.date_start.epoch + '_' + trading_period.date_expiry.epoch + '_' + trading_period.duration;
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
            return $('<div/>', {
                value: period,
                html : `<div class="start">${text.start}</div><div class="duration">${text.duration}</div><div class="end">${text.end}</div>`,
            });
        };
        if ($list.children().length === 0) { // populate for the first time
            const default_value = MBDefaults.get('period');
            trading_period_array.forEach((period, idx) => {
                const is_current = (!default_value && idx === 0) || period === default_value;
                const $current = makeItem(period);
                $list.append($current);
                if (is_current) {
                    $period.attr('value', period).find('> .current').html($current.clone());
                }
            });
            MBDefaults.set('period', $period.attr('value'));
            MBContract.displayDescriptions();
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
                    if ($list.find('[value="' + existing + '"]').length < 1) {
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
            existing_array.forEach(function(period) {
                if (trading_period_array.indexOf(period) < 0) {
                    $list.find('[value="' + period + '"]').remove();
                }
            });
        }
    };

    let periodValue,
        $countDownTimer,
        remainingTimeElement,
        remainingTimeout;
    const displayRemainingTime = function(recalculate) {
        if (typeof periodValue === 'undefined' || recalculate) {
            periodValue = MBDefaults.get('period');
            $countDownTimer = $('.countdown-timer');
            remainingTimeElement = document.getElementById('remaining-time');
        }
        if (!periodValue) return;
        const timeLeft = parseInt(periodValue.split('_')[1]) - window.time.unix();
        if (timeLeft <= 0) {
            location.reload();
        } else if (timeLeft < 120) {
            $countDownTimer.addClass('alert');
        }
        const remainingTimeString = [],
            duration = moment.duration(timeLeft * 1000);
        const all_durations = {
            month : duration.months(),
            day   : duration.days(),
            hour  : duration.hours(),
            minute: duration.minutes(),
            second: duration.seconds(),
        };
        Object.keys(all_durations).forEach(function(key) {
            if (all_durations[key]) {
                remainingTimeString.push(all_durations[key] + (jpClient() ? '' : ' ') + localize((key + (+all_durations[key] === 1 ? '' : 's'))));
            }
        });
        elementInnerHtml(remainingTimeElement, remainingTimeString.join(' '));
        if (remainingTimeout) clearContractTimeout(remainingTimeout);
        remainingTimeout = setTimeout(displayRemainingTime, 1000);
    };

    const sortByExpiryTime = function(first, second) {
        const a = first.split('_'),
            b = second.split('_'),
            duration1 = a[1] - a[0],
            duration2 = b[1] - b[0];
        return a[1] === b[1] ? duration1 - duration2 : a[1] - b[1];
    };

    const populateOptions = function(rebuild) {
        if (!contracts_for_response || !objectNotEmpty(contracts_for_response)) return;
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
                        html : `<span class="contract-type ${category.type1}">${localize(getTemplate(category.type1).name)}</span>
                                <span class="contract-type ${category.type2} negative-color">${localize(getTemplate(category.type2).name)}</span>`,
                    });
                    $list.append($current);
                    if (is_current) {
                        $category.attr('value', category.value).find('> .current').html($current.clone());
                    }
                }
            });
            MBDefaults.set('category', $category.attr('value'));
        }
        populatePeriods(rebuild);
    };

    const getCurrentContracts = function() {
        if (!contracts_for_response || !objectNotEmpty(contracts_for_response)) return [];
        const contracts = [],
            category  = MBDefaults.get('category'),
            periods   = MBDefaults.get('period').split('_');
        contracts_for_response.contracts_for.available.forEach(function(c) {
            if (c.contract_category === category && c.trading_period &&
                    +c.trading_period.date_start.epoch  === +periods[0] &&
                    +c.trading_period.date_expiry.epoch === +periods[1]) {
                contracts.push(c);
            }
        });
        return contracts;
    };

    const getTemplate = function(contract_type) {
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

    const displayDescriptions = function() {
        const contracts = getCurrentContracts();
        if (!contracts.length) return;
        const $desc_wrappers = $('.descr-wrapper'),
            currency = (formatCurrency(Client.get('currency')) || formatCurrency(document.getElementById('currency').value) || '¥'),
            payout = Number(MBDefaults.get('payout') * (jpClient() ? 1000 : 1)).toLocaleString(),
            display_name = MBSymbols.getName(MBDefaults.get('underlying')),
            date_expiry = periodText(contracts[0].trading_period).end.replace(/\s\(.*\)/, '');
        contracts.forEach(function(c) {
            const contract_type = c.contract_type,
                template = getTemplate(contract_type),
                $wrapper = $($desc_wrappers[template.order]);
            $wrapper.find('.contract-type')
                .attr('class', `contract-type ${contract_type}${template.order ? ' negative-color' : ''}`).text(localize(template.name))
                .attr('data-balloon', localize(template.description, [currency, payout, display_name, date_expiry]));
        });
    };

    const getCurrency = function() {
        return (Client.get('currency') || document.getElementById('currency').value || 'JPY');
    };

    return {
        getContracts        : getContracts,
        populatePeriods     : populatePeriods,
        populateOptions     : populateOptions,
        displayRemainingTime: displayRemainingTime,
        getCurrentContracts : getCurrentContracts,
        getTemplate         : getTemplate,
        displayDescriptions : displayDescriptions,
        getCurrency         : getCurrency,
        getContractsResponse: function() { return contracts_for_response; },
        setContractsResponse: function(contracts_for) { contracts_for_response = contracts_for; },
        onUnload            : function() {
            clearContractTimeout(); contracts_for_response = {}; periodValue = undefined;
        },
    };
})();

module.exports = {
    MBContract: MBContract,
};

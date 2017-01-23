const template   = require('../../../base/utility').template;
const LocalStore = require('../../../base/storage').LocalStore;
const moment     = require('moment');

const RealityCheckData = (function() {
    'use strict';

    const defaultInterval = 600000;
    const durationTemplateString = '[_1] days [_2] hours [_3] minutes';
    const tradingTimeTemplate = 'Your trading statistics since [_1].';
    const reality_object = {};

    const getSummaryAsync = function() {
        BinarySocket.send({ reality_check: 1 });
    };

    const resetInvalid = function() {
        const ack = get('ack');
        const interval = +(get('interval'));
        if (ack !== 0 && ack !== 1) {
            set('ack', 0);
        }
        if (!interval) {
            set('interval', defaultInterval);
        }
    };

    const summaryData = function(wsData) {
        const startTime = moment.utc(new Date(wsData.start_time * 1000));
        const currentTime = moment.utc();

        const sessionDuration = moment.duration(currentTime.diff(startTime));
        const durationString = template(durationTemplateString, [
            sessionDuration.get('days'),
            sessionDuration.get('hours'),
            sessionDuration.get('minutes'),
        ]);

        const turnover = +(wsData.buy_amount) + (+(wsData.sell_amount));
        const profitLoss = +(wsData.sell_amount) - (+(wsData.buy_amount));

        const startTimeString = template(tradingTimeTemplate, [startTime.format('YYYY-MM-DD HH:mm:ss') + ' GMT']);
        return {
            startTimeString: startTimeString,
            loginTime      : startTime.format('YYYY-MM-DD HH:mm:ss') + ' GMT',
            currentTime    : currentTime.format('YYYY-MM-DD HH:mm:ss') + ' GMT',
            sessionDuration: durationString,
            loginId        : wsData.loginid,
            currency       : wsData.currency,
            turnover       : (+turnover).toFixed(2),
            profitLoss     : (+profitLoss).toFixed(2),
            contractsBought: wsData.buy_count,
            contractsSold  : wsData.sell_count,
            openContracts  : wsData.open_contract_count,
            potentialProfit: (+(wsData.potential_profit)).toFixed(2),
        };
    };

    const set = function(key, value) {
        reality_object[key] = value;
        return LocalStore.set('reality_check.' + key, value);
    };

    // use this function to get variables that have values
    const get = function(key) {
        let value = reality_object[key] || LocalStore.get('reality_check.' + key) || '';
        if (+value === 1 || +value === 0 || value === 'true' || value === 'false') {
            value = JSON.parse(value || false);
        }
        return value;
    };

    const clear_storage_values = function() {
        // clear all reality check values from local storage except loginid
        Object.keys(localStorage).forEach(function(c) {
            if (/^reality_check\.(?!(loginid$))/.test(c)) {
                LocalStore.set(c, '');
            }
        });
    };

    return {
        getSummaryAsync: getSummaryAsync,
        clear          : clear_storage_values,
        resetInvalid   : resetInvalid,
        summaryData    : summaryData,
        set            : set,
        get            : get,
    };
})();

module.exports = {
    RealityCheckData: RealityCheckData,
};

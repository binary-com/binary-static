const template   = require('../../../base/utility').template;
const LocalStore = require('../../../base/storage').LocalStore;
const Client     = require('../../../base/client').Client;
const moment     = require('moment');

const RealityCheckData = (function() {
    'use strict';

    const defaultInterval = 600000;
    const durationTemplateString = '[_1] days [_2] hours [_3] minutes';
    const tradingTimeTemplate = 'Your trading statistics since [_1].';

    const getSummaryAsync = function() {
        BinarySocket.send({ reality_check: 1 });
    };

    const getAck = function() {
        return LocalStore.get('reality_check.ack');
    };

    const setOpenSummaryFlag = function() {
        LocalStore.set('reality_check.keep_open', 1);
    };

    const getOpenSummaryFlag = function() {
        return LocalStore.get('reality_check.keep_open');
    };

    const triggerCloseEvent = function() {
        LocalStore.set('reality_check.keep_open', 0);
    };

    const updateAck = function() {
        LocalStore.set('reality_check.ack', 1);
    };

    const getInterval = function() {
        return LocalStore.get('reality_check.interval');
    };

    const getPreviousLoadLoginId = function() {
        return LocalStore.get('reality_check.loginid');
    };

    const setPreviousLoadLoginId = function() {
        const id = Client.get_value('loginid');
        LocalStore.set('reality_check.loginid', id);
    };

    const updateInterval = function(ms) {
        LocalStore.set('reality_check.interval', ms);
    };

    const clear = function() {
        LocalStore.remove('reality_check.ack');
        LocalStore.remove('reality_check.interval');
        LocalStore.remove('reality_check.keep_open');
    };

    const resetInvalid = function() {
        const ack = LocalStore.get('reality_check.ack');
        const interval = +(LocalStore.get('reality_check.interval'));
        if (ack !== '0' && ack !== '1') {
            LocalStore.set('reality_check.ack', 0);
        }

        if (!interval) {
            LocalStore.set('reality_check.interval', defaultInterval);
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

    return {
        getSummaryAsync       : getSummaryAsync,
        getAck                : getAck,
        setOpenSummaryFlag    : setOpenSummaryFlag,
        getOpenSummaryFlag    : getOpenSummaryFlag,
        getPreviousLoadLoginId: getPreviousLoadLoginId,
        setPreviousLoadLoginId: setPreviousLoadLoginId,
        updateAck             : updateAck,
        getInterval           : getInterval,
        updateInterval        : updateInterval,
        clear                 : clear,
        resetInvalid          : resetInvalid,
        summaryData           : summaryData,
        triggerCloseEvent     : triggerCloseEvent,
    };
})();

module.exports = {
    RealityCheckData: RealityCheckData,
};

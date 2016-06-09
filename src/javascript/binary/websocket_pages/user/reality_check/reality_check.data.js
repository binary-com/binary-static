var RealityCheckData = (function () {
    'use strict';

    var defaultInterval = 600000;
    var durationTemplateString = '[_1] days [_2] hours [_3] minutes';
    var tradingTimeTemplate = 'Your trading statistics since [_1].';

    function getSummaryAsync() {
        BinarySocket.send({reality_check: 1});
    }

    function getAck() {
        return LocalStore.get('reality_check.ack');
    }

    function setOpenSummaryFlag() {
        LocalStore.set('reality_check.keep_open', 1);
    }

    function getOpenSummaryFlag() {
        return LocalStore.get('reality_check.keep_open');
    }

    function triggerCloseEvent() {
        LocalStore.set('reality_check.keep_open', 0);
    }
    
    function updateAck() {
        LocalStore.set('reality_check.ack', 1);
    }

    function getInterval() {
        return LocalStore.get('reality_check.interval');
    }

    function getPreviousLoadLoginId() {
        return LocalStore.get('reality_check.loginid');
    }

    function setPreviousLoadLoginId() {
        var id = TUser.get().loginid;
        LocalStore.set('reality_check.loginid', id);
    }

    function updateInterval(ms) {
        LocalStore.set('reality_check.interval', ms);
    }

    function clear() {
        LocalStore.remove('reality_check.ack');
        LocalStore.remove('reality_check.interval');
        LocalStore.remove('reality_check.keep_open');
        LocalStore.remove('reality_check.close');
        LocalStore.remove('reality_check.svrtime');
        LocalStore.remove('reality_check.basetime');
    }

    function resetInvalid() {
        var ack = LocalStore.get('reality_check.ack');
        var interval = +(LocalStore.get('reality_check.interval'));
        if (ack !== '0' && ack !== '1') {
            LocalStore.set('reality_check.ack', 0);
        }

        if (!interval) {
            LocalStore.set('reality_check.interval', defaultInterval);
        }
    }

    function summaryData(wsData) {
        var startTime = moment.utc(new Date(wsData.start_time * 1000));
        var currentTime = moment.utc();

        var sessionDuration = moment.duration(currentTime.diff(startTime));
        var durationD = sessionDuration.get('days');
        var durationH = sessionDuration.get('hours');
        var durationM = sessionDuration.get('minutes');

        var durationString = durationTemplateString
            .replace('[_1]', durationD)
            .replace('[_2]', durationH)
            .replace('[_3]', durationM);

        var turnover = +(wsData.buy_amount) + (+(wsData.sell_amount));
        var profitLoss = +(wsData.sell_amount) - (+(wsData.buy_amount));

        var startTimeString = tradingTimeTemplate.replace('[_1]', startTime.format('YYYY-MM-DD HH:mm:ss') + ' GMT');
        return {
            startTimeString: startTimeString,
            loginTime: startTime.format('YYYY-MM-DD HH:mm:ss') + ' GMT',
            currentTime: currentTime.format('YYYY-MM-DD HH:mm:ss') + ' GMT',
            sessionDuration: durationString,
            loginId: wsData.loginid,
            currency: wsData.currency,
            turnover: (+turnover).toFixed(2),
            profitLoss: (+profitLoss).toFixed(2),
            contractsBought: wsData.buy_count,
            contractsSold: wsData.sell_count,
            openContracts: wsData.open_contract_count,
            potentialProfit: (+(wsData.potential_profit)).toFixed(2)
        };
    }

    return {
        getSummaryAsync: getSummaryAsync,
        getAck: getAck,
        setOpenSummaryFlag: setOpenSummaryFlag,
        getOpenSummaryFlag: getOpenSummaryFlag,
        getPreviousLoadLoginId: getPreviousLoadLoginId,
        setPreviousLoadLoginId: setPreviousLoadLoginId,
        updateAck: updateAck,
        getInterval: getInterval,
        updateInterval: updateInterval,
        clear: clear,
        resetInvalid: resetInvalid,
        summaryData: summaryData,
        triggerCloseEvent: triggerCloseEvent
    };
}());

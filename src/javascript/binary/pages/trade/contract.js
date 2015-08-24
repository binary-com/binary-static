/*
 * Contract object mocks the trading form we have on our website
 * It parses the contracts json we get from socket.send({contracts_for: 'R_50'})
 * and gives back barriers, startDate, durations etc
 *
 *
 * Usage:
 *
 * use `Contract.details` to populate this object
 *
 * then use
 *
 * `Contract.durations()` to get durations like seconds, hours etc
 * `Contract.open()` `Contract.close()`
 * `Contract.barriers` if applicable for current underlying
 */
var Contract = (function () {
    'use strict';

    var open, close, contractDetails = [], durations = {}, startDates = [], barriers = {}, contractType = {};

    var populate_durations = function (currentContract) {
        if (!durations[currentContract['expiry_type']]) {
            durations[currentContract['expiry_type']] = {};
        }

        if(!durations[currentContract['expiry_type']][currentContract['contract_category']]) {
            durations[currentContract['expiry_type']][currentContract['contract_category']] = {};
        }

        if(!durations[currentContract['expiry_type']][currentContract['contract_category']][currentContract['barrier_category']]) {
            durations[currentContract['expiry_type']][currentContract['contract_category']][currentContract['barrier_category']] = {};
        }

        if(!durations[currentContract['expiry_type']][currentContract['contract_category']][currentContract['barrier_category']][currentContract['start_type']]) {
            durations[currentContract['expiry_type']][currentContract['contract_category']][currentContract['barrier_category']][currentContract['start_type']] = {};
        }

        durations[currentContract['expiry_type']][currentContract['contract_category']][currentContract['barrier_category']][currentContract['start_type']]['max_contract_duration'] = currentContract['max_contract_duration'];

        durations[currentContract['expiry_type']][currentContract['contract_category']][currentContract['barrier_category']][currentContract['start_type']]['min_contract_duration'] = currentContract['min_contract_duration'];
    };

    var details = function (contractObject) {
        var contracts = contractObject['contracts_for'],
            contractsArray = [];

        startDates = [];
        durations = {};
        open = contracts['open'];
        close = contracts['close'];

        var formName = Offerings.form(),
            barrierCategory = Offerings.barrier();

        if (formName) {
            contracts.available.forEach(function (currentObj) {
                if (formName === currentObj['contract_category']) {

                    if (barrierCategory) {
                        if (barrierCategory === currentObj['barrier_category']) {
                            populate_durations(currentObj);
                        }
                    } else {
                        populate_durations(currentObj);
                    }

                    if (currentObj.forward_starting_options && currentObj['start_type'] === 'forward') {
                        startDates = currentObj.forward_starting_options;
                    }

                    contractsArray.push(currentObj);

                    var barrier = {};
                    if (currentObj.barriers === 1) {
                        if (!barriers.hasOwnProperty(currentObj['contract_category'])) {
                            barrier['count'] = 1;
                            barrier['barrier'] = currentObj['barrier'];
                            barrier['barrier_category'] = currentObj['barrier_category'];
                            barriers[formName] = barrier;
                        }
                    } else if (currentObj.barriers === 2) {
                        if (!barriers.hasOwnProperty(currentObj['contract_category'])) {
                            barrier['count'] = 2;
                            barrier['barrier'] = currentObj['high_barrier'];
                            barrier['barrier1'] = currentObj['low_barrier'];
                            barrier['barrier_category'] = currentObj['barrier_category'];
                            barriers[formName] = barrier;
                        }
                    }

                    if (!contractType[currentObj['contract_category']]) {
                        contractType[currentObj['contract_category']] = {};
                    }

                    if (!contractType[currentObj['contract_category']].hasOwnProperty(currentObj['contract_type'])) {
                        contractType[currentObj['contract_category']][currentObj['contract_type']] = currentObj['contract_display'];
                    }
                }
            });

            if (barrierCategory) {
                if (barriers && barriers[formName] && barriers[formName]['barrier_category'] !== barrierCategory) {
                    barriers = {};
                }

                var j = contractsArray.length;
                while (j--) {
                    if (barrierCategory !== contractsArray[j]['barrier_category']) {
                        contractsArray.splice(j, 1);
                    }
                }
            }
        }
        contractDetails = contractsArray;
    };

    var getContracts = function(underlying){
        var params = { contracts_for: { symbol: underlying } }
        TradeSocket.send(params);
    }

    return {
        details: details,
        open: function () { return open; },
        close: function () { return close; },
        contracts: function () { return contractDetails; },
        durations: function () { return durations; },
        startDates: function () { return startDates; },
        barriers: function () { return barriers; },
        contractType: function () { return contractType; },
        getContracts: getContracts
    };

})();

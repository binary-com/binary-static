if (isJapanTrading()) {
    var Contract = (function() {
        'use strict';

        var contractDetails = {},
            contractType = {},
            periods = {},
            open, close, form, barrier;

        var populate_periods = function(currentContract) {
            var currentCategory = currentContract['contract_category'];
            if (!periods[currentCategory]) {
                periods[currentCategory] = {};
            }

            if (!periods[currentCategory][currentContract.underlying_symbol]) {
                periods[currentCategory][currentContract.underlying_symbol] = {};
            }

            var period = currentContract['trading_period']['date_start']['epoch'] + '_' + currentContract['trading_period']['date_expiry']['epoch'];

            periods[currentCategory][currentContract['underlying_symbol']][period] = {
                available_barriers: currentContract['available_barriers'],
                barrier: currentContract['barrier'],
                high_barrier: currentContract['high_barrier'],
                low_barrier: currentContract['low_barrier'],
                barriers: currentContract['barriers'],
                date_start: currentContract['trading_period']['date_start'],
                date_expiry: currentContract['trading_period']['date_expiry'],
                duration: currentContract['trading_period']['duration']
            };
        };

        var details = function(formName) {
            var contracts = Contract.contracts()['contracts_for'],
                contractCategories = {},
                barrierCategory;

            open = contracts['open'];
            close = contracts['close'];

            var formBarrier = getFormNameBarrierCategory(formName);
            form = formName = formBarrier['formName'];
            barrier = barrierCategory = formBarrier['barrierCategory'];

            contracts.available.forEach(function(currentObj) {
                var contractCategory = currentObj['contract_category'];

                if (formName && formName === contractCategory) {

                    populate_periods(currentObj);

                    if (!contractType[contractCategory]) {
                        contractType[contractCategory] = {};
                    }

                    if (!contractType[contractCategory].hasOwnProperty(currentObj['contract_type'])) {
                        contractType[contractCategory][currentObj['contract_type']] = currentObj['contract_display'];
                    }
                }
            });
        };

        var getContracts = function(underlying) {
            BinarySocket.send({ contracts_for: underlying, region: 'japan' });
        };

        var getContractForms = function() {
            var contracts = Contract.contracts()['contracts_for'],
                tradeContractForms = {};

            contracts.available.forEach(function(currentObj) {
                var contractCategory = currentObj['contract_category'];
                if (contractCategory && !tradeContractForms.hasOwnProperty(contractCategory)) {
                    if (contractCategory === 'callput') {
                        if (currentObj['barrier_category'] === 'euro_atm') {
                            tradeContractForms['risefall'] = Content.localize().textFormRiseFall;
                        } else {
                            tradeContractForms['higherlower'] = Content.localize().textFormHigherLower;
                        }
                    } else {
                        tradeContractForms[contractCategory] = text.localize(currentObj['contract_category_display']);
                    }
                }
            });

            if (tradeContractForms.risefall || tradeContractForms.higherlower) {
                tradeContractForms['updown'] = Content.localize().textFormUpDown;
            }

            if (tradeContractForms.endsinout || tradeContractForms.staysinout) {
                tradeContractForms['inout'] = Content.localize().textFormInOut;
            }

            return tradeContractForms;
        };

        return {
            details: details,
            getContracts: getContracts,
            contractForms: getContractForms,
            open: function() {
                return open; },
            close: function() {
                return close; },
            contracts: function() {
                return contractDetails; },
            durations: function() {
                return false; },
            startDates: function() {
                return false; },
            barriers: function() {
                return false; },
            periods: function() {
                return periods; },
            contractType: function() {
                return contractType; },
            form: function() {
                return form; },
            barrier: function() {
                return barrier; },
            setContracts: function(data) {
                contractDetails = data;
            }
        };

    })();
}

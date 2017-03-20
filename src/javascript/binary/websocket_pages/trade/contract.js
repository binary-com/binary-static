const getFormNameBarrierCategory = require('./common').getFormNameBarrierCategory;
const Language                   = require('../../base/language');
const localize                   = require('../../base/localize').localize;
const objectNotEmpty             = require('../../base/utility').objectNotEmpty;
const Content                    = require('../../common_functions/content').Content;

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
const Contract = (function() {
    'use strict';

    const contractType = {};
    let contractDetails = {},
        barriers = {},
        durations = {},
        startDates = {},
        open,
        close,
        form,
        barrier;

    const populate_durations = function(currentContract) {
        const currentCategory  = currentContract.contract_category,
            expiry_type      = currentContract.expiry_type,
            barrier_category = currentContract.barrier_category,
            start_type       = currentContract.start_type,
            max_duration     = currentContract.max_contract_duration,
            min_duration     = currentContract.min_contract_duration;

        if (!durations[expiry_type]) {
            durations[expiry_type] = {};
        }

        if (!durations[expiry_type][currentCategory]) {
            durations[expiry_type][currentCategory] = {};
        }

        if (!durations[expiry_type][currentCategory][barrier_category]) {
            durations[expiry_type][currentCategory][barrier_category] = {};
        }

        if (!durations[expiry_type][currentCategory][barrier_category][start_type]) {
            durations[expiry_type][currentCategory][barrier_category][start_type] = {};
        }

        durations[expiry_type][currentCategory][barrier_category][start_type].max_contract_duration = max_duration;

        durations[expiry_type][currentCategory][barrier_category][start_type].min_contract_duration = min_duration;
    };

    const details = function(formName) {
        const contracts = Contract.contracts().contracts_for;
        let barrierCategory;

        if (!contracts) return;

        startDates = { has_spot: 0, list: [] };
        durations = {};
        open = contracts.open;
        close = contracts.close;

        const formBarrier = getFormNameBarrierCategory(formName);
        form = formName = formBarrier.formName;
        barrier = barrierCategory = formBarrier.barrierCategory;

        contracts.available.forEach(function(currentObj) {
            const contractCategory = currentObj.contract_category;

            if (formName && formName === contractCategory) {
                if (barrierCategory) {
                    if (barrierCategory === currentObj.barrier_category) {
                        populate_durations(currentObj);
                    }
                } else {
                    populate_durations(currentObj);
                }

                if (currentObj.forward_starting_options && currentObj.start_type === 'forward' && sessionStorage.formname !== 'higherlower') {
                    startDates.list = currentObj.forward_starting_options;
                } else if (currentObj.start_type === 'spot') {
                    startDates.has_spot = 1;
                }

                const symbol = currentObj.underlying_symbol;
                if (currentObj.barrier_category && currentObj.barrier_category !== 'non_financial') {
                    if (!barriers.hasOwnProperty(symbol)) {
                        barriers[symbol] = {};
                    }
                    if (currentObj.barriers === 1) {
                        barriers[symbol][contractCategory] = {
                            count           : 1,
                            barrier         : currentObj.barrier,
                            barrier_category: currentObj.barrier_category,
                        };
                    } else if (currentObj.barriers === 2) {
                        barriers[symbol][contractCategory] = {
                            count           : 2,
                            barrier         : currentObj.high_barrier,
                            barrier1        : currentObj.low_barrier,
                            barrier_category: currentObj.barrier_category,
                        };
                    }
                }

                if (!contractType[contractCategory]) {
                    contractType[contractCategory] = {};
                }

                const type = currentObj.contract_type;
                if (!contractType[contractCategory].hasOwnProperty(type)) {
                    contractType[contractCategory][type] = localize(currentObj.contract_display);
                }
            }
        });

        if (formName && barrierCategory) {
            if (barriers && barriers[formName] && barriers[formName].barrier_category !== barrierCategory) {
                barriers = {};
            }
        }
    };

    const getContracts = function(underlying) {
        BinarySocket.send({ contracts_for: underlying });
    };

    const getContractForms = function() {
        const contracts = Contract.contracts().contracts_for,
            tradeContractForms = {};

        if (!contracts) return null;

        contracts.available.forEach(function(currentObj) {
            const contractCategory = currentObj.contract_category;
            if (contractCategory && !tradeContractForms.hasOwnProperty(contractCategory)) {
                if (contractCategory === 'callput') {
                    if (currentObj.barrier_category === 'euro_atm') {
                        tradeContractForms.risefall = Content.localize().textFormRiseFall;
                    } else {
                        tradeContractForms.higherlower = Content.localize().textFormHigherLower;
                    }
                } else {
                    tradeContractForms[contractCategory] = localize(currentObj.contract_category_display);
                    if (contractCategory === 'digits') {
                        tradeContractForms.matchdiff = Content.localize().textFormMatchesDiffers;
                        if (Language.get() !== 'ID') {
                            tradeContractForms.evenodd = Content.localize().textFormEvenOdd;
                            tradeContractForms.overunder = Content.localize().textFormOverUnder;
                        }
                    }
                }
            }
        });

        if (!objectNotEmpty(tradeContractForms)) return null;

        if (tradeContractForms.risefall || tradeContractForms.higherlower) {
            tradeContractForms.updown = Content.localize().textFormUpDown;
        }

        if (tradeContractForms.endsinout || tradeContractForms.staysinout) {
            tradeContractForms.inout = Content.localize().textFormInOut;
        }

        return tradeContractForms;
    };

    return {
        details      : details,
        getContracts : getContracts,
        contractForms: getContractForms,
        open         : function() {
            return open;
        },
        close: function() {
            return close;
        },
        contracts: function() {
            return contractDetails;
        },
        durations: function() {
            return durations;
        },
        startDates: function() {
            return startDates;
        },
        barriers: function() {
            return barriers;
        },
        contractType: function() {
            return contractType;
        },
        form: function() {
            return form;
        },
        barrier: function() {
            return barrier;
        },
        setContracts: function(data) {
            contractDetails = data;
        },
    };
})();

module.exports = {
    Contract: Contract,
};

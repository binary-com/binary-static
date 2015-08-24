var Contract = (function(){
	'use strict';
    var open, close, contractDetails = [], periods={}, contractType = {};

    var populate_periods = function (currentContract){
    	if(!periods[currentContract.contract_category]){
    		periods[currentContract.contract_category] = {};
    	}

    	if(!periods[currentContract.contract_category][currentContract.underlying_symbol]){
    		periods[currentContract.contract_category][currentContract.underlying_symbol] = {};
    	}

    	var period = currentContract.trading_period.date_start.epoch+'_'+currentContract.trading_period.date_expiry.epoch;

    	// console.log(period, currentContract.expiry_type,currentContract);

    	periods[currentContract.contract_category][currentContract.underlying_symbol][period] = {
    		available_barriers: currentContract.available_barriers,
    		barrier: currentContract.barrier,
    		high_barrier: currentContract.high_barrier,
    		low_barrier: currentContract.low_barrier,
    		barriers: currentContract.barriers,
    		// expiry_type: currentContract.expiry_type,
    		date_start: currentContract.trading_period.date_start,
    		date_expiry: currentContract.trading_period.date_expiry,
    		duration: currentContract.trading_period.duration
    	}
    }

    var details = function (contractObject) {
    	var contracts = contractObject['contracts_for'],
    	    contractsArray = [];

    	open = contracts['open'];
    	close = contracts['close'];

    	var formName = Offerings.form(),
    	    barrierCategory = Offerings.barrier();

    	if (formName) {
    		contracts.available.forEach(function (currentObj) {
    			if (formName === currentObj['contract_category']) {

    				populate_periods(currentObj)
    				contractsArray.push(currentObj);

    				if (!contractType[currentObj['contract_category']]) {
    				    contractType[currentObj['contract_category']] = {};
    				}

    				if (!contractType[currentObj['contract_category']].hasOwnProperty(currentObj['contract_type'])) {
    				    contractType[currentObj['contract_category']][currentObj['contract_type']] = currentObj['contract_display'];
    				}
    			}
    		})	
    	}
    	contractDetails = contractsArray;
    }

    var getContracts = function(underlying){
        var params = { contracts_for: { symbol: underlying, region: 'japan' } }
        TradeSocket.send(params);
    }

    return {
        details: details,
        open: function () { return open },
        close: function () { return close },
        contracts: function () { return contractDetails },
        durations: function(){ return false },
        startDates: function(){ return false },
        barriers: function () { return false },
        periods: function(){ return periods },
        contractType: function () { return contractType },
        getContracts: getContracts
    };

})()
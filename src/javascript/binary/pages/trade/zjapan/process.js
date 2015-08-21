var processContractFormOfferings = function(contracts){
	
	'use strict';

	Contract.details(contracts);

	displayDurations('spot');

	displayStartDates();

	displayBarriers();

	Periods.displayPeriods();

	processPriceRequest();
}
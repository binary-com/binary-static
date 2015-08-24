var processContractFormOfferings = function(contracts){
	
	'use strict';

	Contract.details(contracts);

	// forget the old tick id i.e. close the old tick stream
	processForgetTickId();
	// get ticks for current underlying
	TradeSocket.send({ ticks : sessionStorage.getItem('underlying') });

	displayDurations('spot');

	displayStartDates();

	displayBarriers();

	Periods.displayPeriods();

	processPriceRequest();
}
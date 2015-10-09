if(typeof is_japan === 'function'){

	var processContractForm = function(){
	    Contract.details(sessionStorage.getItem('formname'));

	    displayStartDates();

	    displayDurations();
	    
	    if(Periods){
	    	Periods.displayPeriods();
	    }

	    displayPrediction();
	    
	    processPriceRequest();
	};

}

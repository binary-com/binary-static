if(typeof is_japan === 'function'){

	var processContractForm = function(){
	    Contract.details(sessionStorage.getItem('formname'));

	    StartDates.display();

	    Durations.display();
	    
	    if(Periods){
	    	Periods.displayPeriods();
	    }

	    displayPrediction();
	    
	    processPriceRequest();
	};

}
